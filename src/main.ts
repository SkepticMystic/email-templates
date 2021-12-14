import emlFormat from "eml-format";
import * as fs from "fs/promises";
import * as Handelbars from "handlebars";
import { cloneDeep } from "lodash";
import { Editor, Plugin } from "obsidian";
import { DEFAULT_SETTINGS } from "./consts";
import { MyPluginSettings, ParsedEML } from "./interfaces";
import { SettingTab } from "./SettingTab";

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SettingTab(this.app, this));

    this.addCommand({
      id: "import-email",
      name: "Import Email",
      editorCallback: async (editor: Editor) => {
        const file = await selectFile();

        const parsedEML = await this.parseEML(file[0].path);
        const postProcessed = this.postProcessParsedEML(parsedEML);

        const template = Handelbars.compile(
          postProcessTemplate(this.settings.template)
        );

        const output = template(postProcessed);
        console.log({ output });

        editor.replaceRange(output, editor.getCursor("to"));
      },
    });
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async parseEML(path: string) {
    const eml = await fs.readFile(path, "utf-8");
    let parsedEML: ParsedEML;
    emlFormat.read(eml, function (error: Error, data: ParsedEML) {
      if (error) return console.log(error);
      console.log(data);
      parsedEML = data;
    });
    return parsedEML;
  }

  postProcessParsedEML(parsedEML: ParsedEML) {
    const copy = cloneDeep(parsedEML);
    copy.attachments.forEach((attachment, i) => {
      const name = attachment.contentType
        .match(/; name=".+?"/g)?.[0]
        .match(/; name="(.+?)"/)?.[1];

      copy.attachments[i].name = name;
    });

    copy.date = copy.date.toLocaleDateString();

    copy.to = [copy.to].flat(10);
    return copy;
  }
}

const commaListTemplate = (arr: string, inner: string) =>
  `{{#each ${arr}}}${inner}{{#unless @last}}, {{/unless}}{{/each}}`;

function postProcessTemplate(template: string) {
  template = template
    .replaceAll(
      "{{from}}",
      commaListTemplate("from", "{{this.name}} ({{this.email}})")
    )
    .replaceAll("{{from.name}}", commaListTemplate("from", "{{this.name}}"))
    .replaceAll("{{from.email}}", commaListTemplate("from", "{{this.email}}"))
    .replaceAll(
      "{{from}}",
      commaListTemplate("to", "{{this.name}} ({{this.email}})")
    )
    .replaceAll("{{to.name}}", commaListTemplate("to", "{{this.name}}"))
    .replaceAll("{{to.email}}", commaListTemplate("to", "{{this.email}}"))
    .replaceAll(
      "{{attachments}}",
      "{{#each attachments}}{{#if this.name}}{{this.name}}{{#unless @last}}, {{/unless}}{{/if}}{{/each}}"
    );

  return template;
}

/**
 * Select file(s).
 * @param {string} contentType The content type of files you wish to select. For instance, use "image/*" to select all types of images.
 * @param {boolean} multiple Indicates if the user can select multiple files.
 * @returns {Promise<File[]>} A promise of a file or array of files in case the multiple parameter is true.
 */
function selectFile(
  contentType: string = "message/rfc822",
  multiple: boolean = false
): Promise<File[]> {
  return new Promise((resolve) => {
    let input = document.createElement("input");
    input.type = "file";
    input.multiple = multiple;
    input.accept = contentType;

    input.onchange = (_) => {
      let files = Array.from(input.files);
      if (multiple) resolve(files);
      else resolve([files[0]]);
    };

    input.click();
  });
}

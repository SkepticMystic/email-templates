import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, DEFAULT_TEMPLATE } from "./consts";
import { ParsedEML, MyPluginSettings } from "./interfaces";
import { SettingTab } from "./SettingTab";
import emlFormat from "eml-format";
import * as fs from "fs/promises";
import * as Handelbars from "handlebars";

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SettingTab(this.app, this));

    this.addCommand({
      id: "parse-email",
      name: "Parse Email",
      callback: async () => {
        const file = await selectFile();
        console.log({ file });

        let parsedEML = await this.parseEML(file[0].path);
        parsedEML = this.postProcessParsedEML(parsedEML);

        const template = Handelbars.compile(
          postProcessTemplate(DEFAULT_TEMPLATE)
        );
        console.log(template(parsedEML));
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
    parsedEML.attachments.forEach((attachment, i) => {
      const name = attachment.contentType
        .match(/; name=".+?"/g)?.[0]
        .match(/; name="(.+?)"/)?.[1];
      console.log({ name });
      parsedEML.attachments[i].name = name;
    });

    parsedEML.to = [parsedEML.to].flat(10);
    return parsedEML;
  }
}

const commaListTemplate = (arr: string, inner: string, condition = "true") =>
  `{{#each ${arr}}}${inner}{{#unless @last}}, {{/unless}}{{/each}}`;

function postProcessTemplate(template: string) {
  template = template
    .replaceAll(
      "{{to}}",
      commaListTemplate("to", "{{this.name}} ({{this.email}})")
    )
    .replaceAll("{{to.name}}", commaListTemplate("to", "{{this.name}}"))
    .replaceAll("{{to.email}}", commaListTemplate("to", "{{this.email}}"))
    .replaceAll(
      "{{attachments}}",
      commaListTemplate("attachments", "{{this.name}}")
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

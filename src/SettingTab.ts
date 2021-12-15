import { App, PluginSettingTab, Setting } from "obsidian";
import MyPlugin from "./main";

export class SettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl, plugin } = this;
    containerEl.empty();
    containerEl.classList.add('emails-settings')
    const { settings } = this.plugin;

    const templateDesc = new DocumentFragment();
    const templateDescDiv = templateDesc.createDiv();
    templateDescDiv.classList.add("template-description");
    templateDescDiv.innerHTML = `The template to use when creating a new file.<br/>
    <code>{{attachments}}</code>: list of attachments<br/>

    <code>{{to}}</code>: list of recipients (name + email)<br/>
    <ul>
    <li><code>{{to.name}}</code>: list of recipient names<br/></li>
    <li><code>{{to.email}}</code>: list of recipient emails<br/></li>
    </ul>
    <br/>
    <code>{{from}}</code>: sender (name + email)<br/>
    <ul>
    <li><code>{{from.name}}</code>: sender name<br/></li>
    <li><code>{{from.email}}</code>: sender email<br/></li>
    </ul>
    <br/>
    <code>{{subject}}</code>: subject<br/>
    <code>{{text}}</code>: text body<br/>
    <code>{{date}}</code>: date`;

    new Setting(containerEl)
      .setName("Template")
      .setDesc(templateDesc)
      .addTextArea((ta) => {
        ta.setValue(settings.template).onChange(async (value) => {
          settings.template = value;
          await plugin.saveSettings();
        });
      });
  }
}

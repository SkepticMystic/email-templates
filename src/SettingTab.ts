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
    const { settings } = this.plugin;

    const templateDesc = new DocumentFragment();
    templateDesc.createDiv().innerHTML = `The template to use when creating a new file.<br/>
    <strong>{{attachments}}</strong> → list of attachments<br/>

    <strong>{{to}}</strong> → list of recipients (name + email)<br/>
    <ul>
    <li><strong>{{to.name}}</strong> → list of recipient names<br/></li>
    <li><strong>{{to.email}}</strong> → list of recipient emails<br/></li>
    </ul>
    <br/>
    <strong>{{from}}</strong> → sender (name + email)<br/>
    <ul>
    <li><strong>{{from.name}}</strong> → sender name<br/></li>
    <li><strong>{{from.email}}</strong> → sender email<br/></li>
    </ul>
    <br/>
    <strong>{{subject}}</strong> → subject<br/>
    <strong>{{text}}</strong> → text body<br/>
    <strong>{{date}}</strong> → date`;

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

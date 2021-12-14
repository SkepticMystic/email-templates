import { Plugin } from "obsidian";
import { SettingTab } from "./SettingTab";

interface MyPluginSettings {}

const DEFAULT_SETTINGS: MyPluginSettings = {};

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: "cmd",
      name: "Command",
      callback: () => {},
    });
    this.addSettingTab(new SettingTab(this.app, this));
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

import { MyPluginSettings } from "./interfaces";

export const DEFAULT_TEMPLATE = `From: {{from.name}} 
On: {{date}}
To: {{to.name}}
Attachments: {{attachments}}


## {{subject}}

{{text}}
`;

export const DEFAULT_SETTINGS: MyPluginSettings = {
  template: DEFAULT_TEMPLATE,
};

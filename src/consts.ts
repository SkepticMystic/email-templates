import { MyPluginSettings } from "./interfaces";

export const DEFAULT_SETTINGS: MyPluginSettings = {};

export const DEFAULT_TEMPLATE = `
From: {{from.name}} 
On: {{date}}
To: {{to.name}}
Attachments: {{attachments}}


## {{subject}}

{{text}}
`;

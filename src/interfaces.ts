export interface MyPluginSettings {
  template: string;
}

interface Person {
  name: string;
  email: string;
}

export interface ParsedEML {
  attachments: Attachment[];
  date: Date;
  from: Person | Person[];
  headers: Headers;
  subject: string;
  to: Person | Person[];
}

export interface Attachment {
  id?: string;
  contentType: string;
  data: Uint8Array;
  inline: boolean;
  name: string;
}

interface Headers {
  "Accept-Language": string;
  "Content-Language": string;
  "Content-Type": string;
  Date: string;
  "Delivered-To": string;
  From: string;
  "MIME-Version": string;
  "Message-ID": string;
  Received: string[];
  "Return-Path": string;
  Subject: string;
  "Thread-Index": string;
  "Thread-Topic": string;
  To: string;
  "X-Mimecast-Originator": string;
  "X-Mimecast-Spam-Score": string;
  "X-OriginatorOrg": string;
  "X-Received": string;
}

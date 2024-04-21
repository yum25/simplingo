export enum Message {
  LANGUAGE_REQUEST,
  LANGUAGE_RESPONSE,
  BACKGROUND_REQUEST,
  BACKGROUND_RESPONSE,
  OPEN_DIALOG,
  REVERT,
  REVERT_RESPONSE,
  DISABLE,
  UPDATE,
  CANCEL,
  REGENERATE
}

export interface MessageData {
  id?: number;
  text?: string;
  tagName?: string;
  index?: number;
  translate?: boolean;
  simplify?: boolean;
  language?: string;
  requests?: LanguageRequest["requests"];
  tabID?: number;
  reverted?: boolean;
  error?: Error;
}

export interface LanguageRequest {
  url: string;
  data: MessageData;
  requests: Array<{ text: string; error: Error | undefined } | false>;
  timestamp: string;
}

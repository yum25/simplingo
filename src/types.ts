export enum Message {
  LANGUAGE_REQUEST,
  LANGUAGE_RESPONSE,
  BACKGROUND_REQUEST,
  BACKGROUND_RESPONSE,
  OPEN_DIALOG,
  REVERT,
  DISABLE,
  UPDATE,
}

export interface MessageData {
  text?: string;
  index?: number;
  translate?: boolean;
  simplify?: boolean;
  language?: string;
  requests?: LanguageRequest["requests"];
  tabID?: number;
  error?: Error;
}

export interface LanguageRequest {
  url: string;
  data: MessageData;
  requests: Array<{ text: string; error: string | null } | false>;
  timestamp: string;
}

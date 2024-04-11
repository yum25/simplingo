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
}

export interface MessageData {
  text?: string;
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
  requests: Array<{ text: string; error: string | null } | false>;
  timestamp: string;
}

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
  requests?: Array<boolean>;
  tabID?: number;
  error?: Error;
}

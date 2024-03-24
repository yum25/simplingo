export enum Message {
  REQUEST,
  RESPONSE,
  GET_REQUEST,
  GET_RESPONSE,
  OPEN_DIALOG,
  REVERT,
  DISABLE,
  ENABLE,
}

export interface MessageData {
  text?: string;
  index?: number;
  translate?: boolean;
  simplify?: boolean;
  language?: string;
  error?: Error;
}

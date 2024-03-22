export enum Message {
  REQUEST,
  RESPONSE,
  GET_REQUEST,
  GET_RESPONSE,
  OPEN_DIALOG,
  REVERT,
}

export interface MessageData {
  text?: string;
  index?: number;
  translate?: boolean;
  simplify?: boolean;
  language?: string;
  error?: Error;
}

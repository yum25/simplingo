export enum Message {
    REQUEST,
    RESPONSE,
    OPEN_DIALOG,
}

export interface MessageData {
    text?: string,
    translate?: boolean,
    simplify?: boolean,
    language?: string,
}
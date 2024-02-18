export enum Message {
    REQUEST,
    RESPONSE,
    SIDEBAR_TOGGLE
}

export interface MessageData {
    text?: string,
    translate?: boolean,
    simplify?: boolean,
    language?: string,
}
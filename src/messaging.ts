import browser, { Tabs } from "webextension-polyfill";
import { Message, MessageData } from "./types";

export async function sendMessage(tabID:number, type:Message, data:MessageData) {
    try {
      const response = await browser.tabs.sendMessage(tabID, { type, data });
      return response;
    } catch (error) {
      console.error("Failed to send request: ", error);
      return error;
    }
  };

export function sendRequest(type:Message, data:MessageData) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      tabs.forEach((tab:Tabs.Tab) => {
        if (tab.id) return sendMessage(tab.id, type, data);
      });
    });
  }

export async function sendResponse(type:Message, data:MessageData) {
    const response = browser.runtime.sendMessage({ type, data })
    return response;
}

export function addMessageListener(messageHandler:Function) {
    browser.runtime.onMessage.addListener((message, sender) => {
        const { type, data } = message;
        try {
          messageHandler(type, data);
        }
        catch (error) {
          console.error("Failed to handle request: ", error);
        }
      });
}

import browser from "webextension-polyfill";

async function sendMessage(tabID, type, data) {
    try {
      const response = await browser.tabs.sendMessage(tabID, { type, data });
      return response;
    } catch (error) {
      console.error("Failed to send request: ", error);
      return error;
    }
  };

export function sendRequest(type, data) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      tabs.forEach((tab) => {
        return sendMessage(tab.id, type, data);
      });
    });
  }

export function addRequestListener(messageHandler) {
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
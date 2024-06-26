import {
  addMessageListener,
  sendRequest as sendBackgroundResponse,
} from "./messaging";
import { getValueFromStorage, setValueToStorage } from "./storage";
import browser, { Tabs } from "webextension-polyfill";
import { Message, MessageData } from "./types";

browser.action.onClicked.addListener(async (tab: Tabs.Tab) => {
  const value = await getValueFromStorage("sidebarOpen");
  setValueToStorage("sidebarOpen", !value);
});

const handleMessage = async (type: Message, data: MessageData) => {
  switch (type) {
    case Message.BACKGROUND_REQUEST:
      fetch(
        `http://127.0.0.1:5000/get_text?translate=${data.translate}&simplify=${data.simplify}&target_lang=${data.language}&tagName=${data.tagName}&text=${data.text}`
      )
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`${resp.status}: ${resp.statusText}`);
          }
          return resp.json();
        })
        .then((query) => {
          sendBackgroundResponse(
            Message.BACKGROUND_RESPONSE,
            {
              id: data.id,
              text: query.text,
              index: data.index,
              error: query.error,
            },
            data.tabID
          );
        })
        .catch((error) => {
          console.log(error);
          sendBackgroundResponse(
            Message.BACKGROUND_RESPONSE,
            { error },
            data.tabID
          );
        });
      break;
    default:
      sendBackgroundResponse(type, data);
      break;
  }
};

addMessageListener(handleMessage);

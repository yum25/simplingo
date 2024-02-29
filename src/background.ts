import { addMessageListener, sendRequest as sendBackgroundResponse } from "./messaging";
import { getValueFromStorage, setValueToStorage } from "./storage";
import browser, { Tabs } from "webextension-polyfill";
import { Message, MessageData } from "./types";

browser.action.onClicked.addListener(async (tab:Tabs.Tab) => {
  const value = await getValueFromStorage('sidebarOpen');
  setValueToStorage('sidebarOpen', !value);
  })

const handleMessage = async (type:Message, data:MessageData) => {
  switch(type) {
    case (Message.GET_REQUEST):
      fetch(`http://127.0.0.1:5000/get_text?translate=${data.translate}&simplify=${data.simplify}&text=${data.text}&target_lang=${data.language}`)
      .then((resp) => {
          if (!resp.ok) {
              throw new Error(`${resp.status}: ${resp.statusText}`);
          }
          return resp.json();
      })
      .then((data) => {
        sendBackgroundResponse(Message.GET_RESPONSE, { text: data.text, error: data.error });
      })
      .catch((error) => {
        console.log(error);
        sendBackgroundResponse(Message.GET_RESPONSE, { error })
      });
      break;
    default:
      break;
  }
  
}

addMessageListener(handleMessage);

// TODO: default case should forward message to content scripts, allowing content scripts to communicate with each other.
import { sendMessage } from "./messaging";
import { MESSAGE } from "./types";
import browser from "webextension-polyfill";

browser.action.onClicked.addListener((tab) => {
    sendMessage(tab.id, MESSAGE.SIDEBAR_TOGGLE, {} )
  })
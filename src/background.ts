import { getValueFromStorage, setValueToStorage } from "./storage";
import browser, { Tabs } from "webextension-polyfill";

browser.action.onClicked.addListener(async (tab:Tabs.Tab) => {
  const value = await getValueFromStorage('sidebarOpen');
  setValueToStorage('sidebarOpen', !value);
  })
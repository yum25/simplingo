import { sendResponse as forwardRequest } from "./messaging";
import { getValueFromStorage, setValueToStorage } from "./storage";
import { Message } from "./types";

const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
const openKey = isMac ? "å" : "a";
const translateKey = isMac ?"†" : "t"
const simplifyKey = isMac ? "ß" : "s"
const translateSimplifyKey = isMac ? "©" : "g";

document.addEventListener("keydown", async function (e) {
  const command = isMac ? e.metaKey : e.ctrlKey;
  if (command && e.altKey && e.key === openKey) {
    const value = await getValueFromStorage("sidebarOpen");
    setValueToStorage("sidebarOpen", !value);
  } else if (command && e.altKey && e.key === translateKey) {
    forwardRequest(Message.LANGUAGE_REQUEST, {
      translate: true,
      simplify: false,
      language: await getValueFromStorage("language"),
    });
  } else if (command && e.altKey && e.key === simplifyKey) {
    forwardRequest(Message.LANGUAGE_REQUEST, {
      translate: false,
      simplify: true,
      language: await getValueFromStorage("language"),
    });
  } else if (command && e.altKey && e.key === translateSimplifyKey) {
    forwardRequest(Message.LANGUAGE_REQUEST, {
      translate: await getValueFromStorage("translate"),
      simplify: await getValueFromStorage("simplify"),
      language: await getValueFromStorage("language"),
    });
  }
});

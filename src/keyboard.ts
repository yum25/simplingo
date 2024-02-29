import { sendRequest } from "./messaging";
import { getValueFromStorage, setValueToStorage } from "./storage";
import { Message } from "./types";

// TODO: right now the sendRequest function does not work. Instead,
// for two content scripts to pass messages to each other, we need 
// to send a message to the background, then have it forwarded to the other 
// content script.

document.addEventListener("keydown", async function (e) {
  if (e.ctrlKey && e.key === "a") {
    const value = await getValueFromStorage("sidebarOpen");
    setValueToStorage("sidebarOpen", !value);
  } else if (e.ctrlKey && e.key === "t") {
    sendRequest(Message.REQUEST, {
      translate: true,
      simplify: false,
      language: await getValueFromStorage("language"),
    });
  } else if (e.ctrlKey && e.key === "s") {
    sendRequest(Message.REQUEST, {
      translate: false,
      simplify: true,
      language: await getValueFromStorage("language"),
    });
  } else if (e.ctrlKey && e.key === "g") {
    sendRequest(Message.REQUEST, {
      translate: await getValueFromStorage("translate"),
      simplify: await getValueFromStorage("simplify"),
      language: await getValueFromStorage("language"),
    });
  }
});

import { sendResponse as sendBackgroundRequest } from "./messaging";
import { getValueFromStorage, setValueToStorage } from "./storage";
import { Message } from "./types";

// TODO: right now the sendRequest function does not work. Instead,
// for two content scripts to pass messages to each other, we need 
// to send a message to the background, then have it forwarded to the other 
// content script.

document.addEventListener("keydown", async function (e) {
  const loadingScreen = <HTMLDialogElement> document.getElementById('loading-screen');
  if (e.ctrlKey && e.key === "a") {
    const value = await getValueFromStorage("sidebarOpen");
    setValueToStorage("sidebarOpen", !value);
  } else if (e.ctrlKey && e.key === "t") {
    loadingScreen?.showModal();
    sendBackgroundRequest(Message.GET_REQUEST, {
      translate: true,
      simplify: false,
      language: await getValueFromStorage("language"),
      text: document.body.innerText,
    });
  } else if (e.ctrlKey && e.key === "s") {
    loadingScreen?.showModal();
    sendBackgroundRequest(Message.GET_REQUEST, {
      translate: false,
      simplify: true,
      language: await getValueFromStorage("language"),
      text: document.body.innerText,
    });
  } else if (e.ctrlKey && e.key === "g") {
    loadingScreen?.showModal();
    sendBackgroundRequest(Message.GET_REQUEST, {
      translate: await getValueFromStorage("translate"),
      simplify: await getValueFromStorage("simplify"),
      language: await getValueFromStorage("language"),
      text: document.body.innerText,
    });
  }
});

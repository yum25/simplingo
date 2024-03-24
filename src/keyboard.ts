import { sendResponse as forwardRequest } from "./messaging";
import { getValueFromStorage, setValueToStorage } from "./storage";
import { Message } from "./types";

document.addEventListener("keydown", async function (e) {
  if (e.ctrlKey && e.key === "a") {
    const value = await getValueFromStorage("sidebarOpen");
    setValueToStorage("sidebarOpen", !value);
  } else if (e.ctrlKey && e.key === "t") {
    forwardRequest(Message.LANGUAGE_REQUEST, {
      translate: true,
      simplify: false,
      language: await getValueFromStorage("language"),
    });
  } else if (e.ctrlKey && e.key === "s") {
    forwardRequest(Message.LANGUAGE_REQUEST, {
      translate: false,
      simplify: true,
      language: await getValueFromStorage("language"),
    });
  } else if (e.ctrlKey && e.key === "g") {
    forwardRequest(Message.LANGUAGE_REQUEST, {
      translate: await getValueFromStorage("translate"),
      simplify: await getValueFromStorage("simplify"),
      language: await getValueFromStorage("language"),
    });
  }
});

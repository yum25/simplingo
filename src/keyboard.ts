import { sendResponse as sendBackgroundRequest } from "./messaging";
import { getValueFromStorage, setValueToStorage } from "./storage";
import { Message } from "./types";

document.addEventListener("keydown", async function (e) {
  const loadingScreen = <HTMLDialogElement>(
    document.getElementById("loading-screen")
  );
  if (e.ctrlKey && e.key === "a") {
    const value = await getValueFromStorage("sidebarOpen");
    setValueToStorage("sidebarOpen", !value);
  } else if (e.ctrlKey && e.key === "t") {
    loadingScreen?.showModal();
    sendBackgroundRequest(Message.REQUEST, {
      translate: true,
      simplify: false,
      language: await getValueFromStorage("language"),
    });
  } else if (e.ctrlKey && e.key === "s") {
    loadingScreen?.showModal();
    sendBackgroundRequest(Message.REQUEST, {
      translate: false,
      simplify: true,
      language: await getValueFromStorage("language"),
    });
  } else if (e.ctrlKey && e.key === "g") {
    loadingScreen?.showModal();
    sendBackgroundRequest(Message.REQUEST, {
      translate: await getValueFromStorage("translate"),
      simplify: await getValueFromStorage("simplify"),
      language: await getValueFromStorage("language"),
    });
  }
});

// See https://stackoverflow.com/questions/39610205/how-to-make-side-panel-in-chrome-extension
// on how to create sidebar by injecting iframe

import browser from "webextension-polyfill";
import { getValueFromStorage, storageChangeListener } from "./storage";
import { addMessageListener } from "./messaging";
import { Message, MessageData } from "./types";

function toggleSidebar(sidebarOpen: boolean) {
  if (sidebarOpen) {
    iframe.style.width = "0px";
    document.body.style.paddingRight = "0px";
  } else {
    iframe.style.width = "400px";
    document.body.style.paddingRight = "400px";
  }
}

var iframe = document.createElement("iframe");
iframe.id = "simplingo";
iframe.style.background = "white";
iframe.style.height = "100%";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.bottom = "0px";
iframe.style.right = "0px";
iframe.style.border = "none";
iframe.style.zIndex = "9000000000000000000";
iframe.src = browser.runtime.getURL("sidepanel.html");

var dialog = document.createElement("dialog");
dialog.id = "keybind-modal";
dialog.innerHTML = `
<ul>
    <li>
      Toggle sidepanel: <span>Option</span> + <span>A</span>
    </li>
    <li>
      Translate page: <span>Option</span> + <span>T</span>
    </li>
    <li>
      Simplify page: <span>Option</span> + <span>S</span>
    </li>
    <li>
      Activate Go button: <span>Option</span> + <span>G</span>
    </li>
  </ul>
`;

var loadingScreen = document.createElement("dialog");
loadingScreen.id = "loading-screen";
loadingScreen.style.textAlign = "center";
loadingScreen.innerHTML =
  "<p>Processing page...</p><p>Please wait around 15-20 seconds for results to appear</p>";

document.body.style.paddingRight = "0px";
document.body.appendChild(iframe);
document.body.appendChild(dialog);
document.body.appendChild(loadingScreen);

toggleSidebar(await getValueFromStorage("sidebarOpen"));
storageChangeListener(function (changes) {
  if (changes.sidebarOpen) {
    toggleSidebar(changes.sidebarOpen.newValue);
  }
});

const handleRequest = (type: Message, data: MessageData) => {
  switch (type) {
    case Message.OPEN_DIALOG:
      dialog.showModal();
      break;
    default:
      break;
  }
};

addMessageListener(handleRequest);

// See https://stackoverflow.com/questions/39610205/how-to-make-side-panel-in-chrome-extension
// on how to create sidebar by injecting iframe

import browser from "webextension-polyfill";
import { getValueFromStorage, storageChangeListener } from "./storage";
import { addMessageListener } from "./messaging";
import { Message } from "./types";

function initializeSidebar() {
  const iframe = document.createElement("iframe");
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
  document.body.appendChild(iframe);

  function toggleSidebar(sidebarOpen: boolean) {
    if (sidebarOpen) {
      iframe.style.width = "0px";
      document.body.style.paddingRight = "0px";
    } else {
      iframe.style.width = "400px";
      document.body.style.paddingRight = "400px";
    }
  }

  getValueFromStorage("sidebarOpen").then((sidebarOpen) =>
    toggleSidebar(sidebarOpen)
  );
  storageChangeListener(function (changes) {
    if (changes.sidebarOpen) {
      toggleSidebar(changes.sidebarOpen.newValue);
    }
  });
}

function initializeDialog() {
  const dialog = document.createElement("dialog");
  dialog.id = "keybind-modal";
  dialog.innerHTML = `
  <button id="close">X</button>
  <div style="height: 5px;" aria-hidden="true"></div>
    <ul id="keybinds">
      <li>Toggle sidepanel: <span class="key command">Ctrl</span> + <span class="key">Alt</span> + <span class="key">A</span></li>
      <li>Translate page: <span class="key command">Ctrl</span> + <span class="key">Alt</span> + <span class="key">T</span></li>
      <li>Simplify page: <span class="key command">Ctrl</span> + <span class="key">Alt</span> + <span class="key">S</span></li>
      <li>Activate Go button: <span class="key command">Ctrl</span> + <span class="key">Alt</span> + <span class="key">G</span></li>
    </ul>
    <style>
      #keybinds {
        display: grid;
        list-style: none;
      
        margin: 0;
        padding: 1rem;
        border: 1px solid black;
      
        gap: 15px;
      }
      
      .key {
        color: black;
        background: rgb(216, 216, 216);
      
        padding: 3px;
      
        border: 1px solid black;
        border-radius: 0.25rem;
      }

      #close {
        color: white;
        background: tomato;
      }
    </style>
  `;
  document.body.appendChild(dialog);

  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const command = document.getElementsByClassName("command");

  for (let i = 0; i < command.length; i++) {
    (command[i] as HTMLElement).textContent = isMac ? "Cmd" : "Ctrl";
  }

  document
    .getElementById("close")
    ?.addEventListener("click", () => dialog.close());

  addMessageListener((type: Message) => {
    switch (type) {
      case Message.OPEN_DIALOG:
        dialog.showModal();
        break;
    }
  });
}

initializeSidebar();
initializeDialog();

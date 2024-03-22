import { sendRequest } from "./messaging";
import { Message } from "./types";
import {
  getValueFromStorage,
  setValueToStorage,
  setValuesFromStorage,
  setValuesToStorage,
  storageChangeListener,
} from "./storage";

document.addEventListener("DOMContentLoaded", function () {
  const translateToggle = <HTMLInputElement>(
    document.getElementById("translate")
  );
  const simplifyToggle = <HTMLInputElement>document.getElementById("simplify");
  const languageDropdown = <HTMLSelectElement>(
    document.getElementById("chooseLang")
  );

  // Get persistent values from storage and set them as the initial
  // togglable values
  setValuesFromStorage([
    {
      element: translateToggle,
      elementVar: "checked",
      key: "translate",
      default: false,
    },
    {
      element: simplifyToggle,
      elementVar: "checked",
      key: "simplify",
      default: false,
    },
    {
      element: languageDropdown,
      elementVar: "value",
      key: "language",
      default: "xx",
    },
  ]);

  // Add event change listeners that communicate with storage
  // and sync local changes to global browser storage
  setValuesToStorage(translateToggle, "checked", "translate");
  setValuesToStorage(simplifyToggle, "checked", "simplify");
  setValuesToStorage(languageDropdown, "value", "language");

  // Listens for changes in browser storage and syncs across all tabs
  storageChangeListener(function (changes) {
    if (changes.translate) translateToggle.checked = changes.translate.newValue;
    if (changes.simplify) simplifyToggle.checked = changes.simplify.newValue;
    if (changes.language) languageDropdown.value = changes.language.newValue;
  });

  const activateButton = <HTMLButtonElement>document.getElementById("activate");
  const closeButton = <HTMLButtonElement>document.getElementById("close");

  translateToggle.addEventListener("click", function () {
    const selectOptions = <HTMLElement>(
      document.getElementById("select-options")
    );
    if (translateToggle.checked) {
      selectOptions!.style.display = "flex";
    } else {
      selectOptions!.style.display = "none";
    }
  });

  activateButton.addEventListener("click", function () {
    const translate: boolean = translateToggle.checked;
    const simplify: boolean = simplifyToggle.checked;
    const language: string = languageDropdown.value;

    if ((translate && language !== "xx") || (!translate && simplify)) {
      sendRequest(Message.REQUEST, { translate, simplify, language });
    } else {
      alert(
        "Please toggle on translate with a valid language, simplify or both"
      );
    }
  });

  closeButton.addEventListener("click", async function () {
    const value = await getValueFromStorage("sidebarOpen");
    setValueToStorage("sidebarOpen", !value);
  });

  const editKeybindButton = <HTMLButtonElement>(
    document.getElementById("edit-keybinds")
  );

  editKeybindButton.addEventListener("click", function () {
    sendRequest(Message.OPEN_DIALOG, {});
  });

  const revertButton = <HTMLButtonElement>document.getElementById("revert");

  revertButton.addEventListener("click", function () {
    sendRequest(Message.REVERT, {});
  });
});

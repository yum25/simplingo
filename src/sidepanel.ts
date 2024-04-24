import { addMessageListener, sendRequest } from "./messaging";
import { Message, MessageData } from "./types";
import {
  getValueFromStorage,
  setValueToStorage,
  setValuesFromStorage,
  setValuesToStorage,
  storageChangeListener,
} from "./storage";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'simplingoteam@gmail.com', //  email address
    pass: 'CookieIncentive2024', //  password
  },
});

const mailOptions: nodemailer.SendMailOptions = {
  from: 'simplingoteam@gmail.com', // Sender
  to: 'simplingoteam@gmail.com', // Recipient
  subject: 'SimpLingo Feedback', // Email subject
  html: 'mail.html', // Email HTML content
};



const handleResponse = (type: Message, data: MessageData) => {
  switch (type) {
    case Message.DISABLE:
      document.getElementById("side-panel")!.style.display = "none";
      document.getElementById("disabled")!.style.display = "flex";
      document.getElementById(
        "progress"
      )!.textContent = `0/${data.requests?.length}`;
      break;
    case Message.UPDATE:
      const responses = data.requests?.filter((request) => request);
      document.getElementById(
        "progress"
      )!.textContent = `${responses?.length}/${data.requests?.length}`;

      if (responses?.length === data.requests?.length) {
        document.getElementById("disabled")!.style.display = "none";
        document.getElementById("side-panel")!.style.display = "flex";
      }
      break;
    case Message.REVERT_RESPONSE:
      const revert = <HTMLElement>document.getElementById("revertText");
      if (data.reverted) {
        revert.textContent = "see modified text";
      } else {
        revert.textContent = "see original text";
      }
      break;
    default:
      break;
  }
};

addMessageListener(handleResponse);

document.addEventListener("DOMContentLoaded", async function () {
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

  const translateChecked = await getValueFromStorage("translate")
  if (translateChecked) {
    languageDropdown!.style.display = "flex";
  } else {
    languageDropdown!.style.display = "none";
  }

  translateToggle.addEventListener("change", function () {
    if (translateToggle.checked) {
      languageDropdown!.style.display = "flex";
    } else {
      languageDropdown!.style.display = "none";
    }
  });
  activateButton.addEventListener("click", function () {
    const translate: boolean = translateToggle.checked;
    const simplify: boolean = simplifyToggle.checked;
    const language: string = languageDropdown.value;

    if ((translate && language !== "xx") || (!translate && simplify)) {
      sendRequest(Message.LANGUAGE_REQUEST, { translate, simplify, language });
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

  const smile = <HTMLButtonElement>document.getElementById("smileButton");

  const sad = <HTMLButtonElement>document.getElementById("sadButton");

  const regenerate = <HTMLButtonElement>(
    document.getElementById("regenerateButton")
  );

  smile.addEventListener("click", function () {
    let feedback = prompt("Thanks for the positive feedback! :) Any additional comments?");
  });

  sad.addEventListener("click", function () {
    let feedback = prompt("Sorry for the negative experience :( What would make it better?");
  });

  function sendFeedback(feedback: string) {
    const apiUrl = "http://0.0.0.0:5000/sendFeedback"; 
  
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ feedback: feedback }),
    })
    .then(response => response.json())
    .then(data => {
      console.log("Feedback sent!", data);
    })
    .catch(error => {
      console.error("Error sending feedback:", error);
    });
  }

  regenerate.addEventListener("click", function () {
    sendRequest(Message.REGENERATE, {});
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

  document.getElementById("cancel")?.addEventListener("click", function () {
    document.getElementById("disabled")!.style.display = "none";
    document.getElementById("side-panel")!.style.display = "flex";

    sendRequest(Message.CANCEL, {});
  });
});

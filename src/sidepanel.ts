import { sendRequest, addMessageListener } from "./messaging";
import { Message, MessageData } from "./types";
import { 
  getValueFromStorage, 
  setValueToStorage, 
  setValuesFromStorage, 
  setValuesToStorage, 
  storageChangeListener 
} from "./storage";

// This function will eventually be deleted after successfully
// replacing text in the DOM (or can be repurposed in the future for error handling)
function handleResponse(type:Message, data:MessageData) {
  switch(type) {
    case Message.RESPONSE:
      console.log(data)
      const outputText = document.getElementById('outputText')
      outputText!.innerText = <string> data.text;
      break;
  }
}
addMessageListener(handleResponse);

document.addEventListener('DOMContentLoaded', function() {
  const translateToggle = <HTMLInputElement> document.getElementById('translate');
  const simplifyToggle = <HTMLInputElement> document.getElementById('simplify');
  const languageDropdown = <HTMLSelectElement> document.getElementById("chooseLang");

  // Get persistent values from storage and set them as the initial 
  // togglable values
  setValuesFromStorage([
    { 
      element: translateToggle,
      elementVar: "checked",
      key: 'translate',
      default: false,
    },
    { 
      element: simplifyToggle,
      elementVar: "checked",
      key: 'simplify',
      default: false,
    },
    {
      element: languageDropdown,
      elementVar: "value",
      key: 'language',
      default: 'en',
    }
  ])

  // Add event change listeners that communicate with storage
  // and sync local changes to global browser storage
  setValuesToStorage(translateToggle, "checked", "translate");
  setValuesToStorage(simplifyToggle, "checked", "simplify");
  setValuesToStorage(languageDropdown, "value", "language");

  // Listens for changes in browser storage and syncs across all tabs
  storageChangeListener(function(changes) {
    if (changes.translate) translateToggle.checked = changes.translate.newValue;
    if (changes.simplify) simplifyToggle.checked = changes.simplify.newValue;
    if (changes.language) languageDropdown.value = changes.language.newValue;
  })

  const activateButton = <HTMLButtonElement> document.getElementById('activate');
  const closeButton = <HTMLButtonElement> document.getElementById('close');

  activateButton?.addEventListener('click', function() {
    const translate:boolean = translateToggle.checked;
    const simplify:boolean = simplifyToggle.checked;
    const language:string = languageDropdown.value;

    sendRequest(Message.REQUEST, { translate, simplify, language });
  })

  closeButton?.addEventListener('click', async function() {
    const value = await getValueFromStorage('sidebarOpen');
    setValueToStorage('sidebarOpen', !value);
  });

});
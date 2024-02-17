import { sendRequest, addMessageListener } from "./messaging";
import { MESSAGE } from "./types";

function handleResponse(type, data) {
  switch(type) {
    case MESSAGE.RESPONSE:
      console.log(data)
      const outputText = document.getElementById('outputText')
      outputText!.innerText = data.text;
      break;
  }
}

addMessageListener(handleResponse);

document.addEventListener('DOMContentLoaded', function() {
    const translateToggle = <HTMLInputElement> document.getElementById('translate')
    const simplifyToggle = <HTMLInputElement> document.getElementById('simplify');
    const languageDropdown = <HTMLSelectElement> document.getElementById("chooseLang");

    const activateButton = <HTMLButtonElement> document.getElementById('activate');
    const closeButton = <HTMLButtonElement> document.getElementById('close');

    activateButton?.addEventListener('click', function() {
      const translate:boolean = translateToggle.checked;
      const simplify:boolean = simplifyToggle.checked;
      const language:string = languageDropdown.value;
  
      sendRequest(MESSAGE.REQUEST, { translate, simplify, language });
    })

    closeButton?.addEventListener('click', function() {
      sendRequest(MESSAGE.SIDEBAR_TOGGLE, {});
    });

});
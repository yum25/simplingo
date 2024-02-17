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
    var translateToggle = <HTMLInputElement> document.getElementById('translate')
    var simplifyToggle = <HTMLInputElement> document.getElementById('simplify');
    
    var translateValue = translateToggle.checked;
    var simplifyValue = simplifyToggle.checked;

    var activateButton = document.getElementById('activate');

    activateButton?.addEventListener('click', function() {
      sendRequest(MESSAGE.REQUEST, { translate: translateValue, simplify: simplifyValue, language: "zh" });
    })

});
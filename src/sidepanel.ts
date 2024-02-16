import { sendRequest, addMessageListener } from "./messaging";
import { MESSAGE } from "./types";

function handleResponse(type, data) {
  switch(type) {
    case MESSAGE.TRANSLATE_RESPONSE:
      console.log(data)
      const translatedText = document.getElementById('translatedText')
      translatedText!.innerText = data.text;
      break;
    case MESSAGE.SIMPLIFY_RESPONSE:
      console.log(data);
      const simplifiedText = document.getElementById('simplifiedText')
      simplifiedText!.innerText = data.text;
      break;
  }
}

addMessageListener(handleResponse);

document.addEventListener('DOMContentLoaded', function() {
    var translateToggle = <HTMLInputElement> document.getElementById('translate')
    var simplifyToggle = <HTMLInputElement> document.getElementById('simplify');
    
    var translateValue = translateToggle.checked;
    var simplifyValue = simplifyToggle.checked;

    // translateToggle?.addEventListener('click', function() {
    //   // Add translation functionality here
    //   sendRequest(MESSAGE.TRANSLATE_REQUEST, { });
    // });
  
    // simplifyToggle?.addEventListener('click', function() {
    //   // Add simplify functionality here
    //   sendRequest(MESSAGE.SIMPLIFY_REQUEST, { });
    // });
});
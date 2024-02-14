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
    var translateBtn = document.getElementById('translate');
    var simplifyBtn = document.getElementById('simplify');
    
    translateBtn?.addEventListener('click', function() {
      // Add translation functionality here
      sendRequest(MESSAGE.TRANSLATE_REQUEST, { });
    });
  
    simplifyBtn?.addEventListener('click', function() {
      // Add simplify functionality here
      sendRequest(MESSAGE.SIMPLIFY_REQUEST, { });
    });
});
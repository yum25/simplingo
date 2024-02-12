import { sendRequest, addMessageListener } from "./messaging";
import { MESSAGE } from "./types";

function handleResponse(type, data) {
  switch(type) {
    case MESSAGE.TRANSLATE_RESPONSE:
      alert("Translate response received")
      console.log(data);
      const el = document.getElementById('translatedText')
      el!.innerHTML = data;
      break;
    case MESSAGE.SIMPLIFY_RESPONSE:
      console.log(data);
      break;
  }
}

document.addEventListener('DOMContentLoaded', function() {
    var translateBtn = document.getElementById('translate-btn');
    var simplifyBtn = document.getElementById('simplify-btn');
    
    translateBtn?.addEventListener('click', function() {
      // Add translation functionality here
      sendRequest(MESSAGE.TRANSLATE_REQUEST, { });
    });
  
    simplifyBtn?.addEventListener('click', function() {
      // Add simplify functionality here
      sendRequest(MESSAGE.SIMPLIFY_REQUEST, { });
    });
});

addMessageListener(handleResponse);
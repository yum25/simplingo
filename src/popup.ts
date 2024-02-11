import { sendRequest } from "./messaging";
import { MESSAGE } from "./types";


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
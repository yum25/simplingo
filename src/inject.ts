// See https://stackoverflow.com/questions/39610205/how-to-make-side-panel-in-chrome-extension
// on how to create sidebar by injecting iframe

import browser from "webextension-polyfill";

var iframe = document.createElement('iframe'); 
iframe.id = "simplingo"
iframe.style.background = "white";
iframe.style.height = "100%";
iframe.style.width = "400px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "9000000000000000000";
iframe.src = browser.runtime.getURL("sidepanel.html")

document.body.appendChild(iframe);
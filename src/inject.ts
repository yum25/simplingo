// See https://stackoverflow.com/questions/39610205/how-to-make-side-panel-in-chrome-extension
// on how to create sidebar by injecting iframe

import browser from "webextension-polyfill";
import { addMessageListener } from "./messaging";
import { MESSAGE } from "./types";

var iframe = document.createElement('iframe'); 
iframe.id = "simplingo"
iframe.style.background = "white";
iframe.style.height = "100%";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.bottom = "0px";
iframe.style.right = "0px";
iframe.style.border = "3px solid gray";
iframe.style.zIndex = "9000000000000000000";
iframe.src = browser.runtime.getURL("sidepanel.html")

document.body.style.paddingRight = "0px";
document.body.appendChild(iframe);

let sidebarOpen = true;
const handleRequest = (type, data) => {
    switch (type) {
        case MESSAGE.SIDEBAR_TOGGLE:
           sidebarOpen = !sidebarOpen;
           if (sidebarOpen) {
            iframe.style.width = "0px";
            document.body.style.paddingRight = "0px";
           }
           else {
            iframe.style.width = "400px";
            document.body.style.paddingRight = "400px";
           }
           break;
        default:
            break;
    }
}

addMessageListener(handleRequest);
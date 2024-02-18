// See https://stackoverflow.com/questions/39610205/how-to-make-side-panel-in-chrome-extension
// on how to create sidebar by injecting iframe

import browser from "webextension-polyfill";
import { getValueFromStorage, storageChangeListener } from "./storage";

function toggleSidebar(sidebarOpen:boolean) {
    if (sidebarOpen) {
        iframe.style.width = "0px";
        document.body.style.paddingRight = "0px";
       }
       else {
        iframe.style.width = "400px";
        document.body.style.paddingRight = "400px";
       }
}

var iframe = document.createElement('iframe'); 
iframe.id = "simplingo"
iframe.style.background = "white";
iframe.style.height = "100%";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.bottom = "0px";
iframe.style.right = "0px";
iframe.style.border = "none";
iframe.style.zIndex = "9000000000000000000";
iframe.src = browser.runtime.getURL("sidepanel.html")

document.body.style.paddingRight = "0px";
document.body.appendChild(iframe);

toggleSidebar(await getValueFromStorage('sidebarOpen'))
storageChangeListener(function(changes) {
    if (changes.sidebarOpen) {
        toggleSidebar(changes.sidebarOpen.newValue);
    }
})
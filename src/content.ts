import { sendResponse as sendBackgroundRequest, addMessageListener, sendRequest, sendMessage } from "./messaging";
import { Message, MessageData } from "./types";

var dialog = document.createElement('dialog');
dialog.id = "loading-screen";
dialog.style.textAlign = "center"
dialog.innerHTML = "<p>Processing page...</p><p>Please wait around 15-20 seconds for results to appear</p>"
document.body.appendChild(dialog)

const textElements = ["P"];

const verifyText = (node, text:string) => {
    return !/SCRIPT|STYLE/.test(node.parentNode.tagName) && 
    text.trim().length > 0 &&
   /[a-zA-Z]/g.test(text)
}

const addDocumentText = (el:HTMLElement, documentText:Array<string>) => {
    const text:string = (el.nodeType === Node.ELEMENT_NODE ? el.innerHTML : el.textContent) ?? "";
    if (verifyText(el, text)) {
        documentText.push(text.trim());
    }
}

const replaceDocumentText = (el:HTMLElement, newText:Array<string>) => {
    const text:string =(el.nodeType === Node.ELEMENT_NODE ? el.innerHTML : el.textContent) ?? "";
    if (verifyText(el, text)) {
        if (el.nodeType === Node.ELEMENT_NODE) {
            el.innerHTML = newText.shift() ?? "";
        }
        else {
            el.textContent = newText.shift() ?? null;
        }
    }
}

// See https://stackoverflow.com/questions/5558613/replace-words-in-the-body-text
const parseDocumentText = (el, documentText:Array<string>, handleDocumentText:Function) => {
    for (let node of el.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                if (textElements.includes(node.tagName)) {
                    handleDocumentText(node, documentText, handleDocumentText);
                }
                else {
                    parseDocumentText(node, documentText, handleDocumentText);
                }
                break;
            // case Node.TEXT_NODE:
            //     handleDocumentText(node, documentText);
            //     break;
            case Node.DOCUMENT_NODE:
                parseDocumentText(node, documentText, handleDocumentText);
        }
  }
}

// Two use cases of parseDocumentText: get original DOM texContent, and replace textContent
const getDOMText = () => {
    const documentText = [];
    parseDocumentText(document.body, documentText, addDocumentText);
    return documentText;
}

const replaceDOMText = (newText:Array<string>) => {
    parseDocumentText(document.body, newText, replaceDocumentText);
}

const handleRequest = (type:Message, data:MessageData) => {
    const text = document.body.innerText;
    switch (type) {
        case Message.REQUEST:
            // FIXME: dialog should be in inject.ts, currently placed here for convenience.
            dialog.showModal();
            sendBackgroundRequest(Message.GET_REQUEST, {...data, text });
            break;
        case Message.GET_RESPONSE:
            dialog.close();
            if (data.text) document.body.innerText = data.text;
            if (data.error) alert(`Error: ${JSON.stringify(data.error)}`);
            break;
        default:
            break;
    }
}

addMessageListener(handleRequest);
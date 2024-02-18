import { sendResponse, addMessageListener } from "./messaging";
import { Message, MessageData } from "./types";

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

const translateSimplifyDOM = (data:MessageData, text) => {
    // TODO: send API translation request to backend and modify DOM based on response

    // comment this out when testing translation backend
    // alert(JSON.stringify(data));
    // sendResponse(MESSAGE.RESPONSE, { text });

    // comment this out when testing frontend message listeners
    fetch(`http://127.0.0.1:5000/get_text?translate=${data.translate}&simplify=${data.simplify}&text=${text}&target_lang=${data.language}`, { mode: 'no-cors'})
    .then((resp) => {
        if (!resp.ok) {
            throw new Error(`${resp.status}: ${resp.statusText}`);
        }
        return resp.json();
    })
    .then((data) => {
        sendResponse(Message.RESPONSE, data);
    })
    .catch((error) => {
        console.error(error);
        alert("Error: failed to translate. Please try again.");
    });
}

const handleRequest = (type:Message, data:MessageData) => {
    const documentText = getDOMText();
    switch (type) {
        case Message.REQUEST:
            translateSimplifyDOM(data, documentText);
            break;
        default:
            break;
    }
}

addMessageListener(handleRequest);

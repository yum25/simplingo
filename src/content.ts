import { sendResponse, addMessageListener } from "./messaging";
import { MESSAGE } from "./types";

const verifyText = (node) => {
    return !/SCRIPT|STYLE/.test(node.parentNode.tagName) && 
    node.textContent.trim().length > 0 &&
   /[a-zA-Z]/g.test(node.textContent)
}

const addDocumentText = (el, documentText) => {
    if (verifyText(el)) {
        documentText.push(el.textContent.trim());
    }
}

const replaceDocumentText = (el, newText) => {
    if (verifyText(el)) {
        el.textContent = newText.shift();
    }
}

// See https://stackoverflow.com/questions/5558613/replace-words-in-the-body-text
const parseDocumentText = (el, documentText, handleDocumentText) => {
    for (let node of el.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                parseDocumentText(node, documentText, handleDocumentText);
                break;
            case Node.TEXT_NODE:
                handleDocumentText(node, documentText);
                break;
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

const replaceDOMText = (newText) => {
    parseDocumentText(document.body, newText, replaceDocumentText);
}

const translateDOM = (data, text) => {
    // TODO: send API translation request to backend and modify DOM based on response

    // comment this out when testing translation backend
    // sendResponse(MESSAGE.TRANSLATE_RESPONSE, { text });

    // comment this out when testing frontend message listeners
    fetch(`http://127.0.0.1:5000/get_text?translate=true&text=${text}&target_lang=zh`, { mode: 'no-cors'})
    .then((resp) => {
        if (!resp.ok) {
            throw new Error(`${resp.status}: ${resp.statusText}`);
        }
        return resp.json();
    })
    .then((data) => {
        sendResponse(MESSAGE.TRANSLATE_RESPONSE, data);
    })
    .catch((error) => {
        console.error(error);
        alert("Error: failed to translate. Please try again.");
    });
}

const simplifyDOM = (data, text) => {

    // comment this out when testing backend
    // sendResponse(MESSAGE.SIMPLIFY_RESPONSE, { text });

    // TODO: send API simplification request to backend and modify DOM based on response
    fetch(`http://127.0.0.1:5000/get_text?translate=false&simplify=1&text=${text}&target_lang=en`, { mode: 'no-cors'})
    .then((resp) => {
        if (!resp.ok) {
            throw new Error(`${resp.status}: ${resp.statusText}`);
        }
        return resp.json();
    })
    .then((data) => {
        sendResponse(MESSAGE.SIMPLIFY_RESPONSE, data);
    })
    .catch((error) => {
        console.error(error);
        alert("Error: failed to simplify. Please try again.");
    });
}

const handleRequest = (type, data) => {
    const documentText = document.body.innerText;
    switch (type) {
        case MESSAGE.TRANSLATE_REQUEST:
            translateDOM(data, documentText);
            break;
        case MESSAGE.SIMPLIFY_REQUEST:
            simplifyDOM(data, documentText);
            break;
        default:
            break;
    }
}

addMessageListener(handleRequest);

import { sendResponse as sendBackgroundRequest, addMessageListener, sendRequest, sendMessage } from "./messaging";
import { Message, MessageData } from "./types";

const textElements = ["P"];

const verifyText = (node, text:string) => {
    return !/SCRIPT|STYLE/.test(node.parentNode.tagName) && 
    node.parentNode.id !== "loading-screen" && text.trim().length > 0
}

const addDocumentText = (el:HTMLElement, documentText:Array<Element>) => {
    const text:string = el.innerHTML ?? "";
    if (verifyText(el, text)) {
        documentText.push(el);
    }
}

// const replaceDocumentText = (el:HTMLElement, newText:Array<string>) => {
//     const text:string =(el.nodeType === Node.ELEMENT_NODE ? el.innerHTML : el.textContent) ?? "";
//     if (verifyText(el, text)) {
//         el.textContent = newText.shift() ?? null;
//     }
// }

// See https://stackoverflow.com/questions/5558613/replace-words-in-the-body-text
const parseDocumentText = (el, documentText:Array<Element>, handleDocumentText:Function) => {
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
export const getDOMText = () => {
    const documentText = [];
    parseDocumentText(document.body, documentText, addDocumentText);
    return documentText;
}

const replaceDOMText = (newText:string, el:Element) => {
    if (el) {
        el.textContent = newText;
    } else {
       console.log(newText)
    }
   
}

let text:Array<Element> = getDOMText();
const handleRequest = (type:Message, data:MessageData) => {
    const loadingScreen = <HTMLDialogElement> document.getElementById('loading-screen');
    switch (type) {
        case Message.REQUEST:
            text = getDOMText();
            loadingScreen?.showModal();
            text.forEach((p, index) => {
                sendBackgroundRequest(Message.GET_REQUEST, {...data, text: p.textContent as string, index });
            })
            break;
        case Message.GET_RESPONSE:
            loadingScreen?.close();
            if (data.text) replaceDOMText(data.text, text[data.index as number]);
            if (data.error) console.error(`Error: ${JSON.stringify(data.error)}`);
            break;
        default:
            break;
    }
}

addMessageListener(handleRequest);
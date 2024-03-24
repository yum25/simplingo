import {
  sendResponse as sendBackgroundRequest,
  addMessageListener,
  sendResponse,
} from "./messaging";
import { Message, MessageData } from "./types";

const textElements = ["P"];

const verifyText = (node, text: string) => {
  return (
    !/SCRIPT|STYLE/.test(node.parentNode.tagName) &&
    node.parentNode.id !== "loading-screen" &&
    text.trim().length > 0
  );
};

const addDocumentText = (el: HTMLElement, documentText: Array<Element>) => {
  const text: string = el.textContent ?? "";
  if (verifyText(el, text)) {
    documentText.push(el);
  }
};

// See https://stackoverflow.com/questions/5558613/replace-words-in-the-body-text
const parseDocumentText = (
  el,
  documentText: Array<Element>,
  handleDocumentText: Function
) => {
  for (let node of el.childNodes) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (textElements.includes(node.tagName)) {
          handleDocumentText(node, documentText, handleDocumentText);
        } else {
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
};

// Two use cases of parseDocumentText: get original DOM texContent, and replace textContent
export const getDOMText = () => {
  const documentText = [];
  parseDocumentText(document.body, documentText, addDocumentText);
  return documentText;
};

const replaceDOMText = (newText: string, el: Element) => {
  if (el) {
    el.textContent = newText;
  } else {
    console.log(newText);
  }
};

const originalText: Array<string> = getDOMText().map(
  (p: Element) => p.textContent as string
);
let modifiedText: Array<string> = getDOMText().map(
  (p: Element) => p.textContent as string
);
let text: Array<Element> = getDOMText();
let requests: Array<boolean> = [];

const handleRequest = (type: Message, data: MessageData) => {
  const loadingScreen = <HTMLDialogElement>(
    document.getElementById("loading-screen")
  );
  switch (type) {
    case Message.REQUEST:
      loadingScreen?.showModal();

      text = getDOMText();
      text.forEach((p, index) => {
        sendBackgroundRequest(Message.GET_REQUEST, {
          ...data,
          text: p.textContent as string,
          index,
        });
      });

      requests = text.map(() => false);
      sendResponse(Message.DISABLE, {});

      break;
    case Message.GET_RESPONSE:
      loadingScreen?.close();

      if (data.text) {
        replaceDOMText(data.text, text[data.index as number]);
        modifiedText[data.index as number] = data.text;
      }
      if (data.error) console.error(`Error: ${JSON.stringify(data.error)}`);

      requests[data.index as number] = true;
      if (requests.filter((p) => !p).length === 0) {
        sendResponse(Message.ENABLE, {});
      }

      break;
    case Message.REVERT:
      if (
        originalText.toString() !==
        getDOMText()
          .map((p: Element) => p.textContent as string)
          .toString()
      ) {
        text.forEach((p: Element, i) => {
          replaceDOMText(originalText[i], p);
        });
      } else {
        text.forEach((p: Element, i) => {
          replaceDOMText(modifiedText[i], p);
        });
      }
      break;
    default:
      break;
  }
};

addMessageListener(handleRequest);

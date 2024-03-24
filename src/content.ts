import {
  sendResponse as sendBackgroundRequest,
  addMessageListener,
  sendResponse,
} from "./messaging";
import { Message, MessageData } from "./types";

const textElements = ["P"];

const getDOMText = () => {
  const documentText = [];
  parseDocumentText(document.body, documentText, addDocumentText);
  return documentText;
};

const replaceDOMText = (newText: string, el: Element) => {
  if (el) {
    el.textContent = newText;
  }
};

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
  el: Node,
  documentText: Array<Element>,
  handleDocumentText: Function
) => {
  for (let node of el.childNodes) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (textElements.includes((node as Element).tagName)) {
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

class ContentScript {
  originalText: Array<string> = getDOMText().map(
    (el: Element) => el.textContent as string
  );
  modifiedText: Array<string> = getDOMText().map(
    (el: Element) => el.textContent as string
  );

  requests: Array<boolean> = [];

  initializeLanguageProcess = (text: Array<Element>, data: MessageData) => {
    // send individual requests for each element
    text.forEach((el, index) => {
      sendBackgroundRequest(Message.BACKGROUND_REQUEST, {
        ...data,
        text: el.textContent as string,
        index,
      });
    });

    // start tracking request status
    this.requests = text.map(() => false);
    sendResponse(Message.DISABLE, { requests: this.requests });
  };

  updateLanguageProcess = (text: Array<Element>, data: MessageData) => {
    // update request at data.index as fulfilled
    this.requests[data.index as number] = true;

    // modify DOM based on response and track modified DOM
    if (data.text) {
      replaceDOMText(data.text, text[data.index as number]);
      sendResponse(Message.UPDATE, { requests: this.requests });

      this.modifiedText[data.index as number] = data.text;
    }
    if (data.error) console.error(`Error: ${JSON.stringify(data.error)}`);
  };

  handleRequest = (type: Message, data: MessageData) => {
    const text: Array<Element> = getDOMText();
    switch (type) {
      case Message.LANGUAGE_REQUEST:
        this.initializeLanguageProcess(text, data);
        break;
      case Message.BACKGROUND_RESPONSE:
        this.updateLanguageProcess(text, data);
        break;
      case Message.REVERT:
        const currentDOM = getDOMText().map(
          (el: Element) => el.textContent as string
        );
        const edited = this.originalText.toString() !== currentDOM.toString();
        const textReplace = edited ? this.originalText : this.modifiedText;

        text.forEach((el: Element, i) => {
          replaceDOMText(textReplace[i], el);
        });
        break;
      default:
        break;
    }
  };
}

const script = new ContentScript();
addMessageListener(script.handleRequest);

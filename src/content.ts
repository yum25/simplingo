import {
  sendResponse as sendBackgroundRequest,
  addMessageListener,
  sendResponse,
} from "./messaging";
import { LanguageRequest, Message, MessageData } from "./types";

const textElements = ["H1", "H2", "H3", "H4", "P"];

function getDOMText() {
  const documentText = [];
  parseDocumentText(document.body, documentText, addDocumentText);
  return documentText;
}

function replaceDOMText(newText: string, el: Element) {
  if (el) {
    el.textContent = newText;
  }
}

function verifyText(node, text: string) {
  return (
    !/SCRIPT|STYLE/.test(node.parentNode.tagName) &&
    node.parentNode.id !== "loading-screen" &&
    text.trim().length > 0
  );
}

function addDocumentText(el: HTMLElement, documentText: Array<Element>) {
  const text: string = el.textContent ?? "";
  if (verifyText(el, text)) {
    documentText.push(el);
  }
}

// See https://stackoverflow.com/questions/5558613/replace-words-in-the-body-text
function parseDocumentText(
  el: Node,
  documentText: Array<Element>,
  handleDocumentText: Function
) {
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
}

class ContentScript {
  originalText: Array<string> = getDOMText().map(
    (el: Element) => el.textContent as string
  );
  modifiedText: Array<string> = getDOMText().map(
    (el: Element) => el.textContent as string
  );

  history: Array<LanguageRequest> = [];
  requests: LanguageRequest["requests"] = [];

  initializeLanguageProcess = (
    text: Array<Element>,
    data: MessageData,
    tabID: number
  ) => {
    text.forEach((el, index) => {
      sendBackgroundRequest(Message.BACKGROUND_REQUEST, {
        ...data,
        text: el.textContent as string,
        index,
        tabID,
      });
    });

    this.requests = text.map(() => false);
    this.history.unshift({
      url: location.href,
      data,
      requests: this.requests,
      timestamp: new Date().toString(),
    });
    sendResponse(Message.DISABLE, { requests: this.requests });
  };

  updateLanguageProcess = (text: Array<Element>, data: MessageData) => {
    this.requests[data.index as number] = {
      text: data.text as string,
      error: data.error,
    };
    this.history[0].requests = this.requests;

    if (data.text) {
      replaceDOMText(data.text, text[data.index as number]);
      sendResponse(Message.UPDATE, { requests: this.requests });

      this.modifiedText[data.index as number] = data.text;
    }
    if (data.error) console.error(`Error: ${JSON.stringify(data.error)}`);
  };

  handleRequest = (type: Message, data: MessageData, tabID) => {
    const text: Array<Element> = getDOMText();
    switch (type) {
      case Message.LANGUAGE_REQUEST:
        this.initializeLanguageProcess(text, data, tabID);
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
    }
  };
}

const script = new ContentScript();
addMessageListener(script.handleRequest);

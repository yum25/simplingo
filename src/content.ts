import {
  sendResponse as sendBackgroundRequest,
  addMessageListener,
  sendResponse,
} from "./messaging";
import { LanguageRequest, Message, MessageData } from "./types";

const textElements = ["H1", "H2", "H3", "H4", "H5", "H6", "P"];

function getDOMText() {
  const documentText = [];
  parseDocumentText(document.body, documentText, addDocumentText);
  return documentText;
}

function replaceDOMText(newText: string, el: HTMLElement) {
  if (el) {
    el.innerText = newText;
  }
}

function verifyText(node, text: string) {
  return (
    !/SCRIPT|STYLE/.test(node.parentNode.tagName) &&
    node.parentNode.id !== "loading-screen" &&
    text.trim().length > 0
  );
}

function addDocumentText(el: HTMLElement, documentText: Array<HTMLElement>) {
  const text: string = el.innerText ?? "";
  if (verifyText(el, text)) {
    documentText.push(el);
  }
}

// See https://stackoverflow.com/questions/5558613/replace-words-in-the-body-text
function parseDocumentText(
  el: Node,
  documentText: Array<HTMLElement>,
  handleDocumentText: Function
) {
  for (let node of el.childNodes) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (textElements.includes((node as HTMLElement).tagName)) {
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
    (el: HTMLElement) => el.innerText as string
  );
  modifiedText: Array<string> = getDOMText().map(
    (el: HTMLElement) => el.innerText as string
  );

  previousRequest:
    | { text: HTMLElement[]; data: MessageData; tabID: number }
    | undefined;
  requests: LanguageRequest["requests"] = [];
  currentRequestId = 0;

  initializeLanguageProcess = (
    text: Array<HTMLElement>,
    data: MessageData,
    tabID: number
  ) => {
    text.forEach((el, index) => {
      sendBackgroundRequest(Message.BACKGROUND_REQUEST, {
        ...data,
        id: this.currentRequestId,
        text: el.innerText as string,
        tagName: el.tagName,
        index,
        tabID,
      });
    });

    this.previousRequest = { text, data, tabID };

    this.requests = text.map(() => false);
    sendResponse(Message.DISABLE, { requests: this.requests });
  };

  updateLanguageProcess = (text: Array<HTMLElement>, data: MessageData) => {
    if (data.id === this.currentRequestId) {
      this.requests[data.index as number] = {
        text: data.text as string,
        error: data.error,
      };
      sendResponse(Message.UPDATE, { requests: this.requests });
      if (this.requests.filter((req) => req).length === this.requests.length) {
        this.currentRequestId++;
      }

      console.log(this.requests);

      if (data.text) {
        replaceDOMText(data.text.trim(), text[data.index as number]);
        this.modifiedText[data.index as number] = data.text.trim();
      }
    }
    if (data.error) console.error(`Error: ${JSON.stringify(data.error)}`);
  };

  handleRequest = (type: Message, data: MessageData, tabID) => {
    const text: Array<HTMLElement> = getDOMText();
    switch (type) {
      case Message.LANGUAGE_REQUEST:
        this.initializeLanguageProcess(text, data, tabID);
        break;
      case Message.BACKGROUND_RESPONSE:
        this.updateLanguageProcess(text, data);
        break;
      case Message.REVERT:
        const currentDOM = getDOMText().map(
          (el: HTMLElement) => el.innerText as string
        );
        const edited = this.originalText.toString() !== currentDOM.toString();
        const textReplace = edited ? this.originalText : this.modifiedText;

        text.forEach((el: HTMLElement, i) => {
          replaceDOMText(textReplace[i], el);
        });

        sendResponse(Message.REVERT_RESPONSE, {
          reverted: this.originalText.toString() !== currentDOM.toString(),
        });
        break;
      case Message.CANCEL:
        this.currentRequestId++;
        break;
      case Message.REGENERATE:
        if (this.previousRequest) {
          this.initializeLanguageProcess(
            this.previousRequest.text,
            this.previousRequest.data,
            this.previousRequest.tabID
          );
        }
        break;
      default:
        break;
    }
  };
}

const script = new ContentScript();
addMessageListener(script.handleRequest);

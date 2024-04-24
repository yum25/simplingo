import {
  sendResponse as sendBackgroundRequest,
  addMessageListener,
  sendResponse,
} from "./messaging";
import { LanguageRequest, Message, MessageData } from "./types";

const batchSize = 25;
let textElements = ["H1", "H2", "H3", "H4", "H5", "H6", "P"];

function getDOMText() {
  const documentText = [];
  const url = window.location.hostname;
  if (url === "www.youtube.com") {
    parseDocumentText(document.body, documentText, addDocumentText, ["H1", "H2", "H3", "H4", "H5", "H6", "P", "YT-ATTRIBUTED-STRING"]);
  } else if (url === "umich.instructure.com") {
    parseDocumentText(document.body, documentText, addDocumentText, ["H1", "H2", "H3", "H4", "H5", "H6", "P", "A"]);
  } else {
    parseDocumentText(document.body, documentText, addDocumentText, textElements);
  }
 
  return documentText;
}

function replaceDOMText(newText: string, el: HTMLElement) {
  if (el) {
    el.textContent = "";
    el.innerHTML = "";
    el.innerText = newText;
  }
}

function replaceDOMHTML(newHTML: string, el: HTMLElement) {
  if (el) {
    el.innerHTML = newHTML;
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
    if (el.parentElement?.tagName === "A") {
      documentText.push(el.parentElement);
    } else {
      documentText.push(el);
    }
  }
}

// See https://stackoverflow.com/questions/5558613/replace-words-in-the-body-text
function parseDocumentText(
  el: Node,
  documentText: Array<HTMLElement>,
  handleDocumentText: Function,
  textElements,
) {
  for (let node of el.childNodes) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (textElements.includes((node as HTMLElement).tagName)) {
          handleDocumentText(node, documentText, handleDocumentText);
        } else {
          parseDocumentText(node, documentText, handleDocumentText, textElements);
        }
        break;
      // case Node.TEXT_NODE:
      //     handleDocumentText(node, documentText);
      //     break;
      case Node.DOCUMENT_NODE:
        parseDocumentText(node, documentText, handleDocumentText, textElements);
    }
  }
}

class ContentScript {
  originalHTML: Array<string> = getDOMText().map(
    (el: HTMLElement) => el.innerHTML as string
  );
  originalText: Array<string> = getDOMText().map(
    (el: HTMLElement) => el.innerText as string
  );
  modifiedText: Array<string> = getDOMText().map(
    (el: HTMLElement) => el.innerText as string
  );

  modified = false;

  previousRequest:
    | { text: HTMLElement[]; data: MessageData; tabID: number }
    | undefined;
  requests: LanguageRequest["requests"] = [];
  currentRequestId = 0;

  interval;
  batchCount = 0;

  sendBatchRequest = (
    text: Array<HTMLElement>,
    data: MessageData,
    tabID: number
  ) => {
    const batch = text.slice(
      this.batchCount * batchSize,
      (this.batchCount + 1) * batchSize
    );

    batch.forEach((el, index) => {
      sendBackgroundRequest(Message.BACKGROUND_REQUEST, {
        ...data,
        id: this.currentRequestId,
        text: el.innerText as string,
        tagName: el.tagName,
        index: index + this.batchCount * batchSize,
        tabID,
      });
    });

    this.batchCount++;
  };

  initializeLanguageProcess = (
    text: Array<HTMLElement>,
    data: MessageData,
    tabID: number
  ) => {
    this.previousRequest = { text, data, tabID };

    this.requests = text.map(() => false);
    sendResponse(Message.DISABLE, { requests: this.requests });

    this.batchCount = 0;

    this.sendBatchRequest(text, data, tabID);
    this.interval = setInterval(() => {
      this.sendBatchRequest(text, data, tabID);

      if (this.batchCount * batchSize === text.length) {
        clearInterval(this.interval);
      }
    }, 16000);
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
        this.modified = true;
      }

      if (data.text) {
        replaceDOMText(data.text, text[data.index as number]);
        this.modifiedText[data.index as number] = data.text;
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
        const textReplace = this.modified
          ? this.originalHTML
          : this.modifiedText;

        text.forEach((el: HTMLElement, i) => {
          replaceDOMHTML(textReplace[i], el);
        });

        sendResponse(Message.REVERT_RESPONSE, {
          reverted: this.modified,
        });

        this.modified = !this.modified;
        break;
      case Message.CANCEL:
        this.currentRequestId++;
        this.modified = true;
        clearInterval(this.interval);
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
      // case Message.INTENSIVE:
      //   if (data.intensive) {
      //     textElements = ["H1", "H2", "H3", "H4", "H5", "H6", "A", "LI", "P"];
      //   }  else {
      //     textElements = ["H1", "H2", "H3", "H4", "H5", "H6", "P"];
      //   }
      //   break;
      default:
        break;
    }
  };
}

const script = new ContentScript();
addMessageListener(script.handleRequest);

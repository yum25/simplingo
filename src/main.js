const VisibleDOM = document.body

const verifyText = (node) => {
    return !/SCRIPT|STYLE/.test(node.parentNode.tagName) && 
    node.textContent.trim().length > 0 &&
   /[a-zA-Z]/g.test(node.textContent)
}

const addDocumentText = (el, documentText) => {
    if (verifyText(el)) {
        documentText.push([el.textContent.trim(), el.parentNode]);
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

const documentText = [];
parseDocumentText(VisibleDOM, documentText, addDocumentText);
console.log(documentText);

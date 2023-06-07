import { Observable } from 'lib0/observable';
import { sendGlobalMessage } from './util';

export class Content extends Observable {
  constructor(doc, dataAttribute = 'data-yjs') {
    super();

    this.doc = doc;
    this.dataAttribute = dataAttribute;

    this.render();

    this.on('input-change', (update) => {
      console.log('Content.js: input-change: ', update);
      sendGlobalMessage('UPDATE', { update });
    });

    this.on('doc-update', (newDoc) => {
      console.log('Content.js: doc-update: ', newDoc);
      this.doc = newDoc;
      this.render();
    });
  }

  render() {
    const dataEls = document.querySelectorAll(`[${this.dataAttribute}]`);
    for (const element of dataEls) {
      this.renderElement(element);
      this.addInputListener(element);
    }
  }

  renderElement(element) {
    element.setAttribute('contentEditable', 'true');
    const dataAttribute = element.getAttribute(this.dataAttribute);
    element.textContent = this.valueFor(dataAttribute) || '[empty]';
  }

  addInputListener(element) {
    const boundHandleInputChange = this.handleInputChange.bind(this);
    element.addEventListener('input', boundHandleInputChange, false);
  }

  handleInputChange(event) {
    const updatedValue = event.target.textContent;
    const dataAttribute = event.target.getAttribute(this.dataAttribute);
    this.emit('input-change', [getUpdate(dataAttribute, updatedValue)]);
  }

  valueFor(dataAttribute) {
    const storagePath = dataAttributeToArray(dataAttribute);
    let currentObj = this.doc;
    for (let i = 0; i < storagePath.length; i++) {
      currentObj = currentObj[storagePath[i]];
    }
    return currentObj;
  }
}

/**
 * Gets an attribute value from an element and converts it to an array.
 * Example: "about-p-0" => ['about', 'p', 0]
 * @param {string} str
 * @returns {Array<string|number>}
 */
function dataAttributeToArray(str) {
  const arr = str.split('-');
  return arr.map((element) => {
    if (!isNaN(element)) {
      return parseInt(element);
    } else {
      return element;
    }
  });
}

function getUpdate(dataAttribute, updatedValue) {
  return { path: dataAttributeToArray(dataAttribute), value: updatedValue };
}

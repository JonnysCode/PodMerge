import { Observable } from 'lib0/observable';
import { sendGlobalMessage } from './util';

export class ContentProvider extends Observable {
  constructor(doc, dataAttribute = 'data-yjs') {
    super();

    this.doc = doc;
    this.dataAttribute = dataAttribute;

    this.render();

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
    const dataPath = element.getAttribute(this.dataAttribute);
    element.textContent = this.valueFor(dataPath) || '[empty]';
  }

  addInputListener(element) {
    const boundHandleInputChange = this.handleInputChange.bind(this);
    element.addEventListener('input', boundHandleInputChange, false);
  }

  handleInputChange(event) {
    const updatedValue = event.target.textContent;
    const dataPath = event.target.getAttribute(this.dataAttribute);
    this.applyUpdate(constructUpdate(dataPath, updatedValue));
  }

  applyUpdate(update) {
    sendGlobalMessage('UPDATE', { update });
  }

  valueFor(dataAttribute) {
    const storagePath = dataPathToArray(dataAttribute);
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
export function dataPathToArray(str) {
  const arr = str.split('-');
  return arr.map((element) => {
    if (!isNaN(element)) {
      return parseInt(element);
    } else {
      return element;
    }
  });
}

export function constructUpdate(dataPath, updatedValue) {
  return { path: dataPathToArray(dataPath), value: updatedValue };
}

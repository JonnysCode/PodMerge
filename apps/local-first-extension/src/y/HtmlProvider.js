import * as Y from 'yjs';
import { Observable } from 'lib0/observable';
import { getYjsDoc } from '@syncedstore/core';

export class HtmlProvider extends Observable {
  constructor(store, dataAttribute = 'data-yjs') {
    super();

    this.ydoc = getYjsDoc(store);
    this.store = store;
    this.dataAttribute = dataAttribute;

    this.render();

    this.ydoc.on('update', (update, origin) => {
      if (origin !== this && origin !== null) {
        console.log('[HTML Provider] Update from ', origin);
        this.emit('update', [update]);
      }
    });

    this.on('update', (update) => {
      Y.applyUpdate(this.ydoc, update, this);
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

  addInputListener(element) {
    const boundHandleInputChange = this.handleInputChange.bind(this);
    element.addEventListener('input', boundHandleInputChange, false);
  }

  renderElement(element) {
    element.setAttribute('contentEditable', 'true');
    const dataAttribute = element.getAttribute(this.dataAttribute);
    element.textContent = this.storeValue(dataAttribute) || '[empty]';
  }

  handleInputChange(event) {
    const updatedValue = event.target.textContent;
    const dataAttribute = event.target.getAttribute(this.dataAttribute);
    this.updateStore(dataAttribute, updatedValue);
  }

  updateStore(dataAttribute, updatedValue) {
    let currentObj = this.store.data;
    let storagePath = dataAttributeToArray(dataAttribute);
    for (let i = 0; i < storagePath.length - 1; i++) {
      currentObj = currentObj[storagePath[i]];
    }
    const lastIndex = storagePath[storagePath.length - 1];
    if (typeof lastIndex === 'number') {
      currentObj.splice(lastIndex, 1, updatedValue);
    } else {
      currentObj[lastIndex] = updatedValue;
    }
  }

  storeValue(dataAttribute) {
    const storagePath = dataAttributeToArray(dataAttribute);
    let currentObj = this.store.data;
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

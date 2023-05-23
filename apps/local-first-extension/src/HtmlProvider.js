import * as Y from 'yjs';
import { Observable } from 'lib0/observable';
import { getYjsDoc } from '@syncedstore/core';

export class HtmlProvider extends Observable {
  constructor(store, dataAttribute = 'data-yjs') {
    super();

    this.ydoc = getYjsDoc(store);
    this.store = store;
    this.dataAttribute = dataAttribute;

    this.init();

    this.ydoc.on('update', (update, origin) => {
      // ignore updates applied by this provider
      if (origin !== this) {
        // this update was produced either locally or by another provider.
        console.log('[HTML Provider] Update: ', update, ' Origin: ', origin);
        this.emit('update', [update]);
      }
    });
    // listen to an event that fires when a remote update is received
    this.on('update', (update) => {
      Y.applyUpdate(this.ydoc, update, this); // the third parameter sets the transaction-origin
    });
  }

  init() {
    const dataEls = document.querySelectorAll(`[${this.dataAttribute}]`);
    for (const element of dataEls) {
      this.initElement(element);
    }
  }

  initElement(element) {
    element.setAttribute('contentEditable', 'true');
    const dataAttribute = element.getAttribute(this.dataAttribute);
    element.textContent = this.storeValue(dataAttribute) || '[empty]';

    const boundHandleInputChange = this.handleInputChange.bind(this);
    element.addEventListener('input', boundHandleInputChange, false);
  }

  handleInputChange(event) {
    const updatedValue = event.target.textContent;
    console.log('[HTML Provider] attribute: ', this.dataAttribute);
    const dataAttribute = event.target.getAttribute(this.dataAttribute);
    console.log('[HTML Provider] Update: ', dataAttribute, updatedValue);

    this.updateStore(dataAttribute, updatedValue);
  }

  updateStore(dataAttribute, updatedValue) {
    let currentObj = this.store;
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
    let currentObj = this.store;
    for (let i = 0; i < storagePath.length; i++) {
      currentObj = currentObj[storagePath[i]];
    }
    console.log(
      '[HTML Provider] Store value: ',
      currentObj,
      ' for data attribute: ',
      dataAttribute
    );
    return currentObj;
  }
}

/**
 * Gets a data attribute from an element and converts it to an array.
 * Example: data-yjs="about-p-0" => ['about', 'p', 0]
 * @param {string} str
 * @returns {[]}
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

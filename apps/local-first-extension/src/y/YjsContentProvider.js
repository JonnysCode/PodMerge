import * as Y from 'yjs';
import { getYjsDoc } from '@syncedstore/core';
import { ContentProvider } from '../ContentProvider';

export class YjsContentProvider extends ContentProvider {
  constructor(store, dataAttribute = 'data-yjs', docRoot = 'data') {
    super(store[docRoot], dataAttribute);

    this.ydoc = getYjsDoc(store);
    this.store = store;
    this.docRoot = docRoot;

    this.ydoc.on('update', (update, origin) => {
      if (origin !== this && origin !== null) {
        console.log('[HTML Provider] Update from ', origin);
        this.emit('external-update', [update]);
      }
    });

    this.on('external-update', (update) => {
      Y.applyUpdate(this.ydoc, update, this);
      this.render();
    });
  }

  applyUpdate(update) {
    const { path, value } = update;

    let currentObj = this.store.data;
    for (let i = 0; i < path.length - 1; i++) {
      currentObj = currentObj[path[i]];
    }

    const last = path.pop();
    if (typeof last === 'number') {
      currentObj.splice(last, 1, value);
    } else {
      currentObj[last] = value;
    }
  }
}

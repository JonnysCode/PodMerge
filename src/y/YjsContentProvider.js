import { observeDeep, Y } from '@syncedstore/core';
import { ContentProvider } from '../editor/ContentProvider';

export class YjsContentProvider extends ContentProvider {
  constructor(data, dataAttribute = 'data-yjs') {
    super(data, dataAttribute);

    this.ydoc = data.doc;

    this.ydoc.on('update', (update, origin) => {
      console.log('[YjsContentProvider] Update from: ', origin);
      if (origin !== this && origin !== null) {
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

    let currentObj = this.doc;
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

'use strict';

import * as Automerge from '@automerge/automerge';
import { base64ToBytes, bytesToBase64 } from 'byte-base64';

export class AMStore {
  constructor(name, doc = null, root = 'data') {
    this.name = name;
    this.root = root;
    this.doc = doc || Automerge.init();
  }

  static fromDocState(name, docState) {
    let doc = Automerge.load(base64ToBytes(docState));
    return new AMStore(name, doc);
  }

  static fromJson(name, json) {
    return new AMStore(name, Automerge.from(json));
  }

  get json() {
    return JSON.stringify(this.doc);
  }

  get state() {
    return bytesToBase64(Automerge.save(this.doc));
  }

  applyUpdate(update) {
    console.log('[AMStore] Update: ', update);
    const path = update.path;
    this.doc = Automerge.change(this.doc, (doc) => {
      let current = doc;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path.length - 1] = update.value;
    });

    console.log('[AMStore] Doc', this.doc);
  }
}

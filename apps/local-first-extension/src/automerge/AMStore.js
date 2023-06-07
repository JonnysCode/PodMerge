'use strict';

import * as Automerge from '@automerge/automerge';

import { constructRequest } from '../solid/fetch.js';
import { LDStore } from '../LD/LDStore.js';
import { base64ToBytes, bytesToBase64 } from 'byte-base64';

export class AMStore {
  constructor(name, root = 'data', doc = null) {
    this.name = name;
    this.root = root;

    this.doc = doc || Automerge.init();
  }

  initHtmlProvider() {}

  initWebrtcProvider() {}

  initIndexeddbPersistence() {}

  static fromDocState(name, docState) {
    let doc = Automerge.load(base64ToBytes(docState));
    return new AMStore(name, null, doc);
  }

  static fromJson(name, json) {
    console.log('JSON: ', json);
    return new AMStore(name, null, Automerge.from(json));
  }

  toJSON() {
    return this.doc;
  }

  getDocState() {
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

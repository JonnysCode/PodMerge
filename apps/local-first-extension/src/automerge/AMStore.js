'use strict';

import * as Automerge from '@automerge/automerge';

import { constructRequest } from '../solid/fetch.js';
import { LDStore } from '../LD/LDStore.js';

export class AMStore {
  constructor(name, root = 'data', doc = null) {
    this.name = name;
    this.root = root;

    this.doc = doc || Automerge.init();

    this.ldStore = new LDStore(
      'https://imp.inrupt.net/local-first/blog/context.ttl'
    );
  }

  initHtmlProvider() {}

  initWebrtcProvider() {}

  initIndexeddbPersistence() {}

  static fromDocState(name, docState) {
    return new DataStore(name, null, Automerge.load(docState));
  }

  static fromJson(name, json) {
    return new DataStore(name, null, Automerge.from(json));
  }

  toJSON() {
    return this.doc;
  }

  getDocState() {
    return Automerge.save(this.doc);
  }
}

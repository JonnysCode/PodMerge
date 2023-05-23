'use strict';

import { syncedStore, getYjsDoc } from '@syncedstore/core';
import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';
import * as Y from 'yjs';

import { getCRDT, showPerson } from './query.js';
import { constructRequest } from './fetch.js';
import * as base64 from 'byte-base64';
import { HtmlProvider } from './HtmlProvider.js';

export class DataStore {
  constructor(name, initialState = null) {
    this.name = name;
    this.store = syncedStore({});
    this.doc = getYjsDoc(this.store);
    if (initialState) this.init(initialState);
    this.htmlProvider = new HtmlProvider(this.store);
  }

  async init(initialState) {
    Y.applyUpdate(this.doc, base64.base64ToBytes(initialState));
  }

  async fetchStoreState() {
    const response = await fetch(jsonUrl);
    const json = await response.json();
    console.log(json);
    this.store.content = json;
  }

  async getCRDT() {
    const crdt = await getCRDT();
    console.log(crdt);
    this.store.content = crdt;
  }

  async showPerson() {
    const person = await showPerson();
    console.log(person);
    this.store.content = person;
  }

  async constructRequest() {
    const request = await constructRequest();
    console.log(request);
    this.store.content = request;
  }
}

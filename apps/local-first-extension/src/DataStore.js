'use strict';

import { syncedStore, getYjsDoc, getYjsValue } from '@syncedstore/core';
import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';
import * as Y from 'yjs';

import { getCRDT, showPerson } from './query.js';
import { constructRequest } from './fetch.js';
import { base64ToBytes, bytesToBase64 } from 'byte-base64';
import { HtmlProvider } from './HtmlProvider.js';
import { LDStore } from './LDStore.js';

export class DataStore {
  constructor(name, root = 'data') {
    this.name = name;
    this.root = root;
    this.rootShape = createObjectWithRoot(root);
    this.rootStore = syncedStore(this.rootShape);
    this.ldStore = new LDStore(
      'https://imp.inrupt.net/local-first/blog/context.ttl'
    );

    this.htmlProvider = null;
    this.webrtcProvider = null;
    this.indexeddbPersistence = null;
  }

  get rootDoc() {
    return getYjsDoc(this.rootStore);
  }

  get doc() {
    return getYjsValue(this.rootStore);
  }

  get store() {
    return this.rootStore[this.root];
  }

  initHtmlProvider() {
    this.htmlProvider = new HtmlProvider(this.rootStore);
  }

  initWebrtcProvider() {
    this.webrtcProvider = new WebrtcProvider(this.name, this.rootDoc, {
      signaling: ['ws://localhost:4444'],
    });
  }

  initIndexeddbPersistence() {
    this.indexeddbPersistence = new IndexeddbPersistence(
      this.name,
      this.rootDoc
    );
  }

  static fromDocState(name, docState) {
    const dataStore = new DataStore(name);
    Y.applyUpdate(dataStore.rootDoc, base64ToBytes(docState));
    console.log('RootDoc: ', dataStore.rootDoc.toJSON());
    console.log('RootStore title: ', dataStore.rootStore.data.about.title);
    return dataStore;
  }

  static fromJson(name, json) {
    const data = new DataStore(name);
    const rootMap = data.doc.getMap(data.root);
    nestedYDocFromJson(json, rootMap);

    console.log('[DataStore] dataStore.doc: ', data.doc.toJSON());
    console.log('[DataStore] Store Title: ', data.store.about.title);
    return data;
  }

  toJSON() {
    return this.doc.toJSON();
  }

  getDocState() {
    return bytesToBase64(Y.encodeStateAsUpdate(this.doc));
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

function nestedYDocFromJson(json, parent) {
  const yDoc = parent || new Y.Doc();

  const isRoot = yDoc instanceof Y.Doc;

  console.log('Is root: ', isRoot);
  console.log('json: ', json);

  for (const [key, value] of Object.entries(json)) {
    console.log('Entry: ', key, value);
    if (Array.isArray(value)) {
      let yArray = null;
      if (isRoot) {
        yArray = yDoc.getArray(key);
      } else {
        yArray = new Y.Array();
        yDoc.set(key, yArray);
      }
      nestedYArray(value, yArray);
    } else if (typeof value === 'object') {
      let yjsMap = null;
      if (isRoot) {
        yjsMap = yDoc.getMap(key);
      } else {
        yjsMap = new Y.Map();
        yDoc.set(key, yjsMap);
      }
      nestedYDocFromJson(value, yjsMap);
    } else {
      if (isRoot) {
        throw new Error('Y.Doc value cannot be a primitive');
      }
      yDoc.set(key, value);
    }
  }

  return yDoc;
}

function nestedYArray(array, parent) {
  const yArray = parent || new Y.Array();

  array.forEach((item) => {
    if (Array.isArray(item)) {
      const nestedYjsArray = new Y.Array();
      yArray.push([nestedYjsArray]);
      nestedYArray(item, nestedYjsArray);
    } else if (typeof item === 'object') {
      const nestedYMap = new Y.Map();
      yArray.push([nestedYMap]);
      nestedYDocFromJson(item, nestedYMap);
    } else {
      yArray.push([item]);
    }
  });

  return yArray;
}

function createObjectWithRoot(root) {
  const obj = {};
  obj[root] = {};
  return obj;
}

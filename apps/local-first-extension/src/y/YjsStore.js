'use strict';

import { syncedStore, getYjsDoc, getYjsValue } from '@syncedstore/core';
import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';
import * as Y from 'yjs';

import { base64ToBytes, bytesToBase64 } from 'byte-base64';
import { LDStore } from '../LD/LDStore.js';

export class YjsStore {
  constructor(name, root = 'data') {
    this.name = name;
    this.root = root;
    this.rootShape = createObjectWithRoot(root);
    this.rootStore = syncedStore(this.rootShape);
    this.ldStore = new LDStore(
      'https://imp.inrupt.net/local-first/blog/context.ttl'
    );

    this.webrtcProvider = null;
    this.indexeddbPersistence = null;
  }

  static fromDocState(name, docState) {
    const dataStore = new YjsStore(name);
    Y.applyUpdate(dataStore.rootDoc, base64ToBytes(docState));

    return dataStore;
  }

  static fromJson(name, json) {
    const data = new YjsStore(name);
    const rootMap = data.rootDoc.getMap(data.root);
    nestedYDocFromJson(json, rootMap);

    return data;
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

  get json() {
    return JSON.stringify(this.doc.toJSON());
  }

  get state() {
    return bytesToBase64(Y.encodeStateAsUpdate(this.rootDoc));
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
}

function nestedYDocFromJson(json, parent) {
  const yDoc = parent || new Y.Doc();

  const isRoot = yDoc instanceof Y.Doc;

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

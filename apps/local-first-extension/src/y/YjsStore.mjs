'use strict';

import { syncedStore, getYjsDoc, getYjsValue, Y } from '@syncedstore/core';
import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';

import { base64ToBytes, bytesToBase64 } from 'byte-base64';

export class YjsStore {
  constructor(name, root = 'data') {
    this.name = name;
    this.root = root;
    this.rootShape = createObjectWithRoot(root);
    this.rootStore = syncedStore(this.rootShape);

    this.webrtcProvider = null;
    this.indexeddbPersistence = null;
  }

  static fromDocState(name, docState) {
    const dataStore = new YjsStore(name);
    Y.applyUpdate(dataStore.rootDoc, base64ToBytes(docState));

    return dataStore;
  }

  static fromJson(name, json) {
    const data = new YjsStore(name, 'jsonld');
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

  // if the object contains an @type property, then it is a JsonLD object
  if (hasCrdtType(json)) {
    const type = getCrdtType(json);
    if (type === 'Map') {
      const yMap = new Y.Map();
      yDoc.set('jsonld', yMap);
      nestedYDocFromJson(json, yMap);
    }
  }

  for (const [key, value] of Object.entries(json)) {
    console.log('Entry: ', key, value);
    if (Array.isArray(value)) {
      addArrayEntry(key, value, yDoc, isRoot);
    } else if (typeof value === 'object') {
      addMapEntry(key, value, yDoc, isRoot);
    } else {
      if (isRoot) {
        throw new Error('Y.Doc value cannot be a primitive');
      }
      yDoc.set(key, value);
    }
  }

  return yDoc;
}

function addMapEntry(key, value, doc, isRoot = false) {
  let map = null;
  if (isRoot) {
    map = doc.getMap(key);
  } else {
    map = new Y.Map();
    doc.set(key, map);
  }
  nestedYDocFromJson(value, map);
}

function addArrayEntry(key, value, doc, isRoot = false) {
  let array = null;
  if (isRoot) {
    array = doc.getArray(key);
  } else {
    array = new Y.Array();
    doc.set(key, array);
  }
  nestedYArray(value, array);
}

function addYTextEntry(key, value, doc, isRoot = false) {
  let text = null;
  if (isRoot) {
    text = doc.getText(key);
  } else {
    text = new Y.Text();
    doc.set(key, text);
  }
  text.insert(0, value);
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

function hasCrdtType(obj) {
  return (
    obj.hasOwnProperty('@type') && compactIriPrefix(obj['@type']) === 'crdt'
  );
}

function getCrdtType(obj) {
  return compactIriSuffix(obj['@type']);
}

function compactIriPrefix(iri) {
  const parts = iri.split(':');
  return parts[0];
}

function compactIriSuffix(iri) {
  const parts = iri.split(':');
  return parts[1];
}

function createObjectWithRoot(root) {
  const obj = {};
  obj[root] = {};
  return obj;
}

'use strict';

import syncedStore, { getYjsDoc } from '@syncedstore/core';
import * as Y from 'yjs';
import * as base64 from 'byte-base64';

import { getCRDT } from './LD/query.js';
import { constructRequest } from './solid/fetch.js';
import { DataStore } from './y/DataStore.js';
import { LDStore } from './LD/LDStore.js';
import { getSession, loginSolid } from './solid/auth.js';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page title is: '${pageTitle}' --- evaluated by Chrome extension's 'contentScript.js' file`
);

// Get the URL of the JSON data file -> replace with LD later
const currentPageUrl = window.location.href;
const baseUrl = currentPageUrl.substring(
  0,
  currentPageUrl.lastIndexOf('/') + 1
);
const jsonUrl = baseUrl + 'content.json';
console.log(`JSON data URL is: '${jsonUrl}'`);

let dataStore = null;
let docState = null;
let json = null;
let session = getSession();

const ldStore = new LDStore(
  'https://imp.inrupt.net/local-first/blog/context.ttl'
);

// Listen for message
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('Message received in contentScript file');

  switch (request.type) {
    case 'LOGIN':
      session = await loginSolid();
      break;
    case 'EDIT':
      //initialState = await fetchStoreState();
      docState = await ldStore.getDocument();
      dataStore = DataStore.fromDocState(baseUrl, docState);
      dataStore.initHtmlProvider();
      break;
    case 'SYNC':
      dataStore.initWebrtcProvider();
      break;
    case 'SAVE':
      //await ldStore.documentOperations();
      docState = dataStore.getDocState();
      console.log('DocState: ', docState);
      await ldStore.saveDocument(docState);
      break;
    case 'JSON':
      json = await getJSON(jsonUrl);
      console.log('JSON data: ', json);
      dataStore = DataStore.fromJson(baseUrl, json);
      dataStore.initHtmlProvider();
      break;
    case 'LOG':
      console.log('Session: ', session);
      console.log('Framework: ', await ldStore.getFramework());
      break;
    case 'TEST':
      console.log('Test...');
      break;
    default:
      break;
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});

async function getJSON(url) {
  const response = await fetch(url);
  const data = await response.json();

  console.log('JSON data: ', data);
  return data;
}

async function fetchStoreState() {
  const stateBase64 = await constructRequest(
    'https://imp.inrupt.net/local-first/blog/content.bin',
    'GET'
  );
  console.log('[fetch] Result base64: ', stateBase64);
  return stateBase64;
}

function testSyncedStore() {
  const doc1 = new Y.Doc();
  //doc1.getMap('test');
  const store = syncedStore({ test: {} }, doc1);

  const doc2 = new Y.Doc();
  doc2.getMap('test').set('a', 1);
  const state = Y.encodeStateAsUpdate(doc2);

  Y.applyUpdate(doc1, state);

  console.log('doc1: ', doc1.toJSON());
  console.log('doc2: ', doc2.toJSON());
  console.log('store: ', store);
  console.log('store.test.a: ', store.test.a);
  console.log('store doc: ', getYjsDoc(store).toJSON());
}

function testSyncedStoreDoc() {
  const store = syncedStore({ test: {} });
  const doc1 = getYjsDoc(store);

  const map = doc1.getMap('test');
  map.set('a', 1);

  console.log('doc1: ', doc1.toJSON());
  console.log('store: ', store);
  console.log('store.test.a: ', store.test.a);
}

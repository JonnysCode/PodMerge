'use strict';

import './contentScript.css';
import './main.css';

import { YjsStore } from './y/YjsStore.mjs';
import { LDStore } from './LD/LDStore.js';
import { getSession, loginSolid } from './solid/auth.js';
import { sendGlobalMessage } from './util.js';
import { ContentProvider } from './editor/ContentProvider.js';
import { YjsContentProvider } from './y/YjsContentProvider.js';
import { LinkedDataEditor } from './editor/LinkedDataEditor';
import { SyncedJsonLD } from './y/SyncedJsonLD.mjs';

const currentPageUrl = window.location.href;
const baseUrl = currentPageUrl.substring(
  0,
  currentPageUrl.lastIndexOf('/') + 1
);
const jsonUrl = baseUrl + 'content.json';
console.log(`JSON data URL is: '${jsonUrl}'`);

let store = null;
let data = null;
let session = getSession();
let contentProvider = null;
let ldEditor = null;

const ldStore = new LDStore(baseUrl + 'context.ttl');

const hasDesc = await ldStore.isCollaborativeResource();

const framework = await ldStore.getFramework();
console.log('Framework: ', framework);

document.getElementById('menu').classList.add('pb-12');

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  switch (request.type) {
    case 'LOGIN':
      session = await loginSolid();
      break;
    case 'EDIT':
      initFromState();
      break;
    case 'SYNC':
      initSync();
      break;
    case 'SAVE':
      save();
      break;
    case 'JSON':
      initFromJson();
      break;
    case 'AM_CREATED':
      store = request.payload.store;
      console.log('[AM_CREATED] DataStore: ', store);
    case 'LOG':
      console.log('Session: ', session);
      console.log('Framework: ', await ldStore.getFramework());
      //await ldStore.log();
      console.log(data.toJsonLd());
      break;
    case 'TEST':
      console.log('Test...');
      break;
    default:
      break;
  }

  sendResponse({});
  return true;
});

async function initFromState() {
  console.log('Edit content...');

  let state = await ldStore.getDocument();

  if (framework === 'Yjs') {
    store = YjsStore.fromDocState(baseUrl, state);
    contentProvider = new YjsContentProvider(store.rootStore);
  } else if (framework === 'Automerge') {
    const response = await sendGlobalMessage('INIT', {
      name: baseUrl,
      state: state,
    });
    store = response.payload;
    contentProvider = new ContentProvider(store);
  }
}

async function initFromJson() {
  console.log('Init from JSON...');
  let json = await getJSON(jsonUrl);

  if (framework === 'Yjs') {
    //store = YjsStore.fromJson(baseUrl, json);
    data = SyncedJsonLD.fromJson(json, jsonUrl);
    console.log('Data: ', data.toJsonLd());
    contentProvider = new YjsContentProvider(
      data,
      'data-yjs',
      data.rootProperty
    );
    ldEditor = new LinkedDataEditor(contentProvider);
  } else if (framework === 'Automerge') {
    const response = await sendGlobalMessage('INIT', {
      name: baseUrl,
      json: json,
    });
    store = response.payload;
    contentProvider = new ContentProvider(store);
  }
}

async function initSync() {
  console.log('Sync content...');

  // Get the real-time sync operation for the document from the context
  //docState = await ldStore.getDocument();

  if (framework === 'Yjs') {
    store.initWebrtcProvider();
  } else if (framework === 'Automerge') {
    console.log('Currently no sync for Automerge');
  }
}

async function save() {
  console.log('Save content...');

  let state,
    json = null;
  if (framework === 'Yjs') {
    state = store.state;
    json = store.json;
  } else if (framework === 'Automerge') {
    let response = await sendGlobalMessage('STATE', {});
    state = response.state;
    json = response.json;
  }

  console.log('DocState: ', state);
  console.log('JSON: ', json);

  await ldStore.saveDocument(state);
}

async function getJSON(url) {
  const response = await fetch(url);
  const data = await response.json();

  console.log('JSON data: ', data);
  return data;
}

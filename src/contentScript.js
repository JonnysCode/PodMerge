'use strict';

import './contentScript.css';
import './main.css';

import { LDStore } from './LD/LDStore.js';
import { getSession, loginSolid } from './solid/auth.js';
import { sendGlobalMessage } from './util.js';
import { ContentProvider } from './editor/ContentProvider.js';
import { YjsContentProvider } from './y/YjsContentProvider.js';
import { SyncedJsonLD } from './y/SyncedJsonLD.mjs';
import { WebrtcProvider } from 'y-webrtc';

const currentPageUrl = window.location.href;
const baseUrl = currentPageUrl.substring(
  0,
  currentPageUrl.lastIndexOf('/') + 1
);
const jsonUrl = baseUrl + 'content.json';
console.log(`JSON data URL is: '${jsonUrl}'`);

let store = null;
let jsonld = null;
let session = getSession();
let contentProvider = null;

const ldStore = new LDStore(baseUrl + 'context.ttl');

ldStore.log();

if (!(await ldStore.isCollaborativeResource())) {
  console.log('No description found!');
  process.exit(1);
}

const framework = await ldStore.getFramework();
console.log('Framework: ', framework);

/*
if (hasDesc && framework === 'Yjs') {
  console.log('Init from JSON...');
  let json = await getJSON(jsonUrl);
  jsonld = SyncedJsonLD.fromJson(json, jsonUrl);

  contentProvider = new YjsContentProvider(jsonld);
}
*/

document.getElementById('menu').classList.add('tw-pb-12');

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  switch (request.type) {
    case 'LOGIN':
      session = await loginSolid();
      break;
    case 'EDIT':
      initFromState();
      //initFromJson();
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
      console.log(jsonld.toJsonLd());
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
    //jsonld = YjsStore.fromDocState(baseUrl, state);
    jsonld = SyncedJsonLD.fromYState(state);
    contentProvider = new YjsContentProvider(jsonld);
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
    jsonld = SyncedJsonLD.fromJson(json, jsonUrl);
    contentProvider = new YjsContentProvider(jsonld);
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
    //store.initWebrtcProvider();
    new WebrtcProvider('demo1-', jsonld.doc, {
      signaling: ['ws://localhost:4444'],
    });
    //jsonld.sync('demo-iswc');
  } else if (framework === 'Automerge') {
    console.log('Currently no sync for Automerge');
  }
}

async function save() {
  console.log('Save content...');

  let state,
    json = null;
  if (framework === 'Yjs') {
    state = jsonld.state;
    json = jsonld.json;
  } else if (framework === 'Automerge') {
    let response = await sendGlobalMessage('STATE', {});
    state = response.state;
    json = response.json;
  }

  console.log('DocState: ', state);
  console.log('JSON-LD: ', json);

  await ldStore.saveDocument(state);
  await ldStore.saveJsonLd(json);
}

async function getJSON(url) {
  const response = await fetch(url);
  const data = await response.json();

  console.log('JSON data: ', data);
  return data;
}

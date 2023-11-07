'use strict';

import * as base64 from 'byte-base64';
import { AMStore } from './automerge/AMStore.js';
import { sendTabMessage } from './util.js';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

let amStore = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in background file');
  let response = {};

  switch (request.type) {
    case 'LOG':
      console.log(
        'State: ',
        request.payload.state,
        ', length: ',
        request.payload.state.length
      );
      const stateString = base64.bytesToBase64(request.payload.state);
      console.log('[Background] Base64 state ', stateString);
      break;
    case 'INIT':
      initAmStore(request.payload);
      response = { payload: amStore.doc };
      break;
    case 'UPDATE':
      amStore.applyUpdate(request.payload.update);
      break;
    case 'STATE':
      response = { state: amStore.state, json: amStore.json };
      break;
    default:
      console.log(
        '[Background] Unknown message received ',
        request.type,
        sender
      );
      break;
  }

  sendResponse(response);
  return true;
});

function initAmStore(payload) {
  if (payload.json) {
    amStore = AMStore.fromJson(payload.name || 'AutomergeStore', payload.json);
    console.log('[Background] AmStore from JSON: ', amStore);
  } else if (payload.state) {
    amStore = AMStore.fromDocState(
      payload.name || 'AutomergeStore',
      payload.state
    );
    console.log('[Background] AmStore from state: ', amStore);
  } else {
    console.log('[Background] Payload requires a json or state property');
  }
}

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
      console.log('[Background] JSON: ', request.payload.json);
      amStore = AMStore.fromJson('name', request.payload.json);
      console.log('[Background] DataStore: ', amStore);
      sendResponse({ payload: amStore.doc });
      break;
    case 'UPDATE':
      let update = request.payload.update;
      console.log('[Background] Update: ', update);
      amStore.applyUpdate(update);
      break;
    case 'STATE':
      console.log('Sending doc state');
      sendResponse({ payload: amStore.getDocState() });
      break;
    case 'GREETINGS':
      const message = `Hi ${
        sender.tab ? 'Con' : 'Pop'
      }, my name is Bac. I am from Background. It's great to hear from you.`;
      console.log(request.payload.message);
      sendResponse({
        message,
      });
      break;
    default:
      console.log(
        '[Background] Unknown message received ',
        request.type,
        sender
      );
      break;
  }
});

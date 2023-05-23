'use strict';

import * as base64 from 'byte-base64';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

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
    case 'GREETINGS':
      const message = `Hi ${
        sender.tab ? 'Con' : 'Pop'
      }, my name is Bac. I am from Background. It's great to hear from you.`;

      // Log message coming from the `request` parameter
      console.log(request.payload.message);
      // Send a response message
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

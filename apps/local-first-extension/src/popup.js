'use strict';

import './popup.css';

(function () {
  const editBtn = document.getElementById('edit-btn');
  const syncBtn = document.getElementById('sync-btn');
  const saveBtn = document.getElementById('save-btn');
  const loginBtn = document.getElementById('login-btn');
  const logBtn = document.getElementById('log-btn');
  const jsonBtn = document.getElementById('json-btn');
  const testBtn = document.getElementById('test-btn');

  editBtn.addEventListener('click', () => onBtnClick('EDIT'));
  syncBtn.addEventListener('click', () => onBtnClick('SYNC'));
  saveBtn.addEventListener('click', () => onBtnClick('SAVE'));
  loginBtn.addEventListener('click', () => onBtnClick('LOGIN'));
  logBtn.addEventListener('click', () => onBtnClick('LOG'));
  jsonBtn.addEventListener('click', () => onBtnClick('JSON'));
  testBtn.addEventListener('click', () => onBtnClick('TEST'));

  function onLoadedDOM() {
    // Restore count value
    console.log('onLoadedDOM');
  }

  document.addEventListener('DOMContentLoaded', onLoadedDOM);

  // Communicate with background file by sending a message
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: 'Hello, my name is Pop. I am from Popup.',
      },
    },
    (response) => {
      console.log(response.message);
    }
  );
})();

function onBtnClick(type) {
  console.log(`${type} button clicked`);

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      chrome.tabs.sendMessage(
        tab.id,
        {
          type: type,
          payload: { message: `payload ${type} message` },
        },
        (response) => {
          console.log('[Popup] Response: ', response.message);
        }
      );
    });
  });
}

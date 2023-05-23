'use strict';

import './popup.css';

(function () {
  const editBtn = document.getElementById('edit-btn');
  const syncBtn = document.getElementById('sync-btn');
  const saveBtn = document.getElementById('save-btn');
  //const websiteNameEl = document.getElementById('website-name');

  const store = { about: { title: 'About Title' } };

  document.addEventListener('DOMContentLoaded', () => {
    //const websiteName = window.location.hostname;
    //websiteNameEl.textContent = websiteName;
  });

  editBtn.addEventListener('click', () => {
    console.log('EDIT button clicked');

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        chrome.tabs.sendMessage(
          tab.id,
          {
            type: 'EDIT',
            payload: { message: 'payload edit message', store: store },
          },
          (response) => {
            console.log('Current count value passed to contentScript file');
          }
        );
      });
    });
  });

  syncBtn.addEventListener('click', () => {
    console.log('SYNC button clicked');

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        chrome.tabs.sendMessage(tab.id, {
          type: 'SYNC',
          payload: { message: 'payload sync message', store: store },
        });
      });
    });
  });

  saveBtn.addEventListener('click', () => {
    console.log('SAVE button clicked');

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        chrome.tabs.sendMessage(tab.id, {
          type: 'SAVE',
          payload: { message: 'payload save message' },
        });
      });
    });
  });

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

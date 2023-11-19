'use strict';

import './popup.css';
import { sendTabMessage } from './util';

(function () {
  const editBtn = document.getElementById('edit-btn');
  const syncBtn = document.getElementById('sync-btn');
  const saveBtn = document.getElementById('save-btn');
  const loginBtn = document.getElementById('login-btn');

  editBtn.addEventListener('click', () => onBtnClick('EDIT'));
  syncBtn.addEventListener('click', () => onBtnClick('SYNC'));
  saveBtn.addEventListener('click', () => onBtnClick('SAVE'));
  loginBtn.addEventListener('click', () => onBtnClick('LOGIN'));

  function onLoadedDOM() {
    // Restore count value
    console.log('onLoadedDOM');
  }

  document.addEventListener('DOMContentLoaded', onLoadedDOM);
})();

async function onBtnClick(type) {
  console.log(`${type} button clicked`);

  await sendTabMessage(type, { message: `payload ${type} message` });
  window.close();
}

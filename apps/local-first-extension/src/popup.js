'use strict';

import './popup.css';
import { sendTabMessage } from './util';

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
})();

async function onBtnClick(type) {
  console.log(`${type} button clicked`);

  await sendTabMessage(type, { message: `payload ${type} message` });
  window.close();
}

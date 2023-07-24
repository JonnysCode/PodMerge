export function sendGlobalMessage(type, payload) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: type,
        payload: payload,
      },
      (response) => {
        console.log('Response: ', response);
        resolve(response);
      }
    );
  });
}

export function sendTabMessage(type, payload) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          type: type,
          payload: payload,
        },
        (response) => {
          console.log('Response: ', response.message);
          resolve(response);
        }
      );
    });
  });
}

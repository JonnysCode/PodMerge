import '../contentScript.css';

class SidePanel {
  constructor() {
    this.panelElement = null;
    this.addButton = null;
    this.closeButton = null;
    this.typeInput = null;
    this.pairsList = null;
    this.floatingButton = null;
  }

  create() {
    this._createButton();
    this._createPanel();
  }

  _createPanel() {
    this.panelElement = document.createElement('div');
    this.panelElement.id = 'side-panel';
    document.body.appendChild(this.panelElement);

    this.closeButton = document.createElement('button');
    this.closeButton.className = 'close-button';
    this.closeButton.textContent = 'Close';
    this.panelElement.appendChild(this.closeButton);

    this.typeInput = document.createElement('input');
    this.typeInput.type = 'text';
    this.panelElement.appendChild(this.typeInput);

    this.pairsList = document.createElement('ul');
    this.panelElement.appendChild(this.pairsList);

    this.addButton = document.createElement('button');
    this.addButton.className = 'add-button';
    this.addButton.textContent = 'Add Pair';
    this.panelElement.appendChild(this.addButton);

    this.closeButton.addEventListener('click', () => {
      this.toggle();
    });

    this.addButton.addEventListener('click', () => {
      this.addKeyValuePair();
    });
  }

  _createButton() {
    this.floatingButton = document.createElement('button');
    this.floatingButton.classList.add('floating-button');

    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('images/edit2.png');
    img.alt = 'Button Icon';
    this.floatingButton.appendChild(img);

    document.body.appendChild(this.floatingButton);

    this.floatingButton.addEventListener('click', () => {
      this.toggle();
    });
  }

  toggle() {
    const isOpen = this.panelElement.classList.contains('open');
    this.panelElement.classList.toggle('open');
    this.floatingButton.style.display = isOpen ? 'block' : 'none';

    if (!isOpen) {
      document.body.classList.add('side-panel-open');
    } else {
      document.body.classList.remove('side-panel-open');
    }
  }

  addKeyValuePair() {
    const pair = document.createElement('li');
    pair.className = 'pair';

    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.placeholder = 'Key';
    pair.appendChild(keyInput);

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.placeholder = 'Value';
    pair.appendChild(valueInput);

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.textContent = 'Remove';
    pair.appendChild(removeButton);

    this.pairsList.appendChild(pair);

    removeButton.addEventListener('click', () => {
      pair.remove();
    });
  }
}

export class LinkedDataEditor {
  constructor() {
    this.sidePanel = new SidePanel();
    this.sidePanel.create();
  }
}

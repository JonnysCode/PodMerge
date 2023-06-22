import '../contentScript.css';

export class SidePanel {
  constructor(jsonld) {
    this._jsonld = jsonld;
    console.log('SidePanel: constructor: ', this._jsonld);

    this.isOpen = false;

    this.els = {
      panelElement: null,
      addButton: null,
      closeButton: null,
      typeInput: null,
      typeLabel: null,
      pairsList: null,
      floatingButton: null,
      titleElement: null,
    };

    this.render();
  }

  set data(data) {
    console.log('SidePanel: set data: ', data);
    this._jsonld = data;
  }

  get data() {
    return this._jsonld;
  }

  render() {
    this._createButton();
    this._createPanel();
  }

  _createPanel() {
    this.els.panelElement = document.createElement('div');
    this.els.panelElement.id = 'side-panel';
    document.body.appendChild(this.els.panelElement);

    this.els.closeButton = document.createElement('button');
    this.els.closeButton.className = 'close-button';
    this.els.closeButton.textContent = 'Close';
    this.els.panelElement.appendChild(this.els.closeButton);

    this.els.titleElement = document.createElement('h2');
    this.els.titleElement.className = 'panel-title';
    this.els.titleElement.textContent = 'Element Name';
    this.els.panelElement.appendChild(this.els.titleElement);

    this.els.typeInput = document.createElement('input');
    this.els.typeInput.type = 'text';

    this.els.typeLabel = document.createElement('label');
    this.els.typeLabel.className = 'label';
    this.els.typeLabel.textContent = '@Type ';
    this.els.typeLabel.appendChild(this.els.typeInput);

    this.els.panelElement.appendChild(this.els.typeLabel);
    this.els.pairsList = document.createElement('ul');
    this.els.panelElement.appendChild(this.els.pairsList);

    this.els.addButton = document.createElement('button');
    this.els.addButton.className = 'add-button';
    this.els.addButton.textContent = 'Add Annotation';
    this.els.panelElement.appendChild(this.els.addButton);
    this.els.closeButton.addEventListener('click', () => {
      this.toggle();
    });

    this.els.addButton.addEventListener('click', () => {
      this.addKeyValuePair();
    });
  }

  _createSection(title) {
    const section = document.createElement('div');
    section.className = 'section';

    const sectionTitle = document.createElement('h3');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = title;
    section.appendChild(sectionTitle);

    return section;
  }

  _createButton() {
    this.els.floatingButton = document.createElement('button');
    this.els.floatingButton.classList.add('floating-button');

    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('images/edit2.png');
    img.alt = 'Button Icon';
    this.els.floatingButton.appendChild(img);

    document.body.appendChild(this.els.floatingButton);

    this.els.floatingButton.addEventListener('click', () => {
      this.toggle();
    });
  }

  setTitle(title) {
    this.els.titleElement.textContent = title;
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isOpen) {
      return;
    }
    this.els.panelElement.classList.add('open');
    this.els.floatingButton.style.display = 'none';
    document.body.classList.add('side-panel-open');
    this.isOpen = true;
  }

  close() {
    if (!this.isOpen) {
      return;
    }
    this.els.panelElement.classList.remove('open');
    this.els.floatingButton.style.display = 'block';
    document.body.classList.remove('side-panel-open');
    this.isOpen = false;
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

    this.els.pairsList.appendChild(pair);

    removeButton.addEventListener('click', () => {
      pair.remove();
    });
  }
}

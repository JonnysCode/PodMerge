import '../contentScript.css';
import { Observable } from 'lib0/observable';
import { PropertySection } from '../components/PropertySection';
import { ValueSection } from '../components/ValueSection';
import { BreadCrumb } from '../components/BreadCrumb';
import { Path } from '../components/Path';

export class SidePanel extends Observable {
  constructor() {
    super();

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
      propertySection: null,
      valueSection: null,
      breadCrumb: null,
    };

    this._create();

    this.on('update', (path) => {
      console.log('SidePanel: update: ', path);
      this.render(path);
    });
  }

  _create() {
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
    this.els.closeButton.addEventListener('click', () => {
      this.toggle();
    });

    this.renderBreadcrumb([]);

    this.els.propertySection = PropertySection('p');
    this.els.panelElement.appendChild(this.els.propertySection);

    this.els.valueSection = ValueSection('p[1]', 'crdt:Text');
    this.els.panelElement.appendChild(this.els.valueSection);
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

  render(path) {
    this.renderBreadcrumb(path);
  }

  renderBreadcrumb(path) {
    const breadCrumb = BreadCrumb('jsonld-path', path);
    const existingBreadCrumb = document.getElementById('jsonld-path');
    console.log('existingBreadCrumb: ', existingBreadCrumb);
    console.log('breadCrumb: ', breadCrumb);
    if (existingBreadCrumb) {
      existingBreadCrumb.replaceWith(breadCrumb);
    } else {
      this.els.panelElement.appendChild(breadCrumb);
    }
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

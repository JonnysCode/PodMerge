import '../contentScript.css';
import { Observable } from 'lib0/observable';
import { BreadCrumb } from '../components/BreadCrumb';
import { FloatingButton } from '../components/FloatingButton';
import { Edit } from '../components/icons/Edit';
import { TermDefinition } from '../components/TermDefinition';
import { Header } from '../components/Header';
import { SelectPropertyInfo } from '../components/SelectPropertyInfo';
import { getYjsValue } from '@syncedstore/core';

const breadCrumbId = 'bread-crumb';
const termDefinitionId = 'property-section';
const floatingButtonId = 'floating-button';

const initProperty = {
  name: 'articleBody',
  path: ['about', 'p', '[1]'],
  isExpandedTermDefinition: true,
  termDefinition: [
    {
      key: '@id',
      value: 'https://example.com/articleBody',
      updating: false,
    },
    {
      key: '@type',
      value: '@id',
      updating: false,
    },
  ],
};

class SidePanel extends Observable {
  constructor() {
    super();

    this.isOpen = false;
    this.jsonld = null;
    this.property = null;
    this.propertyPath = [];

    this.panelElement = null;
    this.floatingButton = null;

    this.on('path-update', (path) => {
      console.log('SidePanel: updatePath: ', path);
      this.propertyPath = path;
      this.render();
    });

    this.on('td-update', (property) => {
      console.log('SidePanel: updateTermDefinition ');
      this.property = property;
      this.renderTermDefinition();
    });

    this.on('jsonld-update', () => {
      console.log('SidePanel: updateJsonld ');
      this.render();
    });
  }

  init(jsonld) {
    this.jsonld = jsonld;
    this._createButton();
    this._createPanel();
  }

  _createPanel() {
    this.panelElement = document.createElement('div');
    this.panelElement.id = 'side-panel';
    document.body.appendChild(this.panelElement);

    let header = Header('header');
    this.panelElement.appendChild(header);

    this.renderBreadcrumb([]);
    this.renderTermDefinition();
  }

  _createButton() {
    this.floatingButton = FloatingButton(
      floatingButtonId,
      [Edit('2em')],
      () => {
        this.toggle();
      }
    );

    document.body.appendChild(this.floatingButton);
  }

  render() {
    this.property = this.jsonld.getPropertyDescription(this.propertyPath);

    this.renderBreadcrumb();
    this.renderTermDefinition();
  }

  renderBreadcrumb() {
    const breadCrumb = BreadCrumb(breadCrumbId, this.propertyPath);
    const existingBreadCrumb = document.getElementById(breadCrumbId);
    if (existingBreadCrumb) {
      existingBreadCrumb.replaceWith(breadCrumb);
    } else {
      this.panelElement.appendChild(breadCrumb);
    }
  }

  renderTermDefinition() {
    console.log('renderTermDefinition: ', this.property);
    console.log('jsonld context: ', getYjsValue(this.jsonld.context).toJSON());

    let termDefinition = this.property
      ? TermDefinition(termDefinitionId, this.property)
      : SelectPropertyInfo(termDefinitionId);

    const existingPropertySection = document.getElementById(termDefinitionId);
    if (existingPropertySection) {
      existingPropertySection.replaceWith(termDefinition);
    } else {
      this.panelElement.appendChild(termDefinition);
    }
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
    this.panelElement.classList.add('open');
    this.floatingButton.style.display = 'none';
    document.body.classList.add('side-panel-open');
    this.isOpen = true;
  }

  close() {
    if (!this.isOpen) {
      return;
    }
    this.panelElement.classList.remove('open');
    this.floatingButton.style.display = 'block';
    document.body.classList.remove('side-panel-open');
    this.isOpen = false;
  }
}

export const sidePanel = new SidePanel();

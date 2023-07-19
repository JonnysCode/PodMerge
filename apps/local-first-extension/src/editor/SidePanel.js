import '../contentScript.css';
import { Observable } from 'lib0/observable';
import { BreadCrumb } from '../components/BreadCrumb';
import { FloatingButton } from '../components/FloatingButton';
import { Edit } from '../components/icons/Edit';
import { TermDefinition } from '../components/TermDefinition';
import { Header } from '../components/Header';

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
    this.property = initProperty;

    this.panelElement = null;
    this.floatingButton = null;

    this.on('update', (path) => {
      console.log('SidePanel: update: ', path);
      this.render(path);
    });

    this.on('updateTermDefinition', (property) => {
      console.log('SidePanel: updateTermDefinition ');
      this.property = property;
      this.renderTermDefinition();
    });
  }

  init() {
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

  render(path) {
    this.renderBreadcrumb(path);
    this.renderTermDefinition(initProperty);
  }

  renderBreadcrumb(path) {
    const breadCrumb = BreadCrumb(breadCrumbId, path);
    const existingBreadCrumb = document.getElementById(breadCrumbId);
    console.log('existingBreadCrumb: ', existingBreadCrumb);
    console.log('breadCrumb: ', breadCrumb);
    if (existingBreadCrumb) {
      existingBreadCrumb.replaceWith(breadCrumb);
    } else {
      this.panelElement.appendChild(breadCrumb);
    }
  }

  renderTermDefinition() {
    const termDefinition = TermDefinition(termDefinitionId, this.property);
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

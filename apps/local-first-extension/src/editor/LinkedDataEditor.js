import '../contentScript.css';
import { SidePanel } from './SidePanel';

export class LinkedDataEditor {
  constructor(contentProvider) {
    this.jsonld = contentProvider.doc;
    this.contentProvider = contentProvider;

    this.sidePanel = new SidePanel(this.jsonld);

    document.addEventListener('click', (event) => {
      const targetElement = event.target;

      console.log('Selected element:', targetElement);

      if (contentProvider.isDataElement(targetElement)) {
        this.sidePanel.open();
      }
    });
  }
}

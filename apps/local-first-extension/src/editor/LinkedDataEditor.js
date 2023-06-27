import '../contentScript.css';
import { SidePanel } from './SidePanel';

export class LinkedDataEditor {
  constructor(contentProvider) {
    this.jsonld = contentProvider.doc;
    this.cp = contentProvider;

    this.sidePanel = new SidePanel(contentProvider.doc);

    document.addEventListener('click', (event) => {
      const targetElement = event.target;

      console.log('Selected element:', targetElement);

      if (this.cp.isDataElement(targetElement)) {
        this.sidePanel.open();
        const { target, prop } = this.cp.dataTargetAndPropFor(targetElement);
        this.sidePanel.emit('update', [target, prop]);

        let propDesc = this.jsonld.get;
        this.sidePanel.emit('update-property', [target, prop]);
      }
    });
  }
}

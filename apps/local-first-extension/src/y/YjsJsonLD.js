import { SyncedMap } from '@syncedstore/core';
import { JsonLD } from '../LD/JsonLd';

class YjsJsonLD extends JsonLD {
  constructor(jsonld, PRIVATE_CONSTRUCTOR_KEY) {
    super(jsonld, PRIVATE_CONSTRUCTOR_KEY);
  }

  static create(jsonld) {
    return super.fromJson(jsonld);
  }

  static fromJson(json, url = null) {
    return super.fromJson(jsonld);
  }

  static fromYStore(store, url = null) {
    return super.fromYStore(store, url);
  }

  expand(target, prop = null) {
    if (!prop && typeof target !== 'object') {
      throw new Error('Cannot expand a primitive without a propertyName');
    }

    if (typeof target[prop] === 'object') {
      target = target[prop];
    }

    let value = prop ? target[prop] : { ...target };
    if (!value.isExpanded()) {
      // TODO: Make it a SyncedMap
      if (prop) {
        target[prop] = new SyncedMap();
        target[prop]['@value'] = value;
      } else {
        Object.keys(target).forEach((key) => delete target[key]);
        target['@value'] = value;
      }
    }
  }
}

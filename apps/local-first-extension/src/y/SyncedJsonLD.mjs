import syncedStore, {
  SyncedMap,
  getYjsDoc,
  getYjsValue,
} from '@syncedstore/core';
import { JsonLD, CONSTRUCTOR_KEY } from '../LD/JsonLd.mjs';
import ontologies from '../LD/data/ontologies.json' assert { type: 'json' };
import { nestedYDocFromJson } from './util.mjs';

export class SyncedJsonLD extends JsonLD {
  /**
   *
   * @param {*} store
   * @param {*} CONSTRUCTOR_KEY
   * @param {*} rootProperty A property key to store the root of the JSON-LD document.
   *                         Yjs can only store synced types in its root, hence the need
   *                         for a root property.
   */
  constructor(store, CONSTRUCTOR_KEY, rootProperty = null) {
    super(store, CONSTRUCTOR_KEY, rootProperty);
  }

  static fromJson(json, url = null, rootProperty = 'jsonld') {
    let jsonld = addContext(json, url);
    let store = syncedStoreWithRoot(rootProperty);

    // Convert JSON-LD to Yjs and store it in the root property
    const rootMap = getYjsDoc(store).getMap(rootProperty);
    nestedYDocFromJson(jsonld, rootMap);

    return this.classProxy(
      new SyncedJsonLD(store, CONSTRUCTOR_KEY, rootProperty)
    );
  }

  static fromYStore(store, url = null, rootProperty = 'jsonld') {
    let context = {
      '@version': 1.1,
      crdt: ontologies.crdt,
    };

    store['@context'] = new SyncedMap();
    store['@context'] = context;

    if (url) {
      store['@id'] = url;
    }

    return this.classProxy(
      new SyncedJsonLD(store, CONSTRUCTOR_KEY, rootProperty)
    );
  }

  get doc() {
    return getYjsDoc(this.data);
  }

  get rootMap() {
    return getYjsValue(this.data[this.rootProperty]);
  }

  get store() {
    return this.data;
  }
}

function addContext(json, url = null) {
  let jsonld = {
    '@context': {
      '@version': 1.1,
      crdt: ontologies.crdt,
    },
    ...json,
  };

  if (url) {
    jsonld['@id'] = url;
  }

  return jsonld;
}

function syncedStoreWithRoot(rootProperty = 'jsonld') {
  let rootShape = {};
  rootShape[rootProperty] = {};

  return syncedStore(rootShape);
}

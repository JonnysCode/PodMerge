import syncedStore, {
  SyncedMap,
  getYjsDoc,
  getYjsValue,
} from '@syncedstore/core';
import { JsonLD, CONSTRUCTOR_KEY } from '../LD/JsonLd.mjs';
import ontologies from '../LD/ontologies.json' assert { type: 'json' };
import { nestedYDocFromJson } from './util.mjs';

export class YjsJsonLD extends JsonLD {
  /**
   *
   * @param {*} store
   * @param {*} CONSTRUCTOR_KEY
   * @param {*} rootProperty A property key to store the root of the JSON-LD document.
   *                         Yjs can only store synced types in its root, hence the need
   *                         for a root property.
   */
  constructor(store, CONSTRUCTOR_KEY, rootProperty = null) {
    super(store, CONSTRUCTOR_KEY);
    this.rootProperty = rootProperty;
  }

  static fromJson(json, url = null, rootProperty = 'jsonld') {
    // Add @context to json
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

    // Create an empty syncedStore with a root property to store the JSON-LD
    let rootShape = {};
    rootShape[rootProperty] = {};
    let store = syncedStore(rootShape);

    // Convert JSON-LD to Yjs and store it in the root property
    const rootMap = getYjsDoc(store).getMap(rootProperty);
    nestedYDocFromJson(jsonld, rootMap);

    console.log('store', getYjsDoc(store).toJSON());

    const yjsJsonLD = new YjsJsonLD(store, CONSTRUCTOR_KEY, rootProperty);

    console.log('yjsJsonLD', yjsJsonLD);
    console.log('yjsJsonLD data root', yjsJsonLD.data[rootProperty]);

    return this.classProxy(yjsJsonLD);
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

    return this.classProxy(new YjsJsonLD(store, CONSTRUCTOR_KEY, rootProperty));
  }

  get doc() {
    return getYjsDoc(this.data);
  }

  get rootMap() {
    return getYjsValue(this.data[this.rootProperty]);
  }
}

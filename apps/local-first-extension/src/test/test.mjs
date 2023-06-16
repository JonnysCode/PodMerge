import ontologies from './ontologies.json' assert { type: 'json' };
import { YjsStore } from '../y/YjsStore.mjs';
import { SyncedMap } from '@syncedstore/core';

const PRIVATE_CONSTRUCTOR_KEY = Symbol();

export class JsonLD {
  constructor(jsonld, constructorKey) {
    if (constructorKey !== PRIVATE_CONSTRUCTOR_KEY) {
      throw new Error(
        'You must use the JsonLD factory methods (fromJson(), ...) to construct an instance.'
      );
    }

    this.data = this.#createProxy(jsonld);
  }

  static fromJson(json, url = null) {
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

    return this.#classProxy(new JsonLD(jsonld, PRIVATE_CONSTRUCTOR_KEY));
  }

  static fromYStore(store, url = null) {
    let context = {
      '@version': 1.1,
      //crdt: ontologies.crdt,
    };

    store['@context'] = new SyncedMap();
    store['@context'] = context;

    if (url) {
      store['@id'] = url;
    }

    return this.#classProxy(new JsonLD(store, PRIVATE_CONSTRUCTOR_KEY));
  }

  static #classProxy(jsonld) {
    return new Proxy(jsonld, {
      get: function (target, prop) {
        if (
          target instanceof JsonLD &&
          prop in target.data &&
          !(prop in target)
        ) {
          return target.data[prop];
        }
        return target[prop];
      },
    });
  }

  #createProxy(value) {
    if (typeof value === 'object' && value !== null) {
      return new Proxy(value, {
        get: (target, prop) => {
          if (target[prop] === undefined) {
            prop = '@' + String(prop);
          }

          const property = target[prop];
          return typeof property === 'object' && property !== null
            ? this.#createProxy(property)
            : property;
        },
        set: (target, prop, newValue) => {
          if (typeof newValue === 'object' && newValue !== null) {
            newValue = this.#createProxy(newValue);
          }
          target[prop] = newValue;
          return true;
        },
      });
    }
  }

  /**
   * Returns the target and property of a given path in the data.
   * If the path is a string, it will be split by '.'.
   *
   * Example:
   *
   * const data = {
   *  foo: {
   *   bar: 'baz'
   * }
   *
   * getTargetAndProp('foo.bar') // { target: foo, prop: 'bar' }
   *
   * @param {*} path
   * @returns { target, prop }
   */
  getTargetAndProp(path) {
    if (typeof path === 'string') {
      path = path.split('.');
    }

    let target = this.data;
    let prop = path[0];

    for (let i = 1; i < path.length; i++) {
      target = target[prop];
      prop = path[i];
    }
    return { target, prop };
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
      if (prop) {
        target[prop] = { '@value': value };
      } else {
        Object.keys(target).forEach((key) => delete target[key]);
        target['@value'] = value;
      }
    }
  }

  isExpanded(property) {
    return property['@value'] !== undefined;
  }

  addType(target, type, prop = null) {
    this.addLdKeyword(target, '@type', type, prop);
  }

  addTypeFromPath(path, type) {
    let { target, prop } = this.getTargetAndProp(path);
    this.addType(target, type, prop);
  }

  addId(target, id, prop = null) {
    this.addLdKeyword(target, '@id', id, prop);
  }

  addIdFromPath(path, id) {
    let { target, prop } = this.getTargetAndProp(path);
    this.addId(target, id, prop);
  }

  addLdKeyword(target, keyword, iri, prop = null) {
    if (!prop && typeof target !== 'object') {
      throw new Error(
        'Cannot add a keyword to a primitive without a propertyName'
      );
    }

    if (!this.isRoot(target, prop)) {
      this.expand(target, prop);
    }

    if (this.isCompactIri(iri)) {
      let [prefix, _] = iri.split(':');
      console.log('Adding vocab to context: ', prefix);
      this.addVocabToContext(prefix);
    }

    if (prop) {
      target[prop][keyword] = iri;
    } else {
      target[keyword] = iri;
    }
  }

  isCompactIri(iri) {
    return typeof iri === 'string' && iri.includes(':');
  }

  addVocabToContext(prefix, vocab = null) {
    if (!vocab) {
      if (this.prefixInContext(prefix)) return;
      if (!prefix in ontologies) {
        throw new Error('Vocab for prefix not found');
      }
      vocab = ontologies[prefix];
    }

    this.addContext(prefix, vocab);
  }

  addContext(key, value) {
    this.data['@context'][key] = value;
  }

  prefixInContext(prefix) {
    return prefix in this.data['@context'];
  }

  addLdKeywordFromPath(path, keyword, value) {
    let { target, prop } = this.getTargetAndProp(path);
    this.addLdKeyword(target, keyword, value, prop);
  }

  isRoot(target, prop = null) {
    return target === this.data && !prop;
  }
}

Object.defineProperty(Object.prototype, 'expand', {
  value: function (propertyName = null) {
    jsonld.expand(this, propertyName);
  },
  enumerable: false,
});

Object.defineProperty(Object.prototype, 'addType', {
  value: function (type, propertyName = null) {
    jsonld.addType(this, type, propertyName);
  },
  enumerable: false,
});

Object.defineProperty(Object.prototype, 'isExpanded', {
  value: function () {
    return jsonld.isExpanded(this);
  },
  enumerable: false,
});

let data = {
  headline: 'World of Coffee',
  body: 'This blog post explores the rich history of coffee, its various types and flavors, and different brewing methods to create the perfect cup of coffee.',
  list: ['item1', 'item2', 'item3', 'item4'],
  map: {
    number: 12,
    val: 'value',
  },
};

//let jsonld = JsonLD.fromJson(data, 'https://example.com/blog-post-1');

let yjs = YjsStore.fromJson('yjs-store', data);

let context = {
  '@version': 1.1,
  crdt: ontologies.crdt,
};

yjs.store['@context'] = new SyncedMap();
yjs.store['@context'] = context;

console.log(yjs.rootDoc.toJSON());
console.log(yjs.store.body);
console.log('---------------------');

let jsonld = JsonLD.fromYStore(yjs.store, 'https://example.com/blog-post-1');

//jsonld.data.map.number.expand();
//jsonld.data.map.number.addType('crdt:Counter');

//console.log(jsonld.data.map);

//jsonld.expand(jsonld.data.map);

jsonld.addTypeFromPath('map.number', 'crdt:Counter');
console.log('---------------------');
console.log(jsonld.data.map);
console.log(jsonld.data.map.number);
console.log(jsonld.map.number.value);
console.log(jsonld.map.number.type);

jsonld.data.map.number.value = 13;
console.log(jsonld.data.map.number.value);

jsonld.addType(jsonld.data, 'crdt:Text', 'body');
console.log(jsonld.body.value);
console.log(jsonld.body.type);
console.log('---------------------');
console.log(jsonld.data['@context'].crdt);

console.log('---------------------');
console.log('crdt' in jsonld.data['@context']);

//console.log(jsonld.data.map.number);

//jsonld.data.map.addType('crdt:Counter', 'number');

//console.log(jsonld.data.map.number);

console.log(ontologies.crdt);

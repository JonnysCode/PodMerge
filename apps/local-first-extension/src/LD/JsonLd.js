import ontologies from './ontologies.json' assert { type: 'json' };
import { SyncedMap, getYjsValue } from '@syncedstore/core';

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
      crdt: ontologies.crdt,
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

  /**Returns the target and property of a given path in the data.
   * If the path is a string, it will be split by '.'.
   *
   * Example:
   *    const data = {
   *      foo: {
   *      bar: 'baz'
   *    }
   *    getTargetAndProp('foo.bar') // { target: { bar: 'baz' }, prop: 'bar' }
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
      // TODO: Make it a SyncedMap
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
      this.addVocabToContext(this.getPrefix(iri));
    }

    if (prop) {
      target[prop][keyword] = iri;
    } else {
      target[keyword] = iri;
    }
  }

  addLdKeywordFromPath(path, keyword, value) {
    let { target, prop } = this.getTargetAndProp(path);
    this.addLdKeyword(target, keyword, value, prop);
  }

  isCompactIri(iri) {
    return typeof iri === 'string' && iri.includes(':');
  }

  getPrefix(iri) {
    let [prefix, _] = iri.split(':');
    return prefix;
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
    // TODO: If the value is an object, create SyncedMap
    this.data['@context'][key] = value;
  }

  prefixInContext(prefix) {
    return prefix in this.data['@context'];
  }

  addProperty(target, prop, property, value) {
    if (!this.isRoot(target, prop)) {
      this.expand(target, prop);
    }

    if (this.isCompactIri(property)) {
      this.addVocabToContext(this.getPrefix(property));
    }

    if (prop) {
      target[prop][property] = value;
    } else {
      target[property] = value;
    }
  }

  addPropertyFromPath(path, property, value) {
    let { target, prop } = this.getTargetAndProp(path);
    this.addProperty(target, prop, property, value);
  }

  addPropertyWithContext(target, prop, property, value, context) {
    this.addContext(property, context);
    this.addProperty(target, prop, property, value);
  }

  addPropertyWithContextFromPath(path, property, value, context) {
    let { target, prop } = this.getTargetAndProp(path);
    this.addPropertyWithContext(target, prop, property, value, context);
  }

  isRoot(target, prop = null) {
    return target === this.data && !prop;
  }
}

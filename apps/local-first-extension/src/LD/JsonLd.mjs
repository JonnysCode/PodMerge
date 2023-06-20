import ontologies from './ontologies.json' assert { type: 'json' };
import { SyncedMap, getYjsValue } from '@syncedstore/core';

export const CONSTRUCTOR_KEY = Symbol();

export class JsonLD {
  /**
   *
   * @param {Object} jsonld
   * @param {Symbol} constructorKey
   * @param {string || null} rootProperty
   * @param {boolean} useProxy Allows to call "['@keyword']" directly using dot notation ".keyword"
   */
  constructor(jsonld, constructorKey, rootProperty = null, useProxy = false) {
    if (constructorKey !== CONSTRUCTOR_KEY) {
      throw new Error(
        'You must use the JsonLD factory methods (fromJson(), ...) to construct an instance.'
      );
    }

    this.rootProperty = rootProperty;
    this.data = jsonld;
    if (useProxy) {
      this.#dataProxies();
    }
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

    return this.classProxy(new JsonLD(jsonld, CONSTRUCTOR_KEY));
  }

  static classProxy(jsonld) {
    if (jsonld.rootProperty) {
      return new Proxy(jsonld, {
        get: function (target, prop) {
          if (
            target instanceof JsonLD &&
            prop in target.data[jsonld.rootProperty] &&
            !(prop in target)
          ) {
            return target.data[jsonld.rootProperty][prop];
          }
          return target[prop];
        },
      });
    }
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

  #dataProxies() {
    Object.keys(this.root).forEach((key) => {
      if (typeof this.root[key] === 'object' && this.root[key] !== null) {
        this.root[key] = this.#createProxy(this.root[key]);
      }
    });
  }

  #createProxy(value) {
    if (typeof value === 'object' && value !== null) {
      return new Proxy(value, {
        get: (target, prop) => {
          if (
            !Object.hasOwn(target, prop) &&
            Object.hasOwn(target, '@' + String(prop))
          ) {
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
          if (
            !Object.hasOwn(target, prop) &&
            Object.hasOwn(target, '@' + String(prop))
          ) {
            prop = '@' + String(prop);
          }

          target[prop] = newValue;
          return true;
        },
      });
    }
  }

  get root() {
    return this.rootProperty ? this.data[this.rootProperty] : this.data;
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

    let target = this.root;
    let prop = path[0];
    for (let i = 1; i < path.length; i++) {
      target = target[prop];
      prop = path[i];
    }

    return { target, prop };
  }

  /**
   * Example:
   *    target, prop: { number: 12, val: 'foo' }, null -> { '@value': { number: 12, val: 'foo' }}
   *    target, prop: { number: 12, val: 'foo' }, 'number' -> { number: { '@value': 12 }, val: 'foo' }
   *
   * @param {*} target
   * @param {*} prop
   */
  expand(target, prop = null) {
    if (!prop && typeof target !== 'object') {
      throw new Error('Cannot expand a primitive without a propertyName');
    }

    // If the property is an object we have to clone it
    let property = null;
    if (prop) {
      property =
        typeof target[prop] === 'object' ? { ...target[prop] } : target[prop];
    } else {
      property = typeof target === 'object' ? { ...target } : target;
    }

    if (!this.isExpanded(property)) {
      if (prop) {
        target[prop] = { '@value': property };
      } else {
        Object.keys(target).forEach((key) => delete target[key]);
        target['@value'] = property;
      }
    }
  }

  isExpanded(property) {
    if (typeof property !== 'object') {
      return false;
    }
    const keysToCheck = ['@value', '@id', '@type'];
    return keysToCheck.some((key) => Object.hasOwn(property, key));
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

    // Only expand when it is not an object! Otherwise @keyword can be added directly
    if (typeof target[prop] !== 'object' && !this.isRoot(target, prop)) {
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
    this.root['@context'][key] = value;
  }

  prefixInContext(prefix) {
    return prefix in this.root['@context'];
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
    return target === this.root && !prop;
  }

  toJsonLd() {
    return JSON.stringify(this.root);
  }

  static log(target) {
    console.log(
      typeof target === 'object' ? getYjsValue(target).toJSON() : target
    );
  }
}
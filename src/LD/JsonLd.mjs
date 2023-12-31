import ontologies from './data/ontologies.json' assert { type: 'json' };
import { SyncedMap, getYjsValue } from '@syncedstore/core';

export const CONSTRUCTOR_KEY = Symbol();

const EXTENDED_TERM_DEFINITION_KEYS = [
  '@id',
  '@type',
  '@container',
  '@reverse',
  '@language',
  '@context',
  '@prefix',
  '@propagate',
  '@protected',
];

export class JsonLD {
  /**
   *
   * @param {Object} jsonld
   * @param {Symbol} constructorKey
   * @param {string || null} rootProperty
   * @param {boolean} useProxy Allows to call "['@keyword']" directly using dot notation "data.keyword"
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

  get root() {
    return this.rootProperty ? this.data[this.rootProperty] : this.data;
  }

  get context() {
    return this.root['@context'];
  }

  /**Returns the target and property of a given path in the data.
   * If the path is a string, it will be split by '.'.
   *
   * Example:
   *    const data = { foo: { bar: 'baz' } }
   *    getTargetAndProp('foo.bar') // { target: { bar: 'baz' }, prop: 'bar' }
   *
   * @param {*} path
   * @returns { target, prop }
   */
  getTargetAndProp(path, delimiter = '.') {
    if (typeof path === 'string') {
      path = path.split(delimiter);
    }

    let target = this.root;
    let prop = path[0];
    for (let i = 1; i < path.length; i++) {
      target = target[prop];
      prop = path[i];
    }

    return { target, prop };
  }

  /** Returns the property description of a given path in the data.
   *
   * @param {*} path
   * @returns { path, name, context }
   */
  getPropertyDescription(path, delimiter = '.') {
    if (typeof path === 'string') {
      path = path.split(delimiter);
    }
    const propertyPath = [...path];

    if (propertyPath.length === 0) {
      return null;
    }

    // get last element in properties that is not numeric -> assuming these are array indices
    let property = propertyPath.pop();
    while (isNumeric(property)) {
      property = propertyPath.pop();
    }

    let termDefinition = this.getTermDefinition(property);
    let isExpandedTermDefinition = false;
    console.log('termDefinition: ', termDefinition);
    if (termDefinition && typeof termDefinition === 'object') {
      isExpandedTermDefinition = true;
      termDefinition = Object.entries(termDefinition).map(([key, value]) => {
        return { term: key, definition: value, updating: false };
      });
    } else if (termDefinition && typeof termDefinition === 'string') {
      termDefinition = { value: termDefinition, updating: false };
    }

    return {
      name: property,
      path: path,
      isExpandedTermDefinition: isExpandedTermDefinition,
      termDefinition: termDefinition,
    };
  }

  getTermDefinition(term) {
    if (containsProperty(this.context, term)) {
      return this.context[term];
    }

    return null;
  }

  addSimpleTermDefinition(term, definition) {
    console.log('addSimpleTermDefinition: ', term, definition);

    if (this.isCompactIri(definition)) {
      this.addVocabToContext(this.getPrefix(definition));
    }
    this.context[term] = definition;
  }

  addExtendedTermDefinition(term, key, definition) {
    if (!key in EXTENDED_TERM_DEFINITION_KEYS) {
      throw new Error('Invalid key for extended term definition');
    }

    let currentDefinition = this.getTermDefinition(term);
    if (!currentDefinition || typeof currentDefinition !== 'object') {
      this.context[term] = new SyncedMap();
    }

    if (this.isCompactIri(definition)) {
      this.addVocabToContext(this.getPrefix(definition));
    }

    this.context[term][key] = definition;
  }

  removeExtendedTermDefinition(term, key) {
    this.context[term].delete(key);
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

  isExpanded(target) {
    if (typeof target !== 'object') {
      return false;
    }
    return containsAnyProperty(target, ['@value', '@list', '@set']);
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
      if (prefix in this.context) return;
      if (!prefix in ontologies) {
        throw new Error('Vocab for prefix not found');
      }
      vocab = ontologies[prefix];
    }

    console.log('addVocabToContext: ', prefix, vocab);
    this.context[prefix] = vocab;
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
}

// Defined at: https://www.w3.org/TR/json-ld/#node-objects
export function isNodeObject(target) {
  return (
    typeof target === 'object' &&
    !Array.isArray(target) &&
    !containsAnyProperty(target, ['@value', '@list', '@set']) &&
    !containsOnlyProperties(target, ['@context', '@graph']) &&
    !isGraphObject(target)
  );
}

// Defined at: https://www.w3.org/TR/json-ld/#graph-objects
export function isGraphObject(target) {
  return (
    typeof target === 'object' &&
    !Array.isArray(target) &&
    containsProperty(target, '@graph') &&
    !containsPropertyOtherThan(target, [
      '@graph',
      '@context',
      '@index',
      '@id',
    ]) &&
    !containsAllProperties(target, ['@graph', '@context'])
  );
}

// Defined at: https://www.w3.org/TR/json-ld/#value-objects
export function isValueObject(target) {
  return (
    typeof target === 'object' &&
    !Array.isArray(target) &&
    containsProperty(target, '@value') &&
    !containsPropertyOtherThan(target, [
      '@value',
      '@language',
      '@type',
      '@index',
      '@direction',
      '@context',
    ]) &&
    !containsAllProperties(target, ['@type', '@language']) &&
    !containsAllProperties(target, ['@type', '@direction'])
  );
}

function containsAllProperties(target, properties) {
  return properties.every((property) => containsProperty(target, property));
}

function containsAnyProperty(target, properties) {
  return properties.some((property) => containsProperty(target, property));
}

function containsOnlyProperties(target, properties) {
  return (
    Object.keys(target).length === properties.length &&
    containsAllProperties(target, properties)
  );
}

function containsPropertyOtherThan(target, properties) {
  return Object.keys(target).some((property) => !properties.includes(property));
}

function containsProperty(target, property) {
  return Object.hasOwn(target, property);
}

function isNumeric(candidate) {
  return !isNaN(candidate) && !isNaN(parseFloat(candidate));
}

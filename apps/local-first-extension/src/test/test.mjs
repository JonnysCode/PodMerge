const PRIVATE_CONSTRUCTOR_KEY = Symbol();

export class JsonLD {
  constructor(jsonld, constructorKey) {
    if (constructorKey !== PRIVATE_CONSTRUCTOR_KEY) {
      throw new Error(
        'You must use the PrivateConstructorClass.create() to construct an instance.'
      );
    }

    this.data = this.#createProxy(jsonld);
  }

  static fromJson(json, url = null) {
    // Add @context to json
    let jsonld = {
      '@context': {
        '@version': 1.1,
        crdt: 'https://imp.inrupt.net/ontologies/crdt.ttl#',
      },
      ...json,
    };

    if (url) {
      jsonld['@id'] = url;
    }

    return new JsonLD(jsonld, PRIVATE_CONSTRUCTOR_KEY);
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
    } else {
      return new Proxy(value, {
        get: (target, prop) => {
          return target[prop];
        },
        set: (target, prop, newValue) => {
          target[prop] = newValue;
          return true;
        },
      });
    }
  }

  getTargetAndProp(path) {
    let target = this.data;
    let prop = null;
    for (let i = 0; i < path.length; i++) {
      prop = path[i];
      target = target[prop];
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

  addId(target, id, prop = null) {
    this.addLdKeyword(target, '@id', id, prop);
  }

  addLdKeyword(target, keyword, value, prop = null) {
    if (!prop && typeof target !== 'object') {
      throw new Error(
        'Cannot add a keyword to a primitive without a propertyName'
      );
    }

    if (!this.isRoot(target, prop)) {
      this.expand(target, prop);
    }

    if (prop) {
      target[prop][keyword] = value;
    } else {
      target[keyword] = value;
    }
  }

  isRoot(target, prop = null) {
    return target === this.data && !prop;
  }
}

class LdProperty {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  context() {
    return this.value['@context'];
  }

  type() {
    return this.value['@type'];
  }

  id() {
    return this.value['@id'];
  }

  isExpanded() {
    return this.value['@value'] !== undefined;
  }

  isPrimitive() {
    return typeof this.value === 'string';
  }

  isObject() {
    return typeof this.value === 'object';
  }

  isList() {
    return Array.isArray(this.value);
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

let jsonld = JsonLD.fromJson(data, 'https://example.com/blog-post-1');

//jsonld.data.map.number.expand();
//jsonld.data.map.number.addType('crdt:Counter');

//console.log(jsonld.data.map);

//jsonld.expand(jsonld.data.map);

jsonld.data.map.addType('crdt:Counter', 'number');

console.log('---------------------');
console.log(jsonld.data.map);
console.log(jsonld.data.map.number);
console.log(jsonld.data.map.number.value);
console.log('---------------------');
//console.log(jsonld.data.map.number.context());

//console.log(jsonld.data.map.number);

//jsonld.data.map.addType('crdt:Counter', 'number');

//console.log(jsonld.data.map.number);

let ld = {
  headline: 'World of Coffee',
  body: 'This blog post explores the rich history of coffee, its various types and flavors, and different brewing methods to create the perfect cup of coffee.',
  list: ['item1', 'item2', 'item3', 'item4'],
  map: {
    '@value': { number: { '@value': 12 }, val: 'value' },
  },
};

export class JsonL {
  constructor(json) {
    this.data = this.createProxy(json);
  }

  createProxy(value) {
    return new Proxy(value, {
      get: (target, prop) => {
        if (target) return target[prop];
      },
    });
  }
}

let handler = {
  get: function (target, prop) {
    console.log('get', target, prop);

    if (target instanceof JsonL) {
      // Perform actions specific to the JsonLD instance
      // For example, you can access the `data` property of the JsonLD instance
      return target.data[prop];
    }
    return target[prop];
  },
};

const json = { name: 'john' };

const jsonl = new JsonL(json);
const proxy = new Proxy(jsonl, handler);

console.log(proxy.name);

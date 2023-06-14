class JsonLD {
  constructor(jsonld) {
    //this.data = this.createProxy(jsonld);
    this.data = jsonld;
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

    return new JsonLD(jsonld);
  }

  createProxy(value) {
    if (typeof value === 'object' && value !== null) {
      return new Proxy(value, {
        get: (target, prop) => {
          //console.log('get obj', target, prop);
          const property = target[prop];
          return typeof property === 'object' && property !== null
            ? this.createProxy(property)
            : property;
        },
        set: (target, prop, newValue) => {
          console.log('set obj', target, prop);
          if (typeof newValue === 'object' && newValue !== null) {
            newValue = this.createProxy(newValue);
          }
          target[prop] = newValue;
          return true;
        },
      });
    } else {
      return new Proxy(value, {
        get: (target, prop) => {
          //console.log('get prim', target, prop);
          if (prop === 'expand') {
            return () => {
              console.log('expand proxy: ', target, prop);
              target[prop] = { '@value': target[prop] };
            };
          }
          return target[prop];
        },
        set: (target, prop, newValue) => {
          //console.log('set prim', target, prop);
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

  expand(property) {
    if (typeof property !== 'object' || property === null) {
      throw new Error('Cannot expand a primitive');
    }

    if (!property.isExpanded()) {
      let value = { ...property };
      Object.keys(property).forEach((key) => delete property[key]);
      property['@value'] = value;
    }
  }

  expand(target, propertyName) {
    if (!propertyName && typeof target !== 'object') {
      throw new Error('Cannot expand a primitive without a propertyName');
    }

    if (typeof target[propertyName] === 'object') {
      target = target[propertyName];
    }

    let value = propertyName ? target[propertyName] : { ...target };
    if (!value.isExpanded()) {
      if (propertyName) {
        target[propertyName] = { '@value': value };
      } else {
        Object.keys(target).forEach((key) => delete target[key]);
        target['@value'] = value;
      }
    }
  }

  isExpanded(property) {
    return property['@value'] !== undefined;
  }

  addType(target, type, propertyName) {
    this.expand(target, propertyName);
    target = target[propertyName];
    target['@type'] = type;
  }

  addType(property, type) {
    if (propertyName) {
      this.expand(property, propertyName);
      property = property[propertyName];
    }
    this.expand(property);
    property['@type'] = type;
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
jsonld.data.map.expand();

console.log(jsonld.data);

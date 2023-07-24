import ontologies from './ontologies.json' assert { type: 'json' };
import { YjsStore } from '../y/YjsStore.mjs';
import syncedStore, {
  SyncedMap,
  getYjsValue,
  Y,
  getYjsDoc,
} from '@syncedstore/core';
import { SyncedJsonLD } from '../y/SyncedJsonLD.mjs';
import { JsonLD } from '../LD/JsonLd.mjs';

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

console.log('1---------------------');

//let jsonld = YjsJsonLD.fromYStorefromYStore(yjs.store, 'https://example.com/blog-post-1' );

let jsonld = SyncedJsonLD.fromJson(data, 'https://example.com/blog-post-1');

//jsonld.data.map.number.expand();
//jsonld.data.map.number.addType('crdt:Counter');

//console.log(jsonld.data.map);

//jsonld.expand(jsonld.data.map);
console.log('2---------------------');
console.log(jsonld.map);

jsonld.addTypeFromPath('map', 'crdt:Map');

console.log(getYjsValue(jsonld.map) instanceof Y.Map);
console.log(getYjsValue(jsonld.map).toJSON());

console.log('3---------------------');
jsonld.addTypeFromPath('map.number', 'crdt:Counter');
console.log('4---------------------');
JsonLD.log(jsonld.map);
JsonLD.log(jsonld.map.number);
JsonLD.log(jsonld.map.number['@value']);
JsonLD.log(jsonld.map.number['@type']);

jsonld.map.number['@value'] = 13;
JsonLD.log(jsonld.map.number['@value']);

jsonld.addType(jsonld, 'crdt:Text', 'body');
JsonLD.log(jsonld.body['@value']);
JsonLD.log(jsonld.body['@type']);
console.log('5---------------------');
console.log(jsonld['@context'].crdt);

console.log('6---------------------');
console.log('crdt' in jsonld.root['@context']);

//console.log(jsonld.data.map.number);

//jsonld.data.map.addType('crdt:Counter', 'number');

//console.log(jsonld.data.map.number);

//console.log(yjs.rootDoc.toJSON());

console.log('7---------------------');

console.log(jsonld.doc.toJSON());
console.log(jsonld.rootMap instanceof Y.Map);
console.log(getYjsValue(jsonld.map) instanceof Y.Map);
console.log(jsonld.toJsonLd());

console.log('8---------------------');
console.log(getYjsDoc(jsonld.store) instanceof Y.Doc);

console.log(getYjsValue(jsonld.map).toJSON());
console.log(jsonld.doc.toJSON());
//console.log(getYjsValue(yjs.rootStore.jsonld.map).toJSON());
console.log('9---------------------');

let handler = {
  get: function (target, prop, receiver) {
    if (
      !Object.hasOwn(target, prop) &&
      Object.hasOwn(target, '@' + String(prop))
    ) {
      console.log('[proxy]', target, prop);
      prop = '@' + String(prop);
    }
    const property = target[prop];

    return typeof property === 'object' && property !== null
      ? createProxy(property)
      : property;
  },
  set: function (target, prop, value, receiver) {
    console.log('SET: ', prop, value);
    return Reflect.set(...arguments);
  },
  forEach: function (target, callback, thisArg) {
    // Implement a custom forEach method for Yjs Map object
    target.forEach((item, key, map) => {
      callback.call(thisArg, item, key, map);
    });
  },
};

let store = syncedStore({ data: {} });

store.data.map = { number: 12, val: 'value' };
store.data.text = 'text';

store.data.map = { '@value': { ...store.data.map } };

function createProxy(target) {
  return new Proxy(target, handler);
}

let proxy = createProxy(store.data);

console.log(getYjsValue(store.data.map['@value']) instanceof Y.Map);
console.log(getYjsValue(store.data.map['@value']).toJSON());

console.log(getYjsValue(proxy.map.value) instanceof Y.Map);
//console.log(getYjsValue(proxy.map.value).toJSON());

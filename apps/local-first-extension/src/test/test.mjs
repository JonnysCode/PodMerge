import ontologies from './ontologies.json' assert { type: 'json' };
import { YjsStore } from '../y/YjsStore.mjs';
import { SyncedMap, getYjsValue, Y, getYjsDoc } from '@syncedstore/core';
import { YjsJsonLD } from '../y/YjsJsonLD.mjs';

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

let jsonld = YjsJsonLD.fromJson(data, 'https://example.com/blog-post-1');

//jsonld.data.map.number.expand();
//jsonld.data.map.number.addType('crdt:Counter');

//console.log(jsonld.data.map);

//jsonld.expand(jsonld.data.map);
console.log('2---------------------');
console.log(jsonld.map);

jsonld.addTypeFromPath('map', 'crdt:Map');

console.log(jsonld.map);

console.log('3---------------------');
jsonld.addTypeFromPath('map.value.number', 'crdt:Counter');
console.log('4---------------------');
console.log(jsonld.map);
console.log(jsonld.map.number);
console.log(jsonld.map.value.number.value);
console.log(jsonld.map.value.number.type);

jsonld.map.value.number.value = 13;
console.log(jsonld.map.value.number.value);

jsonld.addType(jsonld, 'crdt:Text', 'body');
console.log(jsonld.body.value);
console.log(jsonld.body.type);
console.log('5---------------------');
console.log(jsonld.data[jsonld.rootProperty]['@context'].crdt);

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
/*
const store = yjs.store;

const num = yjs.rootStore.jsonld.map['@value'].number;

console.log(getYjsValue(num) instanceof Y.Map);

console.log(getYjsValue(store).toJSON());
console.log(getYjsValue(yjs.rootStore.jsonld.map).toJSON());
*/

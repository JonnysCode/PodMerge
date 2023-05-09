import * as Automerge from '@automerge/automerge';

let data = {
  key1: 'value1',
  cards: [{ title: 'Rewrite everything in Clojure', done: false }],
  count: 0,
};

const automergeDoc = Automerge.from(data);

automergeDoc = Automerge.change(automergeDoc, 'Add card', (doc) => {
  doc.cards.push({ title: 'Rewrite everything in Clojure', done: false });
});

console.log(automergeDoc.cards);

export default automergeDoc;

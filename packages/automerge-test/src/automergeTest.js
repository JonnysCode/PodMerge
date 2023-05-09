import * as Automerge from '@automerge/automerge';

export function automergeTest() {
  console.log('----Automerge Map----');
  // small document
  let doc1 = Automerge.init();
  doc1 = Automerge.change(doc1, 'Make a list', (doc) => {
    doc.tasks = ['Write chapter', 'Revise chapter'];
  });
  doc1 = Automerge.change(doc1, 'Complete first task', (doc) => {
    doc.tasks[0] = 'Write introduction';
  });
  console.log('Small Automerge document:');
  console.log('Binary size:', Automerge.save(doc1).length);
  console.time('Small Automerge document to JSON');
  console.log('JSON size:', JSON.stringify(doc1).length);
  console.timeEnd('Small Automerge document to JSON');

  // mid sized document
  let doc2 = Automerge.init();
  doc2 = Automerge.change(doc2, 'Create project', (doc) => {
    doc.projectName = 'My Project';
    doc.tasks = [];
    for (let i = 0; i < 1000; i++) {
      doc.tasks.push({ name: `Task ${i}`, done: false });
    }
  });
  doc2 = Automerge.change(doc2, 'Complete first task', (doc) => {
    doc.tasks[0].done = true;
  });
  console.log('Mid sized Automerge document:');
  console.log('Binary size:', Automerge.save(doc2).length);
  console.time('Mid sized Automerge document to JSON');
  console.log('JSON size:', JSON.stringify(doc2).length);
  console.timeEnd('Mid sized Automerge document to JSON');

  // large document
  let doc3 = Automerge.init();
  doc3 = Automerge.change(doc3, 'Create large project', (doc) => {
    doc.projectName = 'My Large Project';
    doc.tasks = [];
    for (let i = 0; i < 10000; i++) {
      doc.tasks.push({ name: `Task ${i}`, done: false });
    }
  });
  for (let i = 0; i < 10000; i++) {
    doc3 = Automerge.change(doc3, 'Complete task', (doc) => {
      doc.tasks[i].done = true;
    });
  }
  console.log('Large Automerge document:');
  console.log('Binary size:', Automerge.save(doc3).length);
  console.time('Large Automerge document to JSON');
  console.log('JSON size:', JSON.stringify(doc3).length);
  console.timeEnd('Large Automerge document to JSON');
}

export function automergeTestText() {
  console.log('----Automerge Text----');
  // create a small Automerge document with few updates
  let smallDoc = Automerge.init();
  smallDoc = Automerge.change(smallDoc, (doc) => {
    doc.text = new Automerge.Text();
  });
  for (let i = 0; i < 100; i++) {
    const randomChar = String.fromCharCode(
      Math.floor(Math.random() * 52) + 65 + (Math.random() < 0.5 ? 6 : 0)
    );
    smallDoc = Automerge.change(smallDoc, (doc) => {
      doc.text.insertAt(0, randomChar);
    });
  }

  console.log(
    `Small Automerge doc state size: ${Automerge.save(smallDoc).length} bytes`
  );
  console.time('Small Automerge doc to JSON');
  let smallDocJSON = JSON.stringify(smallDoc);
  console.timeEnd('Small Automerge doc to JSON');
  console.log(`Small Automerge doc JSON size: ${smallDocJSON.length} bytes`);

  // create a medium Automerge document with some updates
  let mediumDoc = Automerge.init();
  mediumDoc = Automerge.change(mediumDoc, (doc) => {
    doc.text = new Automerge.Text();
  });
  for (let i = 0; i < 10000; i++) {
    const randomChar = String.fromCharCode(
      Math.floor(Math.random() * 52) + 65 + (Math.random() < 0.5 ? 6 : 0)
    );
    mediumDoc = Automerge.change(mediumDoc, (doc) => {
      doc.text.insertAt(0, randomChar);
    });
  }

  console.log(
    `Medium Automerge doc state size: ${Automerge.save(mediumDoc).length} bytes`
  );
  console.time('Medium Automerge doc to JSON');
  let mediumDocJSON = JSON.stringify(mediumDoc);
  console.timeEnd('Medium Automerge doc to JSON');
  console.log(`Medium Automerge doc JSON size: ${mediumDocJSON.length} bytes`);

  // create a large Automerge document with many updates
  let largeDoc = Automerge.init();
  largeDoc = Automerge.change(largeDoc, (doc) => {
    doc.text = new Automerge.Text();
  });
  for (let i = 0; i < 1000000; i++) {
    const randomChar = String.fromCharCode(
      Math.floor(Math.random() * 52) + 65 + (Math.random() < 0.5 ? 6 : 0)
    );
    largeDoc = Automerge.change(largeDoc, (doc) => {
      doc.text.insertAt(0, randomChar);
    });
  }

  console.log(
    `Large Automerge doc state size: ${Automerge.save(largeDoc).length} bytes`
  );
  console.time('Large Automerge doc to JSON');
  let largeDocJSON = JSON.stringify(largeDoc);
  console.timeEnd('Large Automerge doc to JSON');
  console.log(`Large Automerge doc JSON size: ${largeDocJSON.length} bytes`);
}

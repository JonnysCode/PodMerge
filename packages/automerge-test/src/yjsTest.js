import * as Y from 'yjs';

export const yjsTest = () => {
  console.log('----Yjs Text----');

  // create a small Yjs document with few updates
  let ydocSmall = new Y.Doc();
  let smallText = ydocSmall.getText('smallText');
  for (let i = 0; i < 100; i++) {
    const randomChar = String.fromCharCode(
      Math.floor(Math.random() * 52) + 65 + (Math.random() < 0.5 ? 6 : 0)
    );
    smallText.insert(0, randomChar);
  }

  // create a medium Yjs document with some updates
  let ydocMedium = new Y.Doc();
  let mediumText = ydocMedium.getText('mediumText');
  for (let i = 0; i < 10000; i++) {
    const randomChar = String.fromCharCode(
      Math.floor(Math.random() * 52) + 65 + (Math.random() < 0.5 ? 6 : 0)
    );
    mediumText.insert(0, randomChar);
  }

  // create a large Yjs document with many updates
  let ydocLarge = new Y.Doc();
  let largeText = ydocLarge.getText('largeText');
  for (let i = 0; i < 1000000; i++) {
    const randomChar = String.fromCharCode(
      Math.floor(Math.random() * 52) + 65 + (Math.random() < 0.5 ? 6 : 0)
    );
    largeText.insert(0, randomChar);
  }

  // measure the size of the binary document state
  console.log(
    `Small Yjs doc state size: ${
      Y.encodeStateAsUpdate(ydocSmall).byteLength
    } bytes`
  );
  console.log(
    `Medium Yjs doc state size: ${
      Y.encodeStateAsUpdate(ydocMedium).byteLength
    } bytes`
  );
  console.log(
    `Large Yjs doc state size: ${
      Y.encodeStateAsUpdate(ydocLarge).byteLength
    } bytes`
  );

  // measure the time it takes to create the JSON representation of the Yjs document
  console.time('Small Yjs doc to JSON');
  let smallDocJSON = ydocSmall.toJSON();
  console.timeEnd('Small Yjs doc to JSON');

  console.time('Medium Yjs doc to JSON');
  let mediumDocJSON = ydocMedium.toJSON();
  console.timeEnd('Medium Yjs doc to JSON');

  console.time('Large Yjs doc to JSON');
  let largeDocJSON = ydocLarge.toJSON();
  console.timeEnd('Large Yjs doc to JSON');

  // measure the size of the JSON representation
  console.log(smallDocJSON);
  console.log(
    `Small Yjs doc JSON size: ${JSON.stringify(smallDocJSON).length} bytes`
  );
  console.log(
    `Medium Yjs doc JSON size: ${JSON.stringify(mediumDocJSON).length} bytes`
  );
  console.log(
    `Large Yjs doc JSON size: ${JSON.stringify(largeDocJSON).length} bytes`
  );
};

export function yjsTestMap() {
  console.log('----Yjs Map----');

  // create a small Yjs document with few updates
  let ydocSmall = new Y.Doc();
  let smallArray = ydocSmall.getArray('smallArray');
  smallArray.insert(0, ['Write chapter', 'Revise chapter']);
  smallArray.insert(0, ['Write introduction']);

  // create a medium Yjs document with some updates
  let ydocMedium = new Y.Doc();
  let mediumArray = ydocMedium.getArray('mediumArray');
  for (let i = 0; i < 1000; i++) {
    mediumArray.push([{ name: `Task ${i}`, done: false }]);
  }

  // create a large Yjs document with many updates
  let ydocLarge = new Y.Doc();
  let largeArray = ydocLarge.getArray('largeArray');
  for (let i = 0; i < 10000; i++) {
    largeArray.push([{ name: `Task ${i}`, done: false }]);
  }

  // measure the size of the binary document state
  console.log(
    `Small Yjs doc state size: ${
      Y.encodeStateAsUpdate(ydocSmall).byteLength
    } bytes`
  );
  console.log(
    `Medium Yjs doc state size: ${
      Y.encodeStateAsUpdate(ydocMedium).byteLength
    } bytes`
  );
  console.log(
    `Large Yjs doc state size: ${
      Y.encodeStateAsUpdate(ydocLarge).byteLength
    } bytes`
  );

  // measure the time it takes to create the JSON representation of the Yjs document
  console.time('Small Yjs doc to JSON');
  let smallDocJSON = JSON.stringify(ydocSmall.toJSON());
  console.timeEnd('Small Yjs doc to JSON');

  console.time('Medium Yjs doc to JSON');
  let mediumDocJSON = JSON.stringify(ydocMedium.toJSON());
  console.timeEnd('Medium Yjs doc to JSON');

  console.time('Large Yjs doc to JSON');
  let largeDocJSON = JSON.stringify(ydocLarge.toJSON());
  console.timeEnd('Large Yjs doc to JSON');

  // measure the size of the JSON representation
  console.log(smallDocJSON);
  console.log(`Small Yjs doc JSON size: ${smallDocJSON.length} bytes`);
  console.log(`Medium Yjs doc JSON size: ${mediumDocJSON.length} bytes`);
  console.log(`Large Yjs doc JSON size: ${largeDocJSON.length} bytes`);
}

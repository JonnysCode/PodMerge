import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { yjsTest, yjsTestMap } from './yjsTest';
import { automergeTest, automergeTestText } from './automergeTest';

let data = {
  key1: 'value1',
  cards: [{ title: 'Rewrite everything in Clojure', done: false }],
  count: 0,
};

function App() {
  return (
    <>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button onClick={() => yjsTestMap()}>Test Map Yjs</button>
        <button onClick={() => yjsTest()}>Test Text Yjs</button>
        <button onClick={() => automergeTest()}>Test Map Automerge</button>
        <button onClick={() => automergeTestText()}>Test Text Automerge</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

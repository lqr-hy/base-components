import React, { useState } from 'react';
import './App.css';
import { Upload } from '@xb-onepiece/components';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Upload />
    </>
  );
}

export default App;

import React from 'react';
import './App.css';
import Header from './Header';
import TreeVisualization from './TreeVisualization';

function App() {
  return (
    <div className="App">
      <Header title="Chordia 0.0" />
      <TreeVisualization />
    </div>
  );
}

export default App;

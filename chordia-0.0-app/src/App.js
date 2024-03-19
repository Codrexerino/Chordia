// App.js or your specific component file
import React from 'react';
import { Tree } from 'react-d3-tree';

function MyTreeComponent() {
  // Create your tree data structure
  const treeData = {
    name: 'Parent',
    children: [
      { name: 'Child One' },
      {
        name: 'Child Two',
        children: [{ name: 'Grandchild' }]
      }
    ]
  };

  return (
    <div id="treeWrapper" style={{width: '50em', height: '20em'}}>
      <Tree data={treeData} />
    </div>
  );
}

export default MyTreeComponent;

import React from 'react';

function Header(props) {
  return (
    <header>
      <h1>{props.title}</h1>
      {props.selectedNode && <p>Selected Node: {props.selectedNode}</p>}
    </header>
  );
}

export default Header;

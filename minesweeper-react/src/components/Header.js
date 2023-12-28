import React from 'react';

function Header({ time, flags }) {
  return (
    <header>
      <h1>Minesweeper</h1>
      <div>
        <h2 className="info1">Time: <span id="time">{time}</span></h2>
        <h2 className="info2">Flags: <span id="flags">{flags}</span></h2>
      </div>
    </header>
  );
}

export default Header;

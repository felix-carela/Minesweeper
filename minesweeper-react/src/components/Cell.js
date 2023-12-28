import React from 'react';

function Cell({ isBomb, isRevealed, isFlagged, onClick, onContextMenu }) {
  // Determine the cell's appearance based on its state

  return (
    <td
      className={`cell ${isRevealed ? 'revealed' : ''} ${isFlagged ? 'flag' : ''}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {/* Content based on cell state (flag, bomb, number) */}
    </td>
  );
}

export default Cell;

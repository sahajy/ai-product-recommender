import React from 'react';
import './BrowsingHistory.css';

function BrowsingHistory({ items, onRemove }) {
  return (
    <div className="browsing-history">
      <h2>Browsing History</h2>
      {items.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.name}
              <button onClick={() => onRemove(index)}>×</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Click products to add them to your history</p>
      )}
    </div>
  );
}

export default BrowsingHistory;
import React from 'react';
import './Recommendations.css';

function Recommendations({ recommendations }) {
  return (
    <div className="recommendations">
      <h2>Recommended For You</h2>
      {recommendations.length > 0 ? (
        <div className="recommendation-list">
          {recommendations.map((rec, index) => (
            <div key={index} className="recommendation-item">
              <h3>{rec.name}</h3>
              <p className="reason">{rec.reason}</p>
              <p className="price">${rec.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Submit your preferences to get personalized recommendations</p>
      )}
    </div>
  );
}

export default Recommendations;
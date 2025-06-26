import React, { useState } from 'react';
import './UserPreferences.css';

const categories = ['Electronics', 'Clothing', 'Home', 'Beauty', 'Sports'];
const styles = ['Modern', 'Minimalist', 'Classic', 'Vintage'];

function UserPreferences({ onSubmit }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [selectedStyles, setSelectedStyles] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      categories: selectedCategories,
      priceRange,
      styles: selectedStyles
    });
  };

  return (
    <div className="preferences-form">
      <h2>Your Preferences</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Categories:</label>
          <div className="checkbox-group">
            {categories.map(category => (
              <React.Fragment key={category}>
                <input
                  type="checkbox"
                  id={`cat-${category}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() => setSelectedCategories(prev =>
                    prev.includes(category)
                      ? prev.filter(c => c !== category)
                      : [...prev, category]
                  )}
                />
                <label htmlFor={`cat-${category}`}>{category}</label>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            />
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Styles:</label>
          <div className="checkbox-group">
            {styles.map(style => (
              <React.Fragment key={style}>
                <input
                  type="checkbox"
                  id={`style-${style}`}
                  checked={selectedStyles.includes(style)}
                  onChange={() => setSelectedStyles(prev =>
                    prev.includes(style)
                      ? prev.filter(s => s !== style)
                      : [...prev, style]
                  )}
                />
                <label htmlFor={`style-${style}`}>{style}</label>
              </React.Fragment>
            ))}
          </div>
        </div>

        <button type="submit">Get Recommendations</button>
      </form>
    </div>
  );
}

export default UserPreferences;
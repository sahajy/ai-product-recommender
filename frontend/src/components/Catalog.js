import React from 'react';
import './Catalog.css';

function Catalog({ products, onProductClick }) {
  return (
    <div className="catalog">
      <h2>Product Catalog</h2>
      <div className="product-grid">
        {products.map(product => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => onProductClick(product)}
          >
            <div className="product-image">
              <img 
                src={product.image || '/images/default-product.jpg'} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/images/default-product.jpg'
                }}
              />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">${product.price.toFixed(2)}</p>
              <p className="category">{product.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalog;
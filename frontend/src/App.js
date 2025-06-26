import React, { useState, useEffect } from 'react';
import { fetchProducts, getRecommendations } from './services/api';
import Catalog from './components/Catalog';
import UserPreferences from './components/UserPreferences';
import Recommendations from './components/Recommendations';
import BrowsingHistory from './components/BrowsingHistory';
import './styles/App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [browsingHistory, setBrowsingHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load products. Is the backend server running?');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleProductClick = (product) => {
    if (!browsingHistory.some(item => item.id === product.id)) {
      setBrowsingHistory(prev => [product, ...prev.slice(0, 4)]);
    }
  };

  const handleRemoveHistory = (index) => {
    setBrowsingHistory(prev => prev.filter((_, i) => i !== index));
  };

  const handlePreferenceSubmit = async (preferences) => {
    try {
      setLoading(true);
      const data = await getRecommendations({
        preferences,
        browsingHistory: browsingHistory.map(p => p.id)
      });
      setRecommendations(data.recommendations || []);
      setError(null);
    } catch (err) {
      console.error('Recommendation Error:', err);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Product Recommender</h1>
      </header>
      <div className="app-container">
        <div className="left-panel">
          <UserPreferences onSubmit={handlePreferenceSubmit} />
          <BrowsingHistory 
            items={browsingHistory} 
            onRemove={handleRemoveHistory}
          />
        </div>
        <div className="main-content">
          {error && <div className="error-message">{error}</div>}
          {loading ? (
            <div className="loading">Generating recommendations...</div>
          ) : (
            <>
              <Catalog 
                products={products} 
                onProductClick={handleProductClick} 
              />
              <Recommendations recommendations={recommendations} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
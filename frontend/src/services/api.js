const API_URL = process.env.REACT_APP_API_URL || "https://ai-product-recommender-f2t3.onrender.com";

export const fetchProducts = async () => {
  const response = await fetch('https://ai-product-recommender-f2t3.onrender.com/api/products');
  return response.json();
};

export const getRecommendations = async (data) => {
  const response = await fetch('https://ai-product-recommender-f2t3.onrender.com/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

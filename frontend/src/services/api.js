export const fetchProducts = async () => {
  const response = await fetch('http://localhost:5000/api/products');
  return response.json();
};

export const getRecommendations = async (data) => {
  const response = await fetch('http://localhost:5000/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};
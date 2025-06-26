from flask import Flask, request, jsonify
from services.llm_service import generate_recommendations
from services.product_service import get_all_products, get_products_by_ids
import json
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

@app.route('/api/products', methods=['GET'])
def products():
    products = get_all_products()
    return jsonify(products)

@app.route('/api/recommendations', methods=['POST'])
def recommendations():
    data = request.get_json()
    preferences = data.get('preferences', {})
    browsing_history = data.get('browsingHistory', [])
    
    # Get products from browsing history
    history_products = get_products_by_ids(browsing_history)
    
    # Get all products for LLM context
    all_products = get_all_products()
    
    # Generate recommendations
    recommendations = generate_recommendations(all_products, preferences, history_products)
    
    return jsonify(recommendations)

@app.route('/api/browsing-history', methods=['POST'])
def browsing_history():
    # In a real app, we would store this in a database
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True)
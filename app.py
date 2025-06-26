from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": "*",  # For development
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Load product data
with open('products.json') as f:
    products = json.load(f)

def _build_cors_preflight_response():
    response = jsonify({"status": "preflight"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    return response

@app.route('/')
def home():
    return "AI Product Recommender API is running", 200

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/api/recommendations', methods=['POST'])
def recommendations():
    try:
        data = request.get_json()
        preferences = data.get('preferences', {})
        browsing_history = data.get('browsingHistory', [])

        category_pref = preferences.get('category')
        price_range = preferences.get('priceRange', [0, float('inf')])
        styles = set(preferences.get('styles', []))

        scored_products = []

        for product in products:
            if product['id'] in browsing_history:
                continue  # Don't recommend already-viewed items

            score = 0

            # 1. Category match (50%)
            category_score = 1 if product['category'] == category_pref else 0
            score += 0.5 * category_score

            # 2. Browsing history similarity (30%)
            history_score = 0
            for history_id in browsing_history:
                history_item = next((p for p in products if p['id'] == history_id), None)
                if history_item and history_item['category'] == product['category']:
                    history_score += 1
            history_score = min(history_score / len(browsing_history), 1)
            score += 0.3 * history_score

            # 3. Popularity/rating (20%)
            rating_score = product.get('rating', 0) / 5  # Assuming rating is out of 5
            score += 0.2 * rating_score

            # 4. Randomness (10%)
            from random import random
            score += 0.1 * random()

            # Filter by price range
            if price_range[0] <= product['price'] <= price_range[1]:
                product['score'] = round(score, 4)
                scored_products.append(product)

        # Sort and select top 4
        top_recommendations = sorted(scored_products, key=lambda p: p['score'], reverse=True)[:4]

        # Logging for debugging
        print(f"Received preferences: {preferences}")
        print(f"Browsing history: {browsing_history}")
        for p in top_recommendations:
            print(f"{p['name']} -> Score: {p['score']}")

        return jsonify({
            "status": "success",
            "recommendations": top_recommendations
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
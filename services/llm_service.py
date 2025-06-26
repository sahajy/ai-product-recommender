import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

def generate_recommendations(products, preferences, history_products):
    TOGETHER_API_KEY = os.getenv('TOGETHER_API_KEY')
    if not TOGETHER_API_KEY:
        raise ValueError("Together API key not found in environment variables")
    
    # Prepare the prompt
    prompt = build_recommendation_prompt(products, preferences, history_products)
    
    # Call Together AI API
    headers = {
        "Authorization": f"Bearer {TOGETHER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
        "prompt": prompt,
        "max_tokens": 1000,
        "temperature": 0.7,
        "top_p": 0.9
    }
    
    try:
        response = requests.post(
            "https://api.together.xyz/v1/completions",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        
        # Parse the response
        result = response.json()
        recommendations = parse_recommendations(result['choices'][0]['text'])
        
        return {
            "recommendations": recommendations,
            "reasoning": result['choices'][0]['text']
        }
    except Exception as e:
        print(f"Error calling Together AI API: {str(e)}")
        return {"error": "Failed to generate recommendations"}

def build_recommendation_prompt(products, preferences, history_products):
    # Format the product data for the prompt
    product_data = "\n".join([
        f"ID: {p['id']}, Name: {p['name']}, Category: {p['category']}, "
        f"Price: ${p['price']}, Features: {', '.join(p['features'])}, "
        f"Tags: {', '.join(p['tags'])}"
        for p in products
    ])
    
    # Format the browsing history
    history_data = "\n".join([p['name'] for p in history_products]) if history_products else "None"
    
    return f"""
    You are an eCommerce product recommendation assistant. Your task is to analyze user preferences and browsing history to recommend relevant products from the catalog.
    
    User Preferences:
    - Categories: {preferences.get('categories', ['Any'])}
    - Price Range: ${preferences.get('priceRange', [0, 1000])[0]} - ${preferences.get('priceRange', [0, 1000])[1]}
    - Styles: {preferences.get('styles', ['Any'])}
    
    Browsing History:
    {history_data}
    
    Available Products:
    {product_data}
    
    Please recommend 3-5 products that best match the user's preferences and browsing history. For each recommendation, include:
    - Product ID
    - Product Name
    - Brief explanation of why it was recommended
    
    Format your response as a JSON array with the following structure for each recommendation:
    {{
        "productId": "product123",
        "name": "Product Name",
        "reason": "Explanation of why this product was recommended"
    }}
    """

def parse_recommendations(llm_output):
    try:
        # Extract JSON from the LLM output
        start = llm_output.find('[')
        end = llm_output.rfind(']') + 1
        json_str = llm_output[start:end]
        return json.loads(json_str)
    except Exception as e:
        print(f"Error parsing recommendations: {str(e)}")
        return []
import json
from pathlib import Path

def get_all_products():
    data_path = Path(__file__).parent.parent / 'data' / 'products.json'
    with open(data_path, 'r') as f:
        products = json.load(f)
    return products

def get_products_by_ids(product_ids):
    all_products = get_all_products()
    return [p for p in all_products if p['id'] in product_ids]
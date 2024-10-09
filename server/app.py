from werkzeug.security import check_password_hash
from flask import Flask, request, jsonify, make_response
from flask_migrate import Migrate
from flask_restful import Api, Resource
from datetime import datetime
from flask_cors import CORS
from urllib.parse import urlparse, parse_qs
import requests
from requests.auth import HTTPBasicAuth
import json

# Local imports
from models import db, User, Rental, Inventory, WishList, URL

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}})

db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)


@app.route('/')
def index():
    return '<h1>Project Server</h1>'


class UserResource(Resource):
    def get(self):
        users = User.query.all()
        user_list = [user.to_dict() for user in users]
        return user_list, 200

api.add_resource(UserResource, '/users')


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')

    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Invalid email or password'}), 401

    # Login successful
    return jsonify({'message': 'Login Successful!'}), 200


class RentalResource(Resource):
    def get(self):
        rentals = Rental.query.all()
        rental_list = [rental.to_dict() for rental in rentals]
        return rental_list, 200

api.add_resource(RentalResource, '/rentals')


class InventoryResource(Resource):
    def get(self):
        all_inventory = Inventory.query.all()
        inventory_list = [inventory.to_dict() for inventory in all_inventory]
        return inventory_list, 200

    def post(self):
        data = request.get_json()
        url_value = data.get('url')
        name = data.get('name')
        color = data.get('color')  # Get the color from the request
        size = data.get('size')
        quantity = data.get('quantity')

        if not url_value or not name or not color or size is None or quantity is None:
            return {"error": "URL, name, color, size, and quantity are required"}, 400

        # Create a new Inventory object
        new_inventory = Inventory(url=url_value, name=name, color=color, size=size, quantity=quantity)
        db.session.add(new_inventory)
        db.session.commit()

        return new_inventory.to_dict(), 201

api.add_resource(InventoryResource, '/inventory')


class URLResource(Resource):
    def options(self):
        return {}, 200  # Respond to the OPTIONS request with 200 OK

    def get(self):
        all_urls = URL.query.all()
        url_list = [url.to_dict() for url in all_urls]
        return url_list, 200

    def post(self):
        data = request.get_json()
        url_value = data.get('url')

        if not url_value:
            return {"error": "URL is required"}, 400

        # Parse the URL
        parsed_url = urlparse(url_value)
        path_parts = parsed_url.path.split('/')  # Split the path by '/'
        
        # Extract item_name and item_color from the URL
        try:
            item_name = path_parts[-1]  # The last part of the path
            query_params = parse_qs(parsed_url.query)  # Parse the query string
            item_color = query_params.get('color', [None])[0]  # Get color, default to None if not found

            if not item_name or not item_color:
                return {"error": "Both item_name and item_color must be provided in the URL."}, 400

        except Exception as e:
            return {"error": str(e)}, 400

        # Create a new URL object with extracted item_name and item_color
        new_url = URL(url=url_value, item_name=item_name, item_color=item_color)
        db.session.add(new_url)
        db.session.commit()

        return new_url.to_dict(), 201

api.add_resource(URLResource, '/urls')


@app.route('/scrape-inventory', methods=['POST'])
def scrape_inventory():
    data = request.get_json()
    product_url = data.get('url')
    
    if not product_url:
        return jsonify({"error": "Product URL is required"}), 400

    # Scraping inventory logic
    scrape_url = "https://api.webit.live/api/v1/realtime/web"
    payload = {
        "url": product_url,
        "render": False
    }

    # API credentials
    username = "account-nimble-pipeline-paige_nuuly_test"
    password = "2Kq1Y722Wp0V"

    response = requests.post(scrape_url, json=payload, auth=HTTPBasicAuth(username, password))

    if response.status_code == 200:
        data = response.json()
        html_content = data.get('html_content')

        if html_content:
            try:
                product_data = json.loads(html_content)

                product_name = product_data.get('displayName', 'No name found')
                choices = product_data.get('choices', [])

                for choice in choices:
                    size_groups = choice.get('sizeGroups', [])
                    for group in size_groups:
                        for sku in group.get('includedSkus', []):
                            size = sku.get('size', {}).get('displayName')
                            available_inventory = sku.get('availableInventory')
                            item_color = choice.get('color', {}).get('code')  # Get the color code

    
                            inventory_item = Inventory(
                                url=product_url,
                                name=product_name,
                                size=size,
                                quantity=available_inventory,
                                color=item_color  # Include color in the inventory item
                                )
                            db.session.add(inventory_item)

                db.session.commit()
                return jsonify({"message": "Inventory data saved successfully"}), 201
            
            except json.JSONDecodeError as e:
                return jsonify({"error": f"Error decoding JSON: {e}"}), 500

    return jsonify({"error": "Failed to retrieve data"}), response.status_code


if __name__ == '__main__':
    app.run(port=5000, debug=True)

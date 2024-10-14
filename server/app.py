from werkzeug.security import check_password_hash
from flask import Flask, request, jsonify, make_response, current_app
from flask_migrate import Migrate
from flask_restful import Api, Resource
from datetime import datetime
from flask_cors import CORS
from urllib.parse import urlparse, parse_qs
import requests
from requests.auth import HTTPBasicAuth
import json

# Local imports
from models import db, User, Inventory, URL, History

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
    def get(self, id=None):
        if id is None:
            # Get all users
            users = User.query.all()
            user_list = [user.to_dict() for user in users]
            return user_list, 200
        else:
            # Get user by ID
            user = User.query.get(id)
            if not user:
                return {'message': 'User not found'}, 404
            return user.to_dict(), 200

    def post(self):
        data = request.get_json()
        email = data.get('email')
        first_name = data.get('first_name')
        last_name = data.get('last_name')

        # Check if user already exists
        user = User.query.filter_by(email=email).first()
        if user:
            return {'message': 'Email already exists'}, 400

        # Create a new user
        user = User(email=email, first_name=first_name, last_name=last_name, created_at=datetime.now())
        db.session.add(user)
        db.session.commit()

        return user.to_dict(), 201
    
    def patch(self, id):
        # Check if user exists
        user = User.query.get(id)
        if not user:
            return {'message': 'User not found'}, 404

        data = request.get_json()
        if 'email' in data:
            user.email = data['email']
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']

        db.session.commit()
        return {'message': 'User updated successfully', 'user': user.to_dict()}, 200

    def delete(self, id):
        # Check if user exists
        user = User.query.get(id)
        if not user:
            return {'message': 'User not found'}, 404

        try:
            db.session.delete(user)
            db.session.commit()
        except Exception as e:
            # Log the exception if necessary
            return {'message': 'An error occurred while deleting the user.'}, 500

        return {'message': 'User deleted successfully'}, 200

api.add_resource(UserResource, '/users', '/users/<int:id>')

class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')

        # Check if user exists
        user = User.query.filter_by(email=email).first()
        if not user:
            return {'message': 'Invalid email or password'}, 401

        # Login successful
        return {'message': 'Login Successful!'}, 200

# Adding the resource to the API
api.add_resource(LoginResource, '/login')

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
        color = data.get('color')
        size = data.get('size')
        quantity = data.get('quantity')

        if not url_value or not name or not color or size is None or quantity is None:
            return {"error": "URL, name, color, size, and quantity are required"}, 400

        new_inventory = Inventory(url=url_value, name=name, color=color, size=size, quantity=quantity)
        db.session.add(new_inventory)
        db.session.commit()

        return new_inventory.to_dict(), 201

api.add_resource(InventoryResource, '/inventory')


class HistoryResource(Resource):
    def get(self):
        all_history = History.query.all()
        history_list = [history.to_dict() for history in all_history]
        return history_list, 200

# Add the resource to the API
api.add_resource(HistoryResource, '/history')

class URLResource(Resource):
    def options(self):
        return {}, 200  # Respond to the OPTIONS request with 200 OK

    def get(self):
        all_urls = URL.query.all()
        url_list = [url.to_dict() for url in all_urls]
        return url_list, 200

    def post(self):
        data = request.get_json()

        # Check if the data has required keys
        if not data or 'url' not in data or 'user_id' not in data:
            return {"error": "URL and user_id are required"}, 400

        url_value = data['url']
        user_id = data['user_id']

        # Validate URL
        if not url_value:
            return {"error": "URL is required"}, 400

        parsed_url = urlparse(url_value)
        path_parts = parsed_url.path.split('/')  # Split the path by '/'

        try:
            item_name = path_parts[-1]
            query_params = parse_qs(parsed_url.query)
            item_color = query_params.get('color', [None])[0]

            if not item_name or not item_color:
                return {"error": "Both item_name and item_color must be provided in the URL."}, 400

            # Assuming you have a User model to verify user_id
            user = User.query.get(user_id)
            if not user:
                return {"error": "User not found"}, 404

        except Exception as e:
            return {"error": str(e)}, 400

        new_url = URL(url=url_value, item_name=item_name, item_color=item_color, user_id=user_id)
        db.session.add(new_url)
        try:
            db.session.commit()
        except Exception as e:
            return {"error": str(e)}, 500

        return new_url.to_dict(), 201
    
    def delete(self, id): 
        url = URL.query.get(id)
        if url: 
            db.session.delete(url)
            db.session.commit()
            return {"message": "URL deleted successfully"}, 200
        else: 
            return {"message": "URL not found"}, 404

api.add_resource(URLResource, '/urls', '/urls/<int:id>')


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
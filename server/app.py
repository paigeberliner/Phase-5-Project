from werkzeug.security import check_password_hash

from flask import Flask, request, jsonify, make_response
from flask_migrate import Migrate
from flask_restful import Api, Resource
from datetime import datetime
from flask_cors import CORS
from urllib.parse import urlparse, parse_qs

# Local imports
from models import db, User, Rental, Inventory, WishList, URL

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False


CORS(app)

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
    #password = data.get('password')

    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Invalid email or password'}), 401

    # Login successful (replace with token generation or success message)
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

            # Check if extracted values are valid
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

if __name__ == '__main__':
    app.run(port=5000, debug=True)
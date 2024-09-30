from werkzeug.security import check_password_hash

from flask import Flask, request, jsonify, make_response
from flask_migrate import Migrate
from flask_restful import Api, Resource
from datetime import datetime
from flask_cors import CORS

# Local imports
from models import db, User, Rental, Inventory, WishList

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False


CORS(app, resources={r"/*": {"origins": ["http://localhost:3001"]}})

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
        renals = Rental.query.all()
        rental_list = [rental.to_dict() for rental in rentals]
        return rental_list, 200
    
    def post(self, request)

api.add_resource(RentalResource, '/rentals')

class InventoryResource(Resource):
    def get(self):
        all_inventory = Inventory.query.all()
        inventory_list = [inventory.to_dict() for inventory in all_inventory]
        return inventory_list, 200

api.add_resource(InventoryResource, '/inventory')




if __name__ == '__main__':
    app.run(port=5000, debug=True)
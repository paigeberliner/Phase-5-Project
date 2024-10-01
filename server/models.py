from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
db = SQLAlchemy()


# Models go here!

class User(db.Model): 
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'created_at': self.created_at.isoformat()
        }

class Rental(db.Model):
    __tablename__ = 'rentals'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False) 
    color = db.Column(db.String, nullable=False)
    size = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'color': self.color,
            'size': self.size
        }


class Inventory (db.Model): 
    __tablename__ = 'inventory'
    id = db.Column(db.Integer, primary_key=True)
    size = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'size': self.size,
            'quantity': self.quantity
        }
    
class URL (db.Model):
    __tablename__ = 'url'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String, nullable=False)
    item_name = db.Column(db.String, nullable=False)
    item_color = db.Column(db.String, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'item_name': self.item_name,
            'item_color': self.item_color
        }

class WishList(db.Model): 
    __tablename__ = 'wishlists'
    id = db.Column(db.Integer, primary_key=True)
    





from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
db = SQLAlchemy()
from sqlalchemy.orm import validates


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


    @validates('email')
    def validate_email(self, key, email):
        # Check if email is a non-empty string
        if not email or not isinstance(email, str):
            raise ValueError("Email must be a non-empty string")

        # Check if email contains '@'
        if '@' not in email:
            raise ValueError("Email must contain '@' sign")
    
        return email
    
    @validates('first_name')
    def validate_first_name(self, key, first_name):
        if not first_name or not isinstance(first_name, str):
            raise ValueError("First name must be a non-empty string")
        return first_name
    
    @validates('last_name')
    def validate_list_name(self, key, last_name):
        if not last_name or not isinstance(last_name, str):
            raise ValueError("Last name must be a non-empty string")x
        return last_name

class Inventory (db.Model): 
    __tablename__ = 'inventory'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    color = db.Column(db.String, nullable=False)
    size = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    

    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'name': self.name,
            'color': self.color,
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


    @validates('url')
    def validate_url(self, key, url):
        if '.com' not in url:
            raise ValueError("URL must contain '.com'")
        return url


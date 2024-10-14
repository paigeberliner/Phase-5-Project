from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.orm import validates

db = SQLAlchemy()

class User(db.Model): 
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    urls = db.relationship('URL', back_populates='user', cascade="all, delete-orphan")
    history = db.relationship('History', back_populates='user', cascade="all, delete-orphan")

    serialize_rules = ('-urls.user', '-history.user')

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
        if not email or not isinstance(email, str):
            raise ValueError("Email must be a non-empty string")
        if '@' not in email:
            raise ValueError("Email must contain '@' sign")
        return email
    
    @validates('first_name')
    def validate_first_name(self, key, first_name):
        if not first_name or not isinstance(first_name, str):
            raise ValueError("First name must be a non-empty string")
        return first_name
    
    @validates('last_name')
    def validate_last_name(self, key, last_name):
        if not last_name or not isinstance(last_name, str):
            raise ValueError("Last name must be a non-empty string")
        return last_name

class Inventory(db.Model): 
    __tablename__ = 'inventory'
    
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    color = db.Column(db.String, nullable=False)
    size = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    @validates('url')
    def validate_url(self, key, url):
        if not url or '.com' not in url:
            raise ValueError("URL must contain '.com' and cannot be empty")
        return url
    
    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'name': self.name,
            'color': self.color,
            'size': self.size,
            'quantity': self.quantity
        }

class URL(db.Model):
    __tablename__ = 'urls'
    
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String, nullable=False)
    item_name = db.Column(db.String, nullable=False)
    item_color = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', back_populates='urls')
    history = db.relationship('History', back_populates='url', cascade="all, delete-orphan")

    serialize_rules = ('-user.urls', '-history.url')

    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'item_name': self.item_name,
            'item_color': self.item_color, 
            'user_id': self.user_id,
            'user': f"{self.user.first_name} {self.user.last_name}" if self.user else None,
        }

    @validates('url')
    def validate_url(self, key, url):
        if not url or '.com' not in url:
            raise ValueError("URL must contain '.com' and cannot be empty")
        return url

class History(db.Model):
    __tablename__ = 'history'
    
    id = db.Column(db.Integer, primary_key=True)
    url_id = db.Column(db.Integer, db.ForeignKey('urls.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    url = db.relationship('URL', back_populates='history')
    user = db.relationship('User', back_populates='history')

    serialize_rules = ('-url.history', '-user.history')

    def to_dict(self):
        return {
            'id': self.id,
            'url_id': self.url_id,
            'user_id': self.user_id,
            'url': self.url.url if self.url else None, 
            'user': f"{self.user.first_name} {self.user.last_name}" if self.user else None,
    }

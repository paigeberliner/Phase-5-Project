#!/usr/bin/env python3

# Standard library imports
from datetime import datetime

# Local imports
from app import app
from models import db, User, URL

if __name__ == '__main__':
    with app.app_context():
        # Drop all tables
        db.drop_all()
        # Create all tables
        db.create_all()

        # Create example user
        user = User(email="paigeberliner@gmail.com", first_name="Paige", last_name="Berliner", created_at=datetime.now())
        db.session.add(user)
        db.session.commit()

        url = URL(url="https://www.nuuly.com/rent/products/relaxed-longline-overcoat?color=040", item_name="relaxed-longline-overcoat", item_color="040")
        db.session.add(url)
        db.session.commit()


   

        
            
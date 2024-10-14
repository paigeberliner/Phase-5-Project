#!/usr/bin/env python3

# Standard library imports
from datetime import datetime

# Local imports
from app import app
from models import db, User, URL, History 

if __name__ == '__main__':
    with app.app_context():
        # Drop all tables
        db.drop_all()
        # Create all tables
        db.create_all()

        # Create example user
        user1 = User(email="paigeberliner@gmail.com", first_name="Paige", last_name="Berliner", created_at=datetime.now())
        user2 = User(email="sallysmith@gmail.com", first_name="Sally", last_name="Smith", created_at=datetime.now())
        user3 = User(email="janefrank@gmail.com", first_name="Jane", last_name="Frank", created_at=datetime.now())
        db.session.add(user1)
        db.session.add(user2)
        db.session.add(user3)
        db.session.commit()

        url1 = URL(url="https://www.nuuly.com/rent/products/relaxed-longline-overcoat?color=040", item_name="relaxed-longline-overcoat", item_color="040", user_id=2)
        url2 = URL(url="https://www.nuuly.com/rent/products/seana-longline-coat?color=004", item_name="seana-longline-coat", item_color="004", user_id=3)
        db.session.add(url1)
        db.session.add(url2)
        db.session.commit()

        history1 = History(url_id="1", user_id=2)
        history2 = History(url_id="2", user_id=3)
        db.session.add(history1)
        db.session.add(history2)
        db.session.commit()


   

        
            
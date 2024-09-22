#!/usr/bin/env python3

# Standard library imports
from datetime import datetime

# Local imports
from app import app
from models import db, User, Rental, Inventory, WishList

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

        rental = Rental(name="Easy Street Tunic", color="Pine", size="S")
        db.session.add(rental)
        db.session.commit()

        inventory = Inventory(size="S", quantity=201)
        db.session.add(inventory)
        db.session.commit()

   

        
            
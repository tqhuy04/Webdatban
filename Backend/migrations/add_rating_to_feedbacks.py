"""
Migration script: Add Rating column to feedbacks table
Run this once to add the Rating column to your database.
"""
import os
import sys

# Add Backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from Backend.database import engine

def add_rating_column():
    with engine.connect() as conn:
        # Check if column exists
        result = conn.execute(text("DESCRIBE feedbacks"))
        columns = [row[0] for row in result]
        
        if 'Rating' in columns:
            print("Column 'Rating' already exists in feedbacks table. Nothing to do.")
            return
        
        # Add the column
        conn.execute(text("ALTER TABLE feedbacks ADD COLUMN Rating INT DEFAULT 5"))
        conn.commit()
        print("Successfully added 'Rating' column to feedbacks table!")

if __name__ == "__main__":
    add_rating_column()

"""
Migration script: Add AdminReply column to feedbacks table
Run this once to add the AdminReply column to your database.
"""
import os
import sys

# Add Backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from Backend.database import engine


def add_admin_reply_column():
    with engine.connect() as conn:
        result = conn.execute(text("DESCRIBE feedbacks"))
        columns = [row[0] for row in result]

        if "AdminReply" in columns:
            print("Column 'AdminReply' already exists in feedbacks table. Nothing to do.")
            return

        conn.execute(text("ALTER TABLE feedbacks ADD COLUMN AdminReply TEXT"))
        conn.commit()
        print("Successfully added 'AdminReply' column to feedbacks table!")


if __name__ == "__main__":
    add_admin_reply_column()

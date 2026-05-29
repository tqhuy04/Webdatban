"""
Migration: Allow nullable customer fields for walk-in bookings
"""
import sqlite3
import os

def upgrade():
    db_path = os.path.join(os.path.dirname(__file__), "..", "database.db")
    
    if not os.path.exists(db_path):
        print("Database not found, skipping migration")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Make account_id nullable
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS customers_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_id INTEGER,
                full_name VARCHAR(255) NOT NULL,
                phone_number VARCHAR(255),
                address VARCHAR(255)
            )
        """)
        
        # Copy data from old table
        cursor.execute("""
            INSERT INTO customers_new (id, account_id, full_name, phone_number, address)
            SELECT id, account_id, full_name, phone_number, address FROM customers
        """)
        
        # Drop old table and rename new one
        cursor.execute("DROP TABLE customers")
        cursor.execute("ALTER TABLE customers_new RENAME TO customers")
        
        # Recreate foreign key (SQLite doesn't support adding FK constraint directly)
        # We'll need to handle this in the app layer
        
        conn.commit()
        print("Migration completed: customers table updated")
        
    except Exception as e:
        conn.rollback()
        print(f"Migration failed: {e}")
        raise
    finally:
        conn.close()

def downgrade():
    """Revert changes - NOT RECOMMENDED as data may be lost"""
    print("Downgrade not implemented for safety")

if __name__ == "__main__":
    upgrade()

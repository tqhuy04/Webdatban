"""
Migration: Add CreatedAt column to table_bookings
Stores the timestamp when a booking was created (separate from BookingTime which
is the time the customer wants to arrive at the restaurant).
"""
import os
import sqlite3


def upgrade_sqlite():
    db_path = os.path.join(os.path.dirname(__file__), "..", "database.db")

    if not os.path.exists(db_path):
        print("Database not found, skipping migration")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        cursor.execute("PRAGMA table_info(table_bookings)")
        existing_columns = [row[1] for row in cursor.fetchall()]

        if "CreatedAt" not in existing_columns:
            cursor.execute(
                "ALTER TABLE table_bookings ADD COLUMN CreatedAt DATETIME"
            )
            # Backfill: nếu đã có booking thì dùng BookingTime làm mốc
            cursor.execute(
                "UPDATE table_bookings SET CreatedAt = BookingTime "
                "WHERE CreatedAt IS NULL"
            )
            print("Added CreatedAt column to table_bookings")
        else:
            print("CreatedAt column already exists, skipping")

        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Migration failed: {e}")
        raise
    finally:
        conn.close()


def upgrade_mysql():
    import pymysql

    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='130404',
        database='restaurant_booking',
        charset='utf8mb4'
    )

    try:
        with connection.cursor() as cursor:
            cursor.execute("DESCRIBE table_bookings")
            existing_columns = [col[0] for col in cursor.fetchall()]

            if "CreatedAt" not in existing_columns:
                cursor.execute(
                    "ALTER TABLE table_bookings ADD COLUMN CreatedAt DATETIME"
                )
                cursor.execute(
                    "UPDATE table_bookings SET CreatedAt = BookingTime "
                    "WHERE CreatedAt IS NULL"
                )
                print("Added CreatedAt column to table_bookings")
            else:
                print("CreatedAt column already exists, skipping")

        connection.commit()
    finally:
        connection.close()


def upgrade():
    # Thử MySQL trước (theo cấu hình project), fallback về SQLite
    try:
        upgrade_mysql()
    except Exception as e:
        print(f"MySQL migration skipped: {e}")
        upgrade_sqlite()


def downgrade():
    """Không hỗ trợ rollback vì có thể mất dữ liệu."""
    print("Downgrade not implemented for safety")


if __name__ == "__main__":
    upgrade()

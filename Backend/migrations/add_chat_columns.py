"""
Migration script: Thêm các cột bị thiếu vào bảng chat_messages
"""
import pymysql

DB_HOST = "localhost"
DB_PORT = 3306
DB_USER = "root"
DB_PASSWORD = "130404"
DB_NAME = "restaurant_booking"


def run_migration():
    connection = pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    
    try:
        with connection.cursor() as cursor:
            cursor.execute("DESCRIBE chat_messages")
            columns = [col[0] for col in cursor.fetchall()]
            print(f"Các cột hiện có: {columns}")
            
            new_columns = {
                'message': "ALTER TABLE chat_messages ADD COLUMN message TEXT NOT NULL",
                'receiver_type': "ALTER TABLE chat_messages ADD COLUMN receiver_type VARCHAR(20) NOT NULL DEFAULT 'ADMIN'",
                'receiver_id': "ALTER TABLE chat_messages ADD COLUMN receiver_id INT NOT NULL DEFAULT 0"
            }
            
            for col_name, sql in new_columns.items():
                if col_name not in columns:
                    print(f"Thêm cột {col_name}...")
                    cursor.execute(sql)
                    print(f"  ✓ Đã thêm {col_name}")
                else:
                    print(f"  - Cột {col_name} đã tồn tại")
            
            connection.commit()
            print("\n✓ Migration hoàn tất!")
            
    finally:
        connection.close()


if __name__ == "__main__":
    run_migration()

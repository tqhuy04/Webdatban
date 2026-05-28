"""
Migration: Add payment columns to table_bookings
"""
import pymysql

# Kết nối database
connection = pymysql.connect(
    host='localhost',
    user='root',
    password='130404',
    database='restaurant_booking',
    charset='utf8mb4'
)

try:
    with connection.cursor() as cursor:
        # Lấy danh sách cột hiện tại
        cursor.execute("DESCRIBE table_bookings")
        existing_columns = [col[0] for col in cursor.fetchall()]
        
        # Các cột cần thêm
        columns_to_add = {
            'DepositAmount': 'FLOAT DEFAULT 0',
            'DepositStatus': 'INT DEFAULT 0',
            'TotalAmount': 'FLOAT DEFAULT 0',
            'RemainingAmount': 'FLOAT DEFAULT 0',
            'PaymentStatus': 'INT DEFAULT 0',
            'People': 'INT DEFAULT 1'
        }
        
        for col_name, col_type in columns_to_add.items():
            if col_name not in existing_columns:
                sql = f"ALTER TABLE table_bookings ADD COLUMN {col_name} {col_type}"
                cursor.execute(sql)
                print(f"Thêm cột '{col_name}' thành công!")
            else:
                print(f"Cột '{col_name}' đã tồn tại, bỏ qua.")
        
        connection.commit()
        
        # Kiểm tra cấu trúc bảng
        cursor.execute("DESCRIBE table_bookings")
        columns = cursor.fetchall()
        print("\nCấu trúc bảng table_bookings:")
        for col in columns:
            print(f"  - {col[0]}: {col[1]}")
            
finally:
    connection.close()

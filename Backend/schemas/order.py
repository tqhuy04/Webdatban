from pydantic import BaseModel, field_validator, model_validator
from typing import Optional, List, Any
from datetime import datetime
from .order_detail import OrderDetailCreate, OrderDetailResponse


class OrderCreate(BaseModel):
    BookingID: int
    CustomerID: int
    PromotionID: Optional[int] = None
    OrderDate: datetime = None  # Optional, will use current time if not provided
    TotalAmount: float = 0
    Items: Optional[List[OrderDetailCreate]] = []

    @field_validator('BookingID', 'CustomerID')
    @classmethod
    def must_be_positive(cls, v):
        if v is None or v <= 0:
            raise ValueError(f'Must be a positive integer, got: {v}')
        return v

    @field_validator('OrderDate', mode='before')
    @classmethod
    def set_default_order_date(cls, v):
        if v is None:
            return datetime.now()
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "BookingID": 1,
                "CustomerID": 1,
                "OrderDate": "2026-05-25T12:00:00",
                "Items": []
            }
        }


class OrderUpdate(BaseModel):
    BookingID: int
    CustomerID: int
    PromotionID: Optional[int] = None
    OrderDate: datetime
    TotalAmount: float = 0


class OrderItemResponse(BaseModel):
    OrderDetailID: Optional[int] = None
    OrderID: Optional[int] = None
    MenuItemID: int
    Quantity: int
    Price: float
    menu_item: Optional[dict] = None

    class Config:
        from_attributes = True

    @field_validator('menu_item', mode='before')
    @classmethod
    def convert_menu_item(cls, v):
        if v is None:
            return None
        if hasattr(v, '__dict__'):
            return {
                'MenuItemID': getattr(v, 'MenuItemID', None),
                'Name': getattr(v, 'Name', None),
                'Price': getattr(v, 'Price', None),
                'Description': getattr(v, 'Description', None),
                'ImageURL': getattr(v, 'ImageURL', None),
            }
        return v


class OrderResponse(BaseModel):
    OrderID: int
    BookingID: int
    CustomerID: int
    PromotionID: Optional[int] = None
    OrderDate: datetime
    TotalAmount: float
    Items: Optional[List[dict]] = []
    promotion: Optional[dict] = None

    class Config:
        from_attributes = True

    @model_validator(mode='before')
    @classmethod
    def convert_from_orm(cls, data):
        if hasattr(data, '__dict__'):
            # Convert SQLAlchemy model to dict
            result = {}
            for key in ['OrderID', 'BookingID', 'CustomerID', 'PromotionID', 'OrderDate', 'TotalAmount']:
                result[key] = getattr(data, key, None)

            # Convert Items relationship
            items = getattr(data, 'Items', None)
            if items:
                converted_items = []
                for item in items:
                    item_dict = {
                        'OrderDetailID': getattr(item, 'OrderDetailID', None),
                        'OrderID': getattr(item, 'OrderID', None),
                        'MenuItemID': getattr(item, 'MenuItemID', None),
                        'Quantity': getattr(item, 'Quantity', None),
                        'Price': getattr(item, 'Price', None),
                    }
                    menu_item = getattr(item, 'menu_item', None)
                    if menu_item and hasattr(menu_item, '__dict__'):
                        item_dict['menu_item'] = {
                            'MenuItemID': getattr(menu_item, 'MenuItemID', None),
                            'Name': getattr(menu_item, 'Name', None),
                            'Price': getattr(menu_item, 'Price', None),
                            'Description': getattr(menu_item, 'Description', None),
                            'ImageURL': getattr(menu_item, 'ImageURL', None),
                        }
                    converted_items.append(item_dict)
                result['Items'] = converted_items
            else:
                result['Items'] = []

            # Convert promotion relationship
            promotion = getattr(data, 'promotion', None)
            if promotion and hasattr(promotion, '__dict__'):
                result['promotion'] = {
                    'PromotionID': getattr(promotion, 'PromotionID', None),
                    'PromotionName': getattr(promotion, 'PromotionName', None),
                    'DiscountPercent': getattr(promotion, 'DiscountPercent', None),
                    'DiscountAmount': getattr(promotion, 'DiscountAmount', None),
                    'IsActive': getattr(promotion, 'IsActive', None),
                }
            else:
                result['promotion'] = None

            return result
        return data

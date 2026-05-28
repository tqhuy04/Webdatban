from pydantic import BaseModel, field_validator
from typing import Optional, List, Any
from datetime import datetime
from .order_detail import OrderDetailCreate, OrderDetailResponse

class OrderCreate(BaseModel):
    BookingID: int
    CustomerID: int
    PromotionID: Optional[int] = None
    OrderDate: datetime
    Items: Optional[List[OrderDetailCreate]] = []

    @field_validator('BookingID', 'CustomerID')
    @classmethod
    def must_be_positive(cls, v):
        if v is None or v <= 0:
            raise ValueError(f'Must be a positive integer, got: {v}')
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



class OrderResponse(BaseModel):
    OrderID: int
    BookingID: int
    CustomerID: int
    PromotionID: Optional[int]
    OrderDate: datetime
    TotalAmount: float
    Items: Optional[List[dict]] = []
    promotion: Optional[dict] = None

    class Config:
        from_attributes = True

    @field_validator('promotion', mode='before')
    @classmethod
    def convert_promotion_to_dict(cls, v):
        if v is None:
            return None
        if hasattr(v, '__dict__'):
            return {
                'PromotionID': v.PromotionID,
                'PromotionName': getattr(v, 'PromotionName', None),
                'DiscountPercent': getattr(v, 'DiscountPercent', None),
                'DiscountAmount': getattr(v, 'DiscountAmount', None),
                'StartDate': str(v.StartDate) if hasattr(v, 'StartDate') and v.StartDate else None,
                'EndDate': str(v.EndDate) if hasattr(v, 'EndDate') and v.EndDate else None,
                'IsActive': getattr(v, 'IsActive', None),
            }
        return v

    @field_validator('Items', mode='before')
    @classmethod
    def convert_items_to_list(cls, v):
        if v is None:
            return []
        if hasattr(v, '__iter__'):
            result = []
            for item in v:
                if hasattr(item, '__dict__'):
                    item_dict = {
                        'OrderDetailID': getattr(item, 'OrderDetailID', None),
                        'OrderID': getattr(item, 'OrderID', None),
                        'MenuItemID': getattr(item, 'MenuItemID', None),
                        'Quantity': getattr(item, 'Quantity', None),
                        'Price': getattr(item, 'Price', None),
                    }
                    # Convert menu_item relationship if exists
                    menu_item = getattr(item, 'menu_item', None)
                    if menu_item and hasattr(menu_item, '__dict__'):
                        item_dict['menu_item'] = {
                            'MenuItemID': menu_item.MenuItemID,
                            'Name': getattr(menu_item, 'Name', None),
                            'Price': getattr(menu_item, 'Price', None),
                            'Description': getattr(menu_item, 'Description', None),
                            'ImageURL': getattr(menu_item, 'ImageURL', None),
                        }
                    result.append(item_dict)
                else:
                    result.append(item)
            return result
        return v

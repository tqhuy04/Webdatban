from pydantic import BaseModel

class StatisticalOverview(BaseModel):
    total_orders: int
    total_tables: int
    total_customers: int

class OrderChart(BaseModel):
    date: str
    total: int

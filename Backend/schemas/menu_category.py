from pydantic import BaseModel, ConfigDict

class MenuCategoryBase(BaseModel):
    CategoryName: str


class MenuCategoryCreate(MenuCategoryBase):
    pass


class MenuCategoryUpdate(BaseModel):
    CategoryName: str | None = None


class MenuCategoryOut(MenuCategoryBase):
    CategoryID: int
class MenuCategoryResponse(MenuCategoryBase):
    CategoryID: int
model_config = ConfigDict(from_attributes=True)

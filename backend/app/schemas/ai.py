from pydantic import BaseModel, Field
from typing import List, Optional
from app.schemas.product import ProductRead

class StylistRequest(BaseModel):
    gender: str = Field(..., example="female")
    age_group: Optional[str] = Field(None, example="adult")
    occasion: str = Field(..., example="Wedding")
    budget_min: Optional[float] = Field(0, ge=0)
    budget_max: Optional[float] = Field(None, ge=0)
    colors: Optional[List[str]] = Field(default_factory=list)
    body_type: Optional[str] = None
    size_preference: Optional[str] = None

class StylistRecommendation(BaseModel):
    product: ProductRead
    reason: str = Field(..., description="Why this product suits the user's request")

class StylistResponse(BaseModel):
    message: str = Field(..., description="Personalized greeting or advice from the AI")
    recommendations: List[StylistRecommendation]

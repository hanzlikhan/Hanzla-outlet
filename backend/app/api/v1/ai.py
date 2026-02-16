from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.ai import StylistRequest, StylistResponse
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/stylist", response_model=StylistResponse)
async def get_ai_recommendations(
    request: StylistRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Get personalized fashion recommendations from Hanzla AI Stylist.
    """
    return await ai_service.get_stylist_recommendations(db, request)

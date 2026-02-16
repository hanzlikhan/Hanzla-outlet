import json
from typing import List, Optional
import google.generativeai as genai
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.config import settings
from app.models.product import Product
from app.schemas.ai import StylistRequest, StylistRecommendation, StylistResponse

class AIService:
    def __init__(self):
        if settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    async def get_stylist_recommendations(
        self, 
        db: AsyncSession, 
        request: StylistRequest
    ) -> StylistResponse:
        try:
            # 1. Smart Filtering in DB
            # We filter by gender and partially by occasion keywords to reduce noise
            conditions = [Product.is_active == True]
            
            # Simple gender filtering
            if request.gender.lower() == "male":
                conditions.append(Product.name.ilike("%men%") | Product.description.ilike("%men%"))
            elif request.gender.lower() == "female":
                conditions.append(Product.name.ilike("%women%") | Product.description.ilike("%women%") | Product.name.ilike("%lady%") | Product.name.ilike("%girl%"))
            
            # Budget filtering
            if request.budget_max:
                conditions.append(Product.price <= request.budget_max)
            if request.budget_min:
                conditions.append(Product.price >= request.budget_min)

            query = select(Product).where(*conditions).options(selectinload(Product.category)).limit(40)
            result = await db.execute(query)
            products = result.scalars().all()
            
            # If no products found with strict filters, fallback to a broader search
            if not products:
                query = select(Product).where(Product.is_active == True).options(selectinload(Product.category)).limit(20)
                result = await db.execute(query)
                products = result.scalars().all()

        except Exception as e:
            print(f"Database Error in AI Service: {e}")
            return StylistResponse(
                message="I'm having a little trouble connecting to my fashion database. Please try again in a moment!",
                recommendations=[]
            )

        if not self.model:
            # Fallback if no API key
            return StylistResponse(
                message="I'm currently in offline mode (API key missing), but here are some popular items for you!",
                recommendations=[
                    StylistRecommendation(product=p, reason="A popular choice in our store.")
                    for p in products[:4]
                ]
            )

        # 2. Prepare product context for AI
        product_list = [
            {
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "price": float(p.price),
                "category": p.category.name if p.category else "Uncategorized"
            }
            for p in products
        ]

        # 3. Enhanced Prompt Engineering
        prompt = f"""
        You are 'Hanzla AI Stylist', a high-end luxury fashion consultant for 'Hanzla Outlet'. 
        Your goal is to provide expert, personalized style advice that feels exclusive and professional.
        
        USER CONTEXT:
        - Targeting: {request.gender} ({request.age_group or 'All ages'})
        - Occasion: {request.occasion}
        - Budget preference: {request.budget_min} to {request.budget_max or 'Premium'} PKR
        - Style specific notes: {request.body_type or 'Standard fit'}
        
        AVAILABLE CURATED COLLECTION:
        {json.dumps(product_list)}
        
        EXPERT INSTRUCTIONS:
        1. PERSUASIVE ADVICE: Write 2-3 sentences of expert fashion coordination advice. Focus on textures, colors, and the specific vibe of the '{request.occasion}'.
        2. RANKING: Choose the BEST 4-6 items that work together as an ensemble or offer great variety for the occasion.
        3. FASHION RATIONALE: For each item, explain NOT just what it is, but WHY it works for {request.occasion} and the user's specific profile.
        4. TONE: Professional, encouraging, and sophisticated.
        
        OUTPUT FORMAT (JSON strictly):
        {{
            "message": "Enthusiastic greeting + Expert style advice...",
            "recommendations": [
                {{
                    "product_id": integer,
                    "reason": "Expert rationale..."
                }}
            ]
        }}
        """

        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            data = json.loads(response.text)
            
            # Map back to full product objects
            final_recs = []
            selected_ids = [r["product_id"] for r in data.get("recommendations", [])]
            id_to_reason = {r["product_id"]: r["reason"] for r in data.get("recommendations", [])}
            
            for p in products:
                if p.id in selected_ids:
                    final_recs.append(StylistRecommendation(product=p, reason=id_to_reason[p.id]))

            return StylistResponse(
                message=data.get("message", "Here are my personalized recommendations for you."),
                recommendations=final_recs
            )
            
        except Exception as e:
            # Fallback on error
            print(f"AI Service Error: {e}")
            return StylistResponse(
                message="I analyzed your request and found these great options for you.",
                recommendations=[
                    StylistRecommendation(product=p, reason="Matches your style preferences.")
                    for p in products[:4]
                ]
            )

ai_service = AIService()

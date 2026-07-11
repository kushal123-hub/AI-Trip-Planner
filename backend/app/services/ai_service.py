from google import genai
from fastapi import HTTPException

from app.core.config import settings

# Create Gemini Client
client = genai.Client(api_key=settings.GEMINI_API_KEY)


def generate_itinerary(data):
    prompt = f"""
You are an expert travel planner.

Create a detailed 5-star travel itinerary.

Destination:
{data.destination}

Travel Dates:
{data.start_date} to {data.end_date}

Budget:
₹{data.budget}

Interests:
{data.interests}

Travel Style:
{data.travel_style}

Generate the following sections:

1. Trip Overview

2. Day-wise Itinerary

3. Best Hotels

4. Best Restaurants

5. Estimated Budget Breakdown

6. Packing List

7. Travel Tips

Return the response in plain text.
"""

    try:
        response = client.models.generate_content(
            model="models/gemini-flash-latest",
            contents=prompt,
        )

        if not response.text:
            raise HTTPException(
                status_code=500,
                detail="Gemini returned an empty response."
            )

        return response.text

    except Exception as e:
        print("\n========== GEMINI ERROR ==========")
        print(type(e))
        print(e)
        print("=================================\n")

        raise HTTPException(
            status_code=500,
            detail=f"Gemini Error: {str(e)}"
        )
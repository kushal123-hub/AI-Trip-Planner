import json

from google import genai
from google.genai import types
from fastapi import HTTPException

from app.core.config import settings

# Create Gemini Client
client = genai.Client(api_key=settings.GEMINI_API_KEY)


def generate_itinerary(data):
    prompt = f"""
You are an expert AI travel planner.

Create a premium travel itinerary.

Trip Details

Destination: {data.destination}

Travel Dates:
{data.start_date} to {data.end_date}

Budget:
₹{data.budget}

Interests:
{data.interests}

Travel Style:
{data.travel_style}

IMPORTANT:

Return ONLY valid JSON.

Do NOT write any explanation.

Do NOT use markdown.

Do NOT wrap the response inside ```json.

Return exactly this JSON structure:

{{
  "trip_overview": "",
  "days": [
    {{
      "day": 1,
      "title": "",
      "activities": [
        "",
        ""
      ]
    }}
  ],
  "recommended_hotels": [
    ""
  ],
  "recommended_restaurants": [
    ""
  ],
  "budget_breakdown": {{
    "hotel": 0,
    "food": 0,
    "transport": 0,
    "activities": 0,
    "miscellaneous": 0
  }},
  "packing_list": [
    ""
  ],
  "travel_tips": [
    ""
  ]
}}

The JSON must be valid and directly parsable.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )

        if not response.text:
            raise HTTPException(
                status_code=500,
                detail="Gemini returned an empty response."
            )

        # Parse the JSON returned by Gemini
        try:
            itinerary_json = json.loads(response.text)
            return itinerary_json
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500,
                detail="Gemini returned invalid JSON."
            )

    except Exception as e:
        print("\n========== GEMINI ERROR ==========")
        print(type(e))
        print(e)
        print("=================================\n")

        raise HTTPException(
            status_code=500,
            detail=f"Gemini Error: {str(e)}"
        )
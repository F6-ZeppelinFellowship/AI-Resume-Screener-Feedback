import os

from dotenv import load_dotenv
from google import genai

from app.schemas.evaluation import ResumeEvaluation

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=API_KEY)


SYSTEM_PROMPT = """
You are an ATS (Applicant Tracking System) Resume Evaluation Assistant.

Your task:

Compare the candidate's resume with the provided job description.

Return ONLY valid JSON.

The JSON must exactly follow this schema:

{
    "match_score": integer (0-100),
    "missing_keywords": [string],
    "suggestions": [string]
}

Rules:

- No markdown.
- No explanation.
- No extra fields.
- Suggestions should be practical and actionable.
"""


def evaluate_resume(
    resume_text: str,
    job_description: str,
) -> ResumeEvaluation:

    prompt = f"""
Resume:

{resume_text}


Job Description:

{job_description}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            SYSTEM_PROMPT,
            prompt,
        ],
        config={
            "response_mime_type": "application/json",
            "response_schema": ResumeEvaluation,
        },
    )

    return response.parsed
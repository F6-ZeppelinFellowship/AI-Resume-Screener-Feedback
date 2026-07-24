import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.schemas.evaluation import ResumeEvaluation


# --------------------------------------------------
# Load environment variables
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)


API_KEY = os.getenv("GEMINI_API_KEY")


if not API_KEY:
    raise RuntimeError(
        f"GEMINI_API_KEY not found. Expected .env at: {ENV_PATH}"
    )


# --------------------------------------------------
# Gemini Client
# --------------------------------------------------

client = genai.Client(
    api_key=API_KEY
)


# --------------------------------------------------
# ATS System Instructions
# --------------------------------------------------

SYSTEM_PROMPT = """
You are an ATS (Applicant Tracking System) Resume Evaluation Assistant.

Your job is to compare a candidate resume with a job description.

Analyze:

1. Skills match
2. Experience relevance
3. Missing technical keywords
4. Improvement suggestions


Return ONLY JSON.

The output must exactly follow:

{
    "match_score": integer between 0 and 100,
    "missing_keywords": ["keyword"],
    "suggestions": ["suggestion"]
}


Rules:

- No markdown.
- No explanations outside JSON.
- No additional fields.
- Suggestions must be practical.
"""


# --------------------------------------------------
# Resume Evaluation Function
# --------------------------------------------------

def evaluate_resume(
    resume_text: str,
    job_description: str,
) -> ResumeEvaluation:

    prompt = f"""
Candidate Resume:

{resume_text}


Job Description:

{job_description}
"""


    try:

        response = client.models.generate_content(

            model="gemini-2.5-flash",

            contents=[
                SYSTEM_PROMPT,
                prompt,
            ],

            config=types.GenerateContentConfig(

                temperature=0.2,

                response_mime_type="application/json",

                response_schema=ResumeEvaluation,

            ),
        )


        if response.parsed is None:
            raise RuntimeError(
                "Gemini returned no structured response"
            )


        return response.parsed


    except Exception as e:

        raise RuntimeError(
            f"Gemini evaluation failed: {str(e)}"
        )
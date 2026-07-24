import os
import json

from dotenv import load_dotenv
from openai import OpenAI

from app.schemas.evaluation import ResumeEvaluation


load_dotenv()


API_KEY = os.getenv("OPENROUTER_API_KEY")


if not API_KEY:
    raise RuntimeError(
        "OPENROUTER_API_KEY not found in .env"
    )


client = OpenAI(
    api_key=API_KEY,
    base_url="https://openrouter.ai/api/v1"
)


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


    response = client.chat.completions.create(

        model="google/gemini-2.0-flash-001",

        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],

        temperature=0.2,
    )


    output = response.choices[0].message.content


    result = json.loads(output)


    return ResumeEvaluation(**result)
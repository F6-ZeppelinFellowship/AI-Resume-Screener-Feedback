import os
import json

from fastapi import FastAPI, UploadFile, Form, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware

from openai import OpenAI

from app.api.parser import extract_text_from_pdf, extract_text_from_docx


app = FastAPI(title="AI Resume Screener & Feedback API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


MAX_FILE_SIZE = 5 * 1024 * 1024


ALLOWED_MIME_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx"
}


# =====================================================================
# OPENROUTER LLM CONFIGURATION
# =====================================================================

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


if not OPENROUTER_API_KEY:
    raise RuntimeError(
        "OPENROUTER_API_KEY not found"
    )


client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)


SYSTEM_PROMPT = """
You are an ATS (Applicant Tracking System) Resume Evaluation Assistant.

Compare the candidate resume with the job description.

Return ONLY JSON:

{
    "match_score": integer,
    "missing_keywords": [],
    "suggestions": []
}

Rules:
- No markdown.
- No explanation.
- No extra fields.
"""


# =====================================================================
# OPENROUTER EVALUATOR
# =====================================================================

class OpenRouterEvaluator:

    async def __call__(
        self,
        resume_text: str,
        job_description: str
    ) -> dict:


        prompt = f"""
Resume:

{resume_text}


Job Description:

{job_description}
"""


        response = client.chat.completions.create(

            model="nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",

            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.2
        )


        result = json.loads(
            response.choices[0].message.content
        )


        return result



# Dependency Injection
def get_evaluator():

    return OpenRouterEvaluator()


# =====================================================================
# FASTAPI ENDPOINT (UNCHANGED)
# =====================================================================


@app.post("/api/analyze", status_code=status.HTTP_200_OK)
async def analyze_resume(
    resume: UploadFile,
    job_description: str = Form(...),
    evaluator=Depends(get_evaluator)
):


    # 1. Guardrail: Validate Content Type

    if resume.content_type not in ALLOWED_MIME_TYPES:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF and DOCX files are allowed."
        )


    # 2. Guardrail: Validate File Size

    file_bytes = await resume.read()


    if len(file_bytes) > MAX_FILE_SIZE:

        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds the 5MB maximum limit."
        )


    # 3. Execution: Route to extraction utilities

    file_type = ALLOWED_MIME_TYPES[resume.content_type]


    try:

        if file_type == "pdf":

            cleaned_text = extract_text_from_pdf(file_bytes)

        else:

            cleaned_text = extract_text_from_docx(file_bytes)


        if not cleaned_text.strip():

            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="The uploaded file appears to be empty or contains non-extractable text."
            )


    except ValueError as ve:

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve)
        )


    # 4. LLM Evaluation

    analysis_results = await evaluator(
        cleaned_text,
        job_description
    )


    return analysis_results
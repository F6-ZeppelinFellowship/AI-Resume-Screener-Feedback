import os
from fastapi import FastAPI, UploadFile, Form, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
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
    "application/vnd.openxmlformats-officedocumentwordprocessingml.document": "docx"
}

# =====================================================================
# PARALLEL BUILD INTERFACE
# This mimics Member 1's logic so you can test your code immediately.
# =====================================================================
class MockGeminiEvaluator:
    async def __call__(self, resume_text: str, job_description: str) -> dict:
        # Returns the exact payload contract Member 3 and 4 expect
        return {
            "match_score": 82,
            "missing_keywords": ["FastAPI", "Asynchronous Programming", "Data Sanitization"],
            "suggestions": [
                "Excellent parsing extraction structure detected.",
                "Ensure your endpoints use dependency injection to decouple parallel feature branches."
            ]
        }

# Fallback engine used during development. 
# On Tuesday, change this line to: get_evaluator = Member1GeminiEvaluator()
def get_evaluator():
    return MockGeminiEvaluator()
# =====================================================================

@app.post("/api/analyze", status_code=status.HTTP_200_OK)
async def analyze_resume(
    resume: UploadFile,
    job_description: str = Form(...),
    evaluator=Depends(get_evaluator)  # Injected cleanly here
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

    # 4. Independent Handoff
    # This executes whatever evaluator class is currently injected, 
    # letting you test your extraction logic end-to-end today.
    analysis_results = await evaluator(cleaned_text, job_description)
    
    return analysis_results
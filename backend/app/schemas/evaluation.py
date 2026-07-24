from pydantic import BaseModel, Field


class ResumeEvaluation(BaseModel):
    match_score: int = Field(
        ...,
        ge=0,
        le=100,
        description="ATS match score between 0 and 100"
    )

    missing_keywords: list[str] = Field(
        default_factory=list,
        description="Keywords found in the job description but missing from the resume"
    )

    suggestions: list[str] = Field(
        default_factory=list,
        description="Actionable resume improvement suggestions"
    )
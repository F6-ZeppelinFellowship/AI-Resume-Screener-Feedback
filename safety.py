from pydantic import ValidationError

from app.core.gemini_client import evaluate_resume


def safe_resume_evaluation(
    resume_text: str,
    job_description: str,
):
    """
    Wrapper around Gemini evaluation.

    Retries once if Gemini returns invalid JSON
    or fails schema validation.
    """

    last_exception = None

    for attempt in range(2):

        try:

            return evaluate_resume(
                resume_text,
                job_description,
            )

        except ValidationError as e:

            last_exception = e

        except Exception as e:

            last_exception = e

    raise RuntimeError(
        "Unable to evaluate resume at this time. Please try again later."
    ) from last_exception
# Team Roles & Execution Plan
**Project:** AI Resume Screener & Feedback  
**Repository:** `AI-Resume-Screener-Feedback`  
**Timeline:** Condensed delivery (3-day execution window)

---

## 1) Backend Team

## 👥 Member 1 — Backend & Core Integration Lead
**Primary working directories:**
- `backend/app/schemas/`
- `backend/app/core/`

**Exact files to create/edit:**
- `backend/app/schemas/evaluation.py`  
  - Create `ResumeEvaluation` Pydantic model to enforce structured output contract.
- `backend/app/core/gemini_client.py`  
  - Initialize Gemini client.
  - Define system prompt.
  - Implement `client.models.generate_content` with schema-constrained structured output.
- `backend/app/core/safety.py`  
  - Wrap Gemini evaluation call in `try/except`.
  - Implement **single automated retry** mechanism.
- `backend/main.py`  
  - Integrate safety evaluation function into API flow.

---

## 👥 Ifra Ahmed — Project Lead & Extraction Specialist
**Primary working directories:**
- `backend/app/api/`
- `backend/`

**Exact files to create/edit:**
- `backend/app/api/parser.py`  
  - Implement:
    - `extract_text_from_pdf(...)`
    - `extract_text_from_docx(...)`
  - Add sanitization/normalization for whitespace and encoding artifacts.
- `backend/main.py`  
  - Implement async `POST /api/analyze`.
  - Accept:
    - `UploadFile` for resume
    - form `job_description` string
  - Add file size/type guardrails.
  - Call parser functions and pass clean text to Member 1’s evaluation function.
- `backend/.env` (local only, not committed)  
  - Store `GEMINI_API_KEY`.

---

## 2) Frontend Team

## 👥 Member 3 — Frontend Layout & Input State Engineer
**Primary working directories:**
- `frontend/app/`
- `frontend/app/components/`

**Exact files to create/edit:**
- `frontend/app/page.tsx`  
  - Own status state machine:
    - `'idle' | 'loading' | 'success' | 'error'`
- `frontend/app/components/UploadForm.tsx`  
  - Build file upload + JD text input component.
  - Submit multipart form data to:
    - `http://localhost:8000/api/analyze`
  - Handle locked inputs, loader, and error alerts via status state.

---

## 👥 Member 4 — UI/UX Components & Result Dashboard Architect
**Primary working directories:**
- `frontend/app/components/`
- `frontend/`

**Exact files to create/edit:**
- `frontend/app/components/Dashboard.tsx`  
  - Render validated JSON response data.
- `frontend/app/components/ScoreRing.tsx`  
  - Circular score visual for `match_score`.
  - Conditional color states (green/orange/red).
- `frontend/app/components/KeywordBadges.tsx`  
  - Render `missing_keywords` as tag badges.
- `frontend/app/components/SuggestionCard.tsx`  
  - Render `suggestions` as actionable cards/list.
- `frontend/app/page.tsx`  
  - Mount dashboard below Member 3 status handlers.

---

## 3) Execution Plan

## Parallel Build Phase (Tomorrow)
- Ifra: build extraction utilities in `backend/app/api/parser.py`.
- Member 1: build schema + Gemini structured output flow.
- Member 3: build upload/network form and status state flow.
- Member 4: build dashboard components with static/mock JSON contract.

## Integration Phase (Monday/Tuesday)
- Backend integration:
  - Wire parsed text output into Member 1 evaluation flow in `backend/main.py`.
- Frontend integration:
  - Hook live API response into state flow.
  - Stream validated result object into dashboard components.

---

## 4) Shared JSON Contract (Reference)

```json
{
  "match_score": 0,
  "missing_keywords": ["keyword1", "keyword2"],
  "suggestions": ["Rewrite bullet X with measurable impact"]
}
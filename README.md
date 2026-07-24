# AI-Resume-Screener-Feedback

> AI & Generative AI Fellowship, Project_1, Zeppelin Labs

An AI-powered application that analyzes resumes against a job description and provides structured, actionable feedback for improvement.

---

## 📌 Project Overview

Job seekers are often rejected by ATS systems or recruiters without clear feedback.  
This project helps solve that by taking:

1. A resume upload (`.pdf` / `.docx`)
2. A target job description (text input)

The system then returns:

- **Match score** (0–100)
- **Missing keywords**
- **Actionable bullet-point improvement suggestions**

Our core learning objective is to implement **structured JSON prompting** so the model output is reliable, machine-validated, and easy to render in UI.

---

## 🎯 Objectives

- Build a robust resume + JD evaluation workflow
- Enforce strict structured LLM responses (not free-form text)
- Provide meaningful, practical feedback users can act on immediately
- Maintain clean team collaboration using disciplined Git workflows

---

## 🏗️ Architecture (Final Stack)

### Frontend Layer
- **Next.js**
- Handles:
  - Resume upload
  - Job description input
  - Loading states
  - Result rendering (score, keyword gaps, suggestions)

### Backend Layer
- **FastAPI**
- Handles:
  - File ingestion
  - Text extraction and cleaning
  - Prompt construction
  - LLM response validation + retry logic

### LLM Layer
- **Gemini API**
- Uses strict structured output format (JSON schema aligned)

### Project Constraint
- ❌ No vector database in this project scope

---

## 🧩 Core Modules

### Module 1 — File Parsing & Text Extraction
- Accept PDF/DOCX resume uploads
- Validate file type and size
- Extract text using parser libraries
- Clean corrupted spacing/encoding artifacts

### Module 2 — Prompt Engineering & Structured JSON Output
- Build strict prompt template
- Force model to return valid JSON only
- Validate model output with schema rules

### Module 3 — Safety & Auto-Retry Layer
- Catch invalid JSON or missing fields
- Trigger exactly one auto-retry
- Fail gracefully with user-friendly error if retry fails

### Module 4 — Interactive Feedback Interface
- Build form and upload UX
- Show loading and error states
- Display match score, missing keywords, and suggestions clearly

---

## 📄 Structured Output Contract

```json
{
  "match_score": 0,
  "missing_keywords": ["keyword1", "keyword2"],
  "suggestions": ["Rewrite bullet X with measurable impact"]
}
```

---

## 🔀 Git & Collaboration Guidelines

### Branching Strategy
`main → dev → feature/*`

- `main`: stable, release-ready code
- `dev`: integration branch
- `feature/*`: individual task branches

### Pull Request Rules
- Minimum **1 peer review** required before merge
- No direct pushes to `main`
- Keep PRs small, focused, and well-described

### Daily Progress Requirement
- All 5 members commit **daily incremental progress**
- Avoid large end-of-week code dumps
- Keep commits atomic and traceable

---

## 🚀 6-Step Incremental Build Plan

1. **Repo Foundation**  
   Setup branch rules, folder structure, templates, and env files.

2. **Upload API + Validation**  
   Build FastAPI endpoint for resume + JD inputs.

3. **Text Extraction Pipeline**  
   Implement PDF/DOCX extraction and sanitization.

4. **Structured LLM Evaluation**  
   Integrate Gemini API with strict JSON response schema.

5. **Safety & Retry Logic**  
   Add parse validation, one-pass retry, graceful error fallback.

6. **UI Integration**  
   Connect Next.js frontend to backend and render final feedback dashboard.

---

## 👥 Team Members

- Ayesha  
- Ifra Ahmed  
- Kaneeza Batool  
- Hasana  
- Hajira Azfar  

---

## 🛠️ Technologies

- FastAPI
- Gemini API
- Next.js
- Python
- TypeScript
- Tailwind CSS (UI styling)

---

## ⚙️ Installation

### Backend
```bash
cd backend
pip install -r requirements.txt
```

### Frontend
```bash
cd frontend
npm install
```

---

## ▶️ Run

### Start Backend (FastAPI)
```bash
cd backend
uvicorn main:app --reload
```

### Start Frontend (Next.js)
```bash
cd frontend
npm run dev
```

---

## 🔐 Environment Variables

Create `backend/.env`:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

---

## 📌 Status

This repository is currently in setup/planning stage.  
Task decomposition and implementation details are being finalized by the team.

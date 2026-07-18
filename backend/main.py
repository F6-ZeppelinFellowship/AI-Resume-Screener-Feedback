from fastapi import FastAPI

app = FastAPI(title="AI Resume Screener API")

@app.get("/")
def root():
    return {"status": "ok", "message": "AI Resume Screener backend is running."}

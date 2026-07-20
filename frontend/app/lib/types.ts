// Shared data contract with the backend.
// Must match the Pydantic schema Member 1 defines.

export interface AnalysisResult {
  match_score: number;
  missing_keywords: string[];
  suggestions: string[];
}

export type AppStatus = "idle" | "loading" | "success" | "error";
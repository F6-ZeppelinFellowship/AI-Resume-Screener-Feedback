"use client";

import ScoreRing from "./ScoreRing";
import KeywordBadges from "./KeywordBadges";
import SuggestionCard from "./SuggestionCard";

interface EvaluationResult {
  match_score: number;
  missing_keywords: string[];
  suggestions: string[];
}

interface DashboardProps {
  data?: EvaluationResult;
}

// Dummy data matching the shared JSON contract, used until
// Member 3 wires in the live API response from page.tsx
const DUMMY_DATA: EvaluationResult = {
  match_score: 68,
  missing_keywords: ["Docker", "CI/CD", "GraphQL", "Kubernetes"],
  suggestions: [
    "Rewrite bullet 'Worked on backend' with measurable impact, e.g. 'Reduced API latency by 30%'.",
    "Add specific metrics to your project descriptions to quantify results.",
    "Highlight experience with cloud platforms mentioned in the job description.",
  ],
};

export default function Dashboard({ data = DUMMY_DATA }: DashboardProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
      <div className="flex items-center justify-center">
        <ScoreRing score={data.match_score} />
      </div>

      <KeywordBadges keywords={data.missing_keywords} />

      <SuggestionCard suggestions={data.suggestions} />
    </div>
  );
}
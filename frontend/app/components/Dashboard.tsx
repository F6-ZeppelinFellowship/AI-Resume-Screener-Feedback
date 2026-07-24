"use client";

import ScoreRing from "./ScoreRing";
import KeywordBadges from "./KeywordBadges";
import SuggestionCard from "./SuggestionCard";
import type { EvaluationResult } from "./UploadForm";

interface DashboardProps {
  data: EvaluationResult;
}

export default function Dashboard({ data }: DashboardProps) {
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
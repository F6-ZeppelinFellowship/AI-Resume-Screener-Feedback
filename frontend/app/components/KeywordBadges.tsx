"use client";

interface KeywordBadgesProps {
  keywords: string[]; // missing_keywords
}

export default function KeywordBadges({ keywords }: KeywordBadgesProps) {
  if (!keywords || keywords.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No missing keywords detected 🎉
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-700">
        Missing Keywords
      </h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <span
            key={`${keyword}-${index}`}
            className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-sm font-medium text-red-700"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}
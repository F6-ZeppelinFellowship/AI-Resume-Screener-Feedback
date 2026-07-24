"use client";

interface SuggestionCardProps {
  suggestions: string[]; // suggestions array
}

export default function SuggestionCard({ suggestions }: SuggestionCardProps) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No suggestions available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-700">
        Suggestions
      </h3>
      <div className="flex flex-col gap-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                {index + 1}
              </span>
              <p className="text-sm text-gray-700">{suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
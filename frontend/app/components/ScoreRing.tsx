"use client";

interface ScoreRingProps {
  score: number; // match_score: 0-100
}

export default function ScoreRing({ score }: ScoreRingProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  const getColor = (value: number) => {
    if (value >= 75) return "#22c55e"; // green
    if (value >= 50) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  const color = getColor(clampedScore);

  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90"
      >
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="-mt-24 flex flex-col items-center">
        <span className="text-3xl font-bold" style={{ color }}>
          {clampedScore}
        </span>
        <span className="text-sm text-gray-500">Match Score</span>
      </div>
    </div>
  );
}
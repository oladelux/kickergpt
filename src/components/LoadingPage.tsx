import { useState, useEffect } from 'react';

const tips = [
  "Get AI-powered match predictions",
  "Tap any fixture for detailed analysis",
  "Star matches to add them to favorites",
  "Ask questions about any upcoming game",
  "Predictions update as kickoff approaches",
  "Filter matches by league or competition",
];

export const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          // Slow down significantly as we approach completion
          const slowIncrement = Math.random() * 0.5 + 0.2;
          return Math.min(prev + slowIncrement, 99);
        }
        if (prev >= 70) {
          // Slow down after 70%
          const increment = Math.random() * 2 + 1;
          return Math.min(prev + increment, 90);
        }
        // Normal speed up to 70%
        const increment = Math.random() * 8 + 3;
        return Math.min(prev + increment, 70);
      });
    }, 300);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 2500);

    return () => clearInterval(tipInterval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        {/* Circular progress indicator */}
        <div className="relative h-24 w-24">
          <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/20"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className="text-primary transition-all duration-300 ease-out"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
            />
          </svg>
          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold text-foreground">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Tip text with fade animation */}
        <div className="h-12 flex items-center justify-center">
          <p
            key={tipIndex}
            className="text-muted-foreground text-sm text-center animate-fade-in"
          >
            {tips[tipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};

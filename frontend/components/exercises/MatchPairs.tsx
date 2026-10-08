"use client";
import { useState, useEffect } from "react";

interface PairItem {
  left: string;
  right: string;
}

interface MatchPairsProps {
  pairs: PairItem[];
  onComplete: () => void;
}

export default function MatchPairs({ pairs, onComplete }: MatchPairsProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);

  const leftWords = pairs.map((p) => p.left);
  const rightWords = pairs.map((p) => p.right).sort();

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      const match = pairs.find((p) => p.left === selectedLeft && p.right === selectedRight);
      if (match) {
        const newMatched = [...matched, selectedLeft, selectedRight];
        setMatched(newMatched);
        if (newMatched.length === pairs.length * 2) {
          onComplete();
        }
      }
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  }, [selectedLeft, selectedRight]);

  return (
    <div className="w-full max-w-lg mx-auto flex gap-6 justify-center">
      {/* Left Column */}
      <div className="flex flex-col gap-3 flex-1">
        {leftWords.map((word) => {
          const isMatched = matched.includes(word);
          const isSelected = selectedLeft === word;
          return (
            <button
              key={word}
              disabled={isMatched}
              onClick={() => setSelectedLeft(word)}
              className={`p-4 rounded-xl border-2 border-b-4 font-bold text-center transition-all ${
                isMatched
                  ? "opacity-30 border-transparent bg-gray-200"
                  : isSelected
                  ? "bg-[#DDF4FF] border-[#1CB0F6] text-[#1CB0F6]"
                  : "border-duo-gray bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {word}
            </button>
          );
        })}
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-3 flex-1">
        {rightWords.map((word) => {
          const isMatched = matched.includes(word);
          const isSelected = selectedRight === word;
          return (
            <button
              key={word}
              disabled={isMatched}
              onClick={() => setSelectedRight(word)}
              className={`p-4 rounded-xl border-2 border-b-4 font-bold text-center transition-all ${
                isMatched
                  ? "opacity-30 border-transparent bg-gray-200"
                  : isSelected
                  ? "bg-[#DDF4FF] border-[#1CB0F6] text-[#1CB0F6]"
                  : "border-duo-gray bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}
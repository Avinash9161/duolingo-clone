"use client";
import { useState, useEffect } from "react";

interface TranslateWordBankProps {
  question: string;
  options: string[];
  onChange: (val: string) => void;
}

export default function TranslateWordBank({
  question,
  options,
  onChange,
}: TranslateWordBankProps) {
  const [selectedWords, setSelectedWords] = useState<{ id: number; word: string }[]>([]);
  const [availableWords, setAvailableWords] = useState<{ id: number; word: string }[]>([]);

  useEffect(() => {
    setAvailableWords(options.map((w, idx) => ({ id: idx, word: w })));
    setSelectedWords([]);
    onChange("");
  }, [options]);

  const selectWord = (item: { id: number; word: string }) => {
    const updated = [...selectedWords, item];
    setSelectedWords(updated);
    setAvailableWords(availableWords.filter((w) => w.id !== item.id));
    onChange(updated.map((w) => w.word).join(" "));
  };

  const deselectWord = (item: { id: number; word: string }) => {
    const updated = selectedWords.filter((w) => w.id !== item.id);
    setSelectedWords(updated);
    setAvailableWords([...availableWords, item]);
    onChange(updated.map((w) => w.word).join(" "));
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-800">{question}</h2>

      {/* Answer Slot */}
      <div className="min-h-16 border-b-2 border-duo-gray flex flex-wrap gap-2 items-center pb-2">
        {selectedWords.map((item) => (
          <button
            key={item.id}
            onClick={() => deselectWord(item)}
            className="px-4 py-2 bg-white border-2 border-b-4 border-duo-gray rounded-xl font-bold text-gray-700 shadow-sm"
          >
            {item.word}
          </button>
        ))}
      </div>

      {/* Word Bank */}
      <div className="flex flex-wrap gap-3 mt-8">
        {availableWords.map((item) => (
          <button
            key={item.id}
            onClick={() => selectWord(item)}
            className="px-4 py-2 bg-white border-2 border-b-4 border-duo-gray rounded-xl font-bold text-gray-700 active:translate-y-1 transition-all"
          >
            {item.word}
          </button>
        ))}
      </div>
    </div>
  );
}
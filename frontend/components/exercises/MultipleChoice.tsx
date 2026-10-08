"use client";

interface MultipleChoiceProps {
  question: string;
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
}

export default function MultipleChoice({
  question,
  options,
  selectedOption,
  onSelect,
}: MultipleChoiceProps) {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-800 text-left">{question}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt, i) => {
          const isSelected = selectedOption === opt;
          return (
            <button
              key={i}
              onClick={() => onSelect(opt)}
              className={`p-4 rounded-2xl border-2 border-b-4 font-bold text-lg text-left transition-all ${
                isSelected
                  ? "bg-[#DDF4FF] border-[#1CB0F6] text-[#1CB0F6]"
                  : "border-duo-gray bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
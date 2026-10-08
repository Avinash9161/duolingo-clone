"use client";

interface FillInBlankProps {
  question: string; // e.g. "Ella ___ una mujer."
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
}

export default function FillInBlank({ question, options, selectedOption, onSelect }: FillInBlankProps) {
  const parts = question.split("___");

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
      <div className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
        <span>{parts[0]}</span>
        <span className="inline-block min-w-20 border-b-4 border-duo-gray px-3 text-center text-[#1CB0F6]">
          {selectedOption || "___"}
        </span>
        <span>{parts[1]}</span>
      </div>

      <div className="flex justify-center gap-4">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`px-6 py-3 rounded-2xl border-2 border-b-4 font-bold text-lg ${
              selectedOption === opt
                ? "bg-[#DDF4FF] border-[#1CB0F6] text-[#1CB0F6]"
                : "border-duo-gray bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
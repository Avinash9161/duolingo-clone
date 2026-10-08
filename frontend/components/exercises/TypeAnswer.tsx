"use client";

interface TypeAnswerProps {
  question: string;
  value: string;
  onChange: (val: string) => void;
}

export default function TypeAnswer({ question, value, onChange }: TypeAnswerProps) {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-800">{question}</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your translation in Spanish..."
        rows={3}
        className="w-full p-4 border-2 border-duo-gray rounded-2xl focus:outline-none focus:border-[#1CB0F6] text-lg font-medium resize-none"
      />
    </div>
  );
}
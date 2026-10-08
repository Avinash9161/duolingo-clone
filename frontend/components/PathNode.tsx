"use client";
import Link from "next/link";
import { Check, Star, Lock } from "lucide-react";

interface PathNodeProps {
  skill: {
    id: number;
    title: string;
    total_lessons: number;
    completed_lessons: number;
    status: string; // COMPLETED, ACTIVE, LOCKED
  };
  offsetIndex: number;
}

export default function PathNode({ skill, offsetIndex }: PathNodeProps) {
  // Sine curve offsets for authentic Duolingo zig-zag path
  const offsets = [0, 45, -45, 0];
  const offset = offsets[offsetIndex % offsets.length];

  const isCompleted = skill.status === "COMPLETED";
  const isActive = skill.status === "ACTIVE";
  const isLocked = skill.status === "LOCKED";

  const progressPercent = skill.total_lessons > 0 ? (skill.completed_lessons / skill.total_lessons) * 100 : 0;

  return (
    <div
      className="flex flex-col items-center my-6 relative transition-transform duration-300"
      style={{ transform: `translateX(${offset}px)` }}
    >
      <div className="relative group">
        {/* Circular Progress Ring */}
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="42"
            stroke="#E5E5E5"
            strokeWidth="8"
            fill="transparent"
          />
          {isActive && (
            <circle
              cx="48"
              cy="48"
              r="42"
              stroke="#58CC02"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progressPercent) / 100}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* 3D Round Skill Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isLocked ? (
            <div className="w-16 h-16 rounded-full bg-[#E5E5E5] border-b-4 border-[#AFAFAF] flex items-center justify-center cursor-not-allowed text-gray-400">
              <Lock className="w-7 h-7" />
            </div>
          ) : (
            <Link
              href={`/lesson/${skill.id}`}
              className={`w-16 h-16 rounded-full flex items-center justify-center border-b-4 text-white active:translate-y-1 active:border-b-0 transition-all ${
                isCompleted
                  ? "bg-[#FFC800] border-[#E5A400]"
                  : "bg-[#58CC02] border-[#46A302]"
              }`}
            >
              {isCompleted ? (
                <Check className="w-8 h-8 stroke-[3]" />
              ) : (
                <Star className="w-8 h-8 fill-white" />
              )}
            </Link>
          )}
        </div>
      </div>
      <span className="font-extrabold text-sm mt-2 text-gray-700">{skill.title}</span>
    </div>
  );
}
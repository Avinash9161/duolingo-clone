"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, Heart, CheckCircle, XCircle,Volume2,Timer } from "lucide-react";
import confetti from "canvas-confetti";

import MultipleChoice from "@/components/exercises/MultipleChoice";
import TranslateWordBank from "@/components/exercises/TranslateWordBank";
import MatchPairs from "@/components/exercises/MatchPairs";
import FillInBlank from "@/components/exercises/FillInBlank";
import TypeAnswer from "@/components/exercises/TypeAnswer";
import { fetchNextLesson, fetchProfile, completeLesson, decrementHeart, refillHearts } from "@/lib/api";
// 1. We removed "export default" from here and renamed the function
function LessonContent() {
  const router = useRouter();
  const params = useParams();
  const skillId = Number(params.id);

  const [lesson, setLesson] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isMatchComplete, setIsMatchComplete] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "CORRECT" | "INCORRECT">("IDLE");
  const [isCompletedModal, setIsCompletedModal] = useState(false);
  const [isOutOfHearts, setIsOutOfHearts] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds for Legendary challenge
  const [isOutOfTime, setIsOutOfTime] = useState(false);

  useEffect(() => {
    async function init() {
      const u = await fetchProfile();
      setUser(u);
      if (u.hearts <= 0) {
        setIsOutOfHearts(true);
        return;
      }
      const l = await fetchNextLesson(skillId);
      setLesson(l);
    }
    init();
  }, [skillId]);
  // Timed Practice countdown logic
useEffect(() => {
  if (!lesson || isCompletedModal || status !== "IDLE" || isOutOfTime || isOutOfHearts) return;
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        setIsOutOfTime(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(timer);
}, [lesson, isCompletedModal, status, isOutOfTime, isOutOfHearts]);

// Text-to-Speech audio engine
const playAudio = (text: string) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES"; // Spanish pronunciation
    window.speechSynthesis.speak(utterance);
  }
};
  if (isOutOfHearts) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center flex flex-col items-center">
          <Heart className="w-16 h-16 text-duo-red fill-duo-red mb-4 animate-bounce" />
          <h2 className="text-2xl font-black mb-2">You ran out of hearts!</h2>
          <p className="text-gray-500 mb-6 font-medium">Refill your hearts to keep learning right now.</p>
          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={async () => {
                await refillHearts();
                setIsOutOfHearts(false);
                const u = await fetchProfile();
                setUser(u);
              }} 
              className="w-full py-3 btn-duo-blue text-white font-bold uppercase tracking-wider"
            >
              Refill Hearts
            </button>
            <button 
              onClick={() => window.location.href = "/learn"} 
              className="w-full py-3 btn-duo-gray font-bold uppercase tracking-wider"
            >
              End Lesson
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (isOutOfTime) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center flex flex-col items-center">
        <Timer className="w-16 h-16 text-[#1CB0F6] mb-4 animate-pulse" />
        <h2 className="text-2xl font-black mb-2">Time's up!</h2>
        <p className="text-gray-500 mb-6 font-medium">You ran out of time on this legendary challenge.</p>
        <button onClick={() => window.location.href = "/learn"} className="w-full py-3 btn-duo-gray font-bold uppercase">Back to Path</button>
      </div>
    </div>
  );
}

  if (!lesson || !user) return <div className="p-8 font-bold text-gray-400">Loading lesson...</div>;

  // Guard against API errors (like 404s) or skills with no seeded exercises
  if (lesson.detail || !lesson.exercises || lesson.exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-white fixed inset-0 z-50 space-y-6">
        <h2 className="text-2xl font-black text-gray-400">No exercises seeded for this skill yet!</h2>
        <button onClick={() => window.location.href = "/learn"} className="btn-duo-blue px-8 py-3 uppercase tracking-wider text-sm">
          Back to Path
        </button>
      </div>
    );
  }

  const currentExercise = lesson.exercises[currentIndex];
  const progressPercent = ((currentIndex) / lesson.exercises.length) * 100;

  const handleCheck = async () => {
    let correct = false;
    if (currentExercise.type === "MATCH_PAIRS") {
      correct = isMatchComplete;
    } else {
      correct = selectedAnswer.trim().toLowerCase() === currentExercise.correct_answer.trim().toLowerCase();
    }

    if (correct) {
      setStatus("CORRECT");
    } else {
      setStatus("INCORRECT");
      const res = await decrementHeart();
      setUser((prev: any) => ({ ...prev, hearts: res.hearts }));
      if (res.hearts <= 0) {
        setIsOutOfHearts(true);
      }
    }
  };

  const handleNext = async () => {
    setStatus("IDLE");
    setSelectedAnswer("");
    setIsMatchComplete(false);

    if (currentIndex + 1 < lesson.exercises.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      await completeLesson(lesson.id);
      setIsCompletedModal(true);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-between bg-white dark:bg-[#131F24] z-[100] fixed inset-0">
      {/* Top Exercise Bar */}
      {/* Top Exercise Bar */}
      <div className="max-w-4xl w-full mx-auto p-4 flex items-center gap-4">
        <button onClick={() => window.location.href = "/learn"} className="text-gray-400 hover:text-gray-600">
          <X className="w-7 h-7 stroke-[3]" />
        </button>
        <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
          <div
            className="bg-[#58CC02] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        {/* Timer Display added here! */}
        <div className="flex items-center gap-1 font-bold text-[#1CB0F6]">
          <Timer className="w-6 h-6" />
          <span>0:{timeLeft.toString().padStart(2, '0')}</span>
        </div>

        <div className="flex items-center gap-1 font-bold text-duo-red">
          <Heart className="fill-duo-red w-6 h-6" />
          <span>{user.hearts}</span>
        </div>
      </div>

      {/* Main Exercise View */}
      <div className="flex-1 flex flex-col justify-center px-4 overflow-y-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <button onClick={() => playAudio(currentExercise.question)} className="p-3 bg-[#1CB0F6] rounded-xl text-white hover:bg-[#1899D6] active:translate-y-1 transition-all">
            <Volume2 className="w-6 h-6" />
          </button>
          <span className="text-center font-extrabold text-gray-400 uppercase tracking-widest text-xs">
            {currentExercise.prompt}
          </span>
        </div>

        {currentExercise.type === "MULTIPLE_CHOICE" && (
          <MultipleChoice
            question={currentExercise.question}
            options={currentExercise.options}
            selectedOption={selectedAnswer}
            onSelect={setSelectedAnswer}
          />
        )}
        {currentExercise.type === "TRANSLATE" && (
          <TranslateWordBank
            question={currentExercise.question}
            options={currentExercise.options}
            onChange={setSelectedAnswer}
          />
        )}
        {currentExercise.type === "MATCH_PAIRS" && (
          <MatchPairs
            pairs={currentExercise.pairs}
            onComplete={() => setIsMatchComplete(true)}
          />
        )}
        {currentExercise.type === "FILL_BLANK" && (
          <FillInBlank
            question={currentExercise.question}
            options={currentExercise.options}
            selectedOption={selectedAnswer}
            onSelect={setSelectedAnswer}
          />
        )}
        {currentExercise.type === "TYPE_ANSWER" && (
          <TypeAnswer
            question={currentExercise.question}
            value={selectedAnswer}
            onChange={setSelectedAnswer}
          />
        )}
      </div>

      {/* Bottom Signature Feedback Bar */}
      <div
        className={`w-full border-t-2 py-6 px-8 transition-colors ${
          status === "CORRECT"
            ? "bg-[#D7FFB8] border-transparent"
            : status === "INCORRECT"
            ? "bg-[#FFDFE0] border-transparent"
            : "bg-white border-duo-gray"
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            {status === "CORRECT" && (
              <div className="flex items-center gap-2 text-[#58A700] font-black text-xl">
                <CheckCircle className="w-8 h-8 fill-[#58A700] text-[#D7FFB8]" />
                Amazing!
              </div>
            )}
            {status === "INCORRECT" && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[#EA2B2B] font-black text-xl">
                  <XCircle className="w-8 h-8 fill-[#EA2B2B] text-[#FFDFE0]" />
                  Correct solution:
                </div>
                <span className="text-sm font-bold text-gray-700">{currentExercise.correct_answer}</span>
              </div>
            )}
          </div>

          {status === "IDLE" ? (
            <button
              onClick={handleCheck}
              disabled={!selectedAnswer && !isMatchComplete}
              className={`px-8 py-3 uppercase tracking-wider text-sm ${
                selectedAnswer || isMatchComplete
                  ? "btn-duo-green"
                  : "bg-gray-200 text-gray-400 font-bold rounded-2xl cursor-not-allowed"
              }`}
            >
              Check
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={`px-8 py-3 uppercase tracking-wider text-sm ${
                status === "CORRECT" ? "btn-duo-green" : "bg-[#EA2B2B] text-white border-b-4 border-[#C71F1F] font-bold rounded-2xl"
              }`}
            >
              Continue
            </button>
          )}
        </div>
      </div>

      {/* Celebratory Completion Modal */}
      {isCompletedModal && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6 z-50">
          <div className="text-center max-w-sm flex flex-col items-center">
            <span className="text-6xl mb-4">🎉</span>
            <h1 className="text-3xl font-black text-[#FFC800] mb-2">Lesson Complete!</h1>
            <p className="text-gray-500 font-bold mb-8">You&apos;re making incredible progress!</p>
            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              <div className="border-2 border-duo-gray rounded-2xl p-4 flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">XP Earned</span>
                <span className="text-2xl font-black text-[#FFC800]">+{lesson.xp_reward}</span>
              </div>
              <div className="border-2 border-duo-gray rounded-2xl p-4 flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Streak</span>
                <span className="text-2xl font-black text-[#FF9600]">{user.current_streak} days</span>
              </div>
            </div>
            <button onClick={() => window.location.href = "/learn"} className="w-full py-4 btn-duo-green text-sm uppercase">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 2. We added this new default export that wraps the content in Suspense
export default function LessonPlayerPage() {
  return (
    <Suspense fallback={<div className="p-8 font-bold text-gray-400">Loading lesson environment...</div>}>
      <LessonContent />
    </Suspense>
  );
}
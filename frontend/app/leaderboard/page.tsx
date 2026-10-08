"use client";
import { useEffect, useState } from "react";
import { fetchLeaderboard } from "@/lib/api";
import { Shield } from "lucide-react";

export default function LeaderboardPage() {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    fetchLeaderboard().then(setBoard);
  }, []);

  return (
    <div className="w-full max-w-2xl py-10 px-4 mb-20 md:mb-0">
      <div className="flex flex-col items-center mb-8">
        <Shield className="w-20 h-20 text-[#FFC800] fill-[#FFC800] mb-4" />
        <h1 className="text-2xl font-black text-gray-700 dark:text-gray-200">Diamond League</h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold">Top learners this week</p>
      </div>

      <div className="border-2 border-duo-gray dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col">
        {board.map((user: any, index: number) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4 border-b-2 border-duo-gray dark:border-gray-800 last:border-b-0 ${
              user.is_current_user 
                ? "bg-[#EBF7FF] dark:bg-sky-900/30" 
                : "bg-white dark:bg-[#131F24]"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`font-bold ${user.is_current_user ? "text-[#1CB0F6]" : "text-gray-400"}`}>
                {user.rank}
              </span>
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-black text-gray-500 dark:text-gray-300">
                {user.username.charAt(0)}
              </div>
              <span className={`font-bold ${user.is_current_user ? "text-[#1CB0F6]" : "text-gray-700 dark:text-gray-200"}`}>
                {user.username}
              </span>
            </div>
            <span className={`font-bold ${user.is_current_user ? "text-[#1CB0F6]" : "text-gray-500 dark:text-gray-400"}`}>
              {user.xp} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
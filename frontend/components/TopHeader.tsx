"use client";
import { useEffect, useState } from "react";
import { Flame, Diamond, Heart, Zap } from "lucide-react";
import { fetchProfile } from "@/lib/api";

export default function TopHeader() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchProfile().then(setUser);
  }, []);

  if (!user) {
    return (
      <div className="sticky top-0 bg-white dark:bg-[#131F24] z-40 w-full flex justify-center py-4 px-4 border-b-2 border-duo-gray dark:border-gray-800 transition-colors h-[72px]">
      </div>
    );
  }

  return (
    <div className="sticky top-0 bg-white dark:bg-[#131F24] z-40 w-full flex justify-center py-4 px-4 border-b-2 border-duo-gray dark:border-gray-800 transition-colors">
      <div className="max-w-4xl w-full flex items-center justify-between md:justify-around font-bold text-gray-400">
        
        {/* Streak */}
        <div className="flex items-center gap-2 text-[#FF9600]">
          <Flame className="w-6 h-6 fill-[#FF9600]" />
          <span>{user.current_streak}</span>
        </div>
        
        {/* Gems */}
        <div className="flex items-center gap-2 text-[#1CB0F6]">
          <Diamond className="w-6 h-6 fill-[#1CB0F6]" />
          <span>{user.gems}</span>
        </div>
        
        {/* Hearts */}
        <div className="flex items-center gap-2 text-duo-red">
          <Heart className="w-6 h-6 fill-duo-red" />
          <span>{user.hearts}</span>
        </div>
        
        {/* XP */}
        <div className="flex items-center gap-2 text-[#FFC800]">
          <Zap className="w-6 h-6 fill-[#FFC800]" />
          <span className="hidden sm:inline">{user.total_xp} XP</span>
          <span className="inline sm:hidden">{user.total_xp}</span>
        </div>

      </div>
    </div>
  );
}
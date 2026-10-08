"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Shield, User, HeartHandshake, Clock, Target, Moon, Sun } from "lucide-react";
import { refillHearts, simulateDay, fetchProfile } from "@/lib/api";

export default function Sidebar() {
  const pathname = usePathname();
  const [xp, setXp] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    fetchProfile().then((p) => {
      if (p) setXp(p.total_xp);
    });
    setIsDark(document.documentElement.classList.contains("dark"));
  }, [pathname]);

  const toggleDark = () => {
    const isNowDark = document.documentElement.classList.toggle("dark");
    setIsDark(isNowDark);
    localStorage.setItem("theme", isNowDark ? "dark" : "light");
  };

  const handleRefill = async () => {
    await refillHearts();
    window.location.reload();
  };

  const handleSimulateDay = async () => {
    await simulateDay();
    alert("Simulated 1 day passing! Complete a lesson now to see your streak increase.");
  };

  const goal = 50;
  const currentDailyXp = (xp > 0 && xp % goal === 0) ? goal : (xp % goal);
  const progressPercent = (currentDailyXp / goal) * 100;
  const xpNeeded = goal - currentDailyXp;

  const links = [
    { name: "LEARN", href: "/learn", icon: BookOpen },
    { name: "LEADERBOARDS", href: "/leaderboard", icon: Shield },
    { name: "PROFILE", href: "/profile", icon: User },
  ];

  return (
    <aside className="w-full md:w-64 border-t-2 md:border-t-0 md:border-r-2 border-duo-gray dark:border-gray-800 h-20 md:h-screen fixed bottom-0 md:sticky md:top-0 flex flex-row md:flex-col justify-around md:justify-between bg-white dark:bg-[#131F24] z-50 transition-colors md:px-4 md:py-6 overflow-y-auto">
      
      {/* MOBILE NAVIGATION BAR (Only shows on small screens) */}
      <div className="flex md:hidden w-full h-full justify-around items-center px-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`p-3 rounded-xl transition-all border-2 ${
                isActive
                  ? "bg-[#EBF7FF] border-[#84D8FF] text-[#1CB0F6] dark:bg-sky-900/30 dark:border-sky-700"
                  : "border-transparent text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="w-7 h-7" />
            </Link>
          );
        })}
      </div>

      {/* DESKTOP NAVIGATION (Hidden on mobile) */}
      <div className="hidden md:flex flex-col w-full">
        <div className="flex items-center gap-2 px-4 mb-8">
          <span className="text-3xl font-extrabold tracking-tighter text-[#58CC02]">duolingo</span>
        </div>
        <nav className="flex flex-col gap-2 mb-8">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold tracking-wider text-sm transition-all border-2 ${
                  isActive
                    ? "bg-[#EBF7FF] border-[#84D8FF] text-[#1CB0F6] dark:bg-sky-900/30 dark:border-sky-700"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-6 h-6" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Daily Goal Indicator */}
        <div className="px-4 py-4 border-2 border-duo-gray dark:border-gray-800 rounded-2xl mb-8 flex flex-col gap-3">
          <div className="flex justify-between items-center font-bold text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#FFC800]" />
              <span className="text-sm">Daily Goal</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-400">{currentDailyXp} / {goal} XP</span>
              {xpNeeded > 0 && (
                <span className="text-[10px] text-[#FFC800] uppercase font-bold">{xpNeeded} more to go!</span>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
            <div
              className="bg-[#FFC800] h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* DESKTOP EVALUATOR TOOLS (Hidden on mobile) */}
      <div className="hidden md:flex flex-col gap-3">
        <button 
          onClick={toggleDark}
          className="p-4 bg-gray-50 dark:bg-[#202F36] border-2 border-duo-gray dark:border-gray-800 rounded-2xl flex flex-col gap-2 hover:bg-gray-100 dark:hover:bg-[#2A3F49] active:translate-y-1 transition-all text-left"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
            {isDark ? <Sun className="w-5 h-5 text-[#FFC800]" /> : <Moon className="w-5 h-5 text-[#CE82FF]" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </div>
          <p className="text-xs text-gray-400">Toggle application theme</p>
        </button>

        <button 
          onClick={handleRefill}
          className="p-4 bg-gray-50 dark:bg-[#202F36] border-2 border-duo-gray dark:border-gray-800 rounded-2xl flex flex-col gap-2 hover:bg-gray-100 dark:hover:bg-[#2A3F49] active:translate-y-1 transition-all text-left"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
            <HeartHandshake className="w-5 h-5 text-duo-red" /> Practice Refill
          </div>
          <p className="text-xs text-gray-400">Click to mock a heart refill</p>
        </button>

        <button 
          onClick={handleSimulateDay}
          className="p-4 bg-gray-50 dark:bg-[#202F36] border-2 border-duo-gray dark:border-gray-800 rounded-2xl flex flex-col gap-2 hover:bg-gray-100 dark:hover:bg-[#2A3F49] active:translate-y-1 transition-all text-left"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
            <Clock className="w-5 h-5 text-[#FF9600]" /> Simulate Day
          </div>
          <p className="text-xs text-gray-400">Test the daily streak increment</p>
        </button>
      </div>
    </aside>
  );
}
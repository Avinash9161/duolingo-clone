"use client";
import { useEffect, useState } from "react";
import { fetchProfile } from "@/lib/api";
import { Flame, Zap, Shield, Heart, Award, Star, Trophy } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile().then(setProfile);
  }, []);

  if (!profile) return <div className="p-8 font-bold text-gray-400">Loading profile...</div>;

  // Dynamic Badges Logic
  const achievements = [
    { title: "First Steps", desc: "Complete a lesson", icon: Star, unlocked: profile.total_xp > 0, color: "text-[#FFC800]", bg: "bg-[#FFF4E5]" },
    { title: "On Fire", desc: "Reach a 3-day streak", icon: Flame, unlocked: profile.current_streak >= 3, color: "text-[#FF9600]", bg: "bg-[#FFEDE5]" },
    { title: "Scholar", desc: "Earn 200 XP", icon: Zap, unlocked: profile.total_xp >= 200, color: "text-[#1CB0F6]", bg: "bg-[#EBF7FF]" },
    { title: "Champion", desc: "Earn 1000 XP", icon: Trophy, unlocked: profile.total_xp >= 1000, color: "text-[#CE82FF]", bg: "bg-[#F9F2FF]" },
  ];

  return (
    <div className="w-full max-w-xl py-10 px-4 mb-20 md:mb-0">
      <div className="flex items-center gap-6 pb-8 border-b-2 border-duo-gray">
        <div className="w-24 h-24 rounded-full bg-[#58CC02] text-white flex items-center justify-center text-4xl font-black border-4 border-[#46A302]">
          {profile.username?.charAt(0) || "?"}
        </div>
        <div>
          <h1 className="text-2xl font-black">{profile.username || "Guest"}</h1>
          <p className="text-sm font-bold text-gray-400">Joined October 2026</p>
        </div>
      </div>

      <h2 className="text-xl font-black mt-8 mb-4">Statistics</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border-2 border-duo-gray p-4 rounded-2xl flex items-center gap-4"><Flame className="w-8 h-8 text-[#FF9600] fill-[#FF9600]" /><div><div className="text-lg font-black">{profile.current_streak}</div><div className="text-xs font-bold text-gray-400 uppercase">Day streak</div></div></div>
        <div className="border-2 border-duo-gray p-4 rounded-2xl flex items-center gap-4"><Zap className="w-8 h-8 text-[#FFC800] fill-[#FFC800]" /><div><div className="text-lg font-black">{profile.total_xp}</div><div className="text-xs font-bold text-gray-400 uppercase">Total XP</div></div></div>
        <div className="border-2 border-duo-gray p-4 rounded-2xl flex items-center gap-4"><Shield className="w-8 h-8 text-[#1CB0F6] fill-[#1CB0F6]" /><div><div className="text-lg font-black">Diamond</div><div className="text-xs font-bold text-gray-400 uppercase">Current League</div></div></div>
        <div className="border-2 border-duo-gray p-4 rounded-2xl flex items-center gap-4"><Heart className="w-8 h-8 text-duo-red fill-duo-red" /><div><div className="text-lg font-black">{profile.hearts} / 5</div><div className="text-xs font-bold text-gray-400 uppercase">Hearts</div></div></div>
      </div>

      <h2 className="text-xl font-black mb-4">Achievements</h2>
      <div className="flex flex-col gap-4">
        {achievements.map((ach, idx) => {
          const Icon = ach.icon;
          return (
            <div key={idx} className={`border-2 p-4 rounded-2xl flex items-center gap-4 transition-all ${ach.unlocked ? "border-duo-gray" : "border-gray-200 opacity-50 grayscale"}`}>
              <div className={`p-3 rounded-full ${ach.bg}`}><Icon className={`w-8 h-8 ${ach.color}`} /></div>
              <div className="flex-1">
                <h3 className="font-black text-gray-700">{ach.title}</h3>
                <p className="text-sm font-bold text-gray-400">{ach.desc}</p>
              </div>
              {ach.unlocked && <Award className="w-6 h-6 text-[#FFC800] fill-[#FFC800]" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
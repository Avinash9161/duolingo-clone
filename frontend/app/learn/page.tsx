"use client";
import { useEffect, useState } from "react";
import TopHeader from "@/components/TopHeader";
import PathNode from "@/components/PathNode";
import { fetchPath, fetchProfile } from "@/lib/api";

export default function LearnPage() {
  const [profile, setProfile] = useState<any>(null);
  const [pathUnits, setPathUnits] = useState<any[]>([]);

  const loadData = async () => {
    const prof = await fetchProfile();
    const path = await fetchPath();
    setProfile(prof);
    setPathUnits(path);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!profile) return <div className="p-8 font-bold text-gray-400">Loading learning path...</div>;

  return (
    <div className="w-full flex flex-col items-center pb-20">
      <TopHeader
        streak={profile.current_streak}
        xp={profile.total_xp}
        hearts={profile.hearts}
        gems={profile.gems}
        onHeartRefill={loadData}
      />

      <div className="w-full max-w-xl px-4 mt-6">
        {pathUnits.map((unit) => (
          <div key={unit.id} className="mb-10">
            {/* Unit Header Card */}
            <div className="bg-[#58CC02] text-white p-5 rounded-2xl flex justify-between items-center mb-6 shadow-md">
              <div>
                <h2 className="text-xl font-black">{unit.title}</h2>
                <p className="text-sm font-semibold opacity-90">{unit.description}</p>
              </div>
            </div>

            {/* Path Nodes */}
            <div className="flex flex-col items-center">
              {unit.skills.map((skill: any, idx: number) => (
                <PathNode key={skill.id} skill={skill} offsetIndex={idx} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
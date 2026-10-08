const BASE_URL = "https://duolingo-clone-rja5.onrender.com/api";

export async function fetchProfile() {
  const res = await fetch(`${BASE_URL}/user/profile`, { cache: "no-store" });
  return res.json();
}

export async function fetchPath() {
  const res = await fetch(`${BASE_URL}/path`, { cache: "no-store" });
  return res.json();
}

export async function fetchNextLesson(skillId: number) {
  const res = await fetch(`${BASE_URL}/skills/${skillId}/next-lesson`, { cache: "no-store" });
  return res.json();
}

export async function completeLesson(lessonId: number) {
  const res = await fetch(`${BASE_URL}/lessons/${lessonId}/complete`, {
    method: "POST",
  });
  return res.json();
}

export async function decrementHeart() {
  const res = await fetch(`${BASE_URL}/user/decrement-heart`, {
    method: "POST",
  });
  return res.json();
}

export async function refillHearts() {
  const res = await fetch(`${BASE_URL}/user/refill-hearts`, {
    method: "POST",
  });
  return res.json();
}

export async function fetchLeaderboard() {
  const res = await fetch(`${BASE_URL}/leaderboard`, { cache: "no-store" });
  return res.json();
}

export async function simulateDay() {
  const res = await fetch(`${BASE_URL}/user/simulate-day`, {
    method: "POST",
  });
  return res.json();
}
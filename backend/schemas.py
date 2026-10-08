from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class ExerciseOut(BaseModel):
    id: int
    type: str
    prompt: str
    question: str
    options: Optional[List[str]] = None
    correct_answer: str
    pairs: Optional[Any] = None

    class Config:
        from_attributes = True

class LessonOut(BaseModel):
    id: int
    skill_id: int
    order: int
    xp_reward: int
    exercises: List[ExerciseOut]

    class Config:
        from_attributes = True

class SkillOut(BaseModel):
    id: int
    title: str
    order: int
    total_lessons: int
    completed_lessons: int
    status: str # "COMPLETED", "ACTIVE", "LOCKED"

class UnitOut(BaseModel):
    id: int
    title: str
    description: str
    order: int
    skills: List[SkillOut]

class UserProfile(BaseModel):
    id: int
    username: str
    total_xp: int
    current_streak: int
    hearts: int
    gems: int
    last_active_date: datetime

    class Config:
        from_attributes = True
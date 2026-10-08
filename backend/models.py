from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    total_xp = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    hearts = Column(Integer, default=5)
    gems = Column(Integer, default=500)
    last_active_date = Column(DateTime, default=datetime.utcnow)
    last_heart_refill = Column(DateTime, default=datetime.utcnow)

class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    order = Column(Integer)
    skills = relationship("Skill", back_populates="unit", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"))
    title = Column(String)
    order = Column(Integer)
    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    order = Column(Integer)
    xp_reward = Column(Integer, default=15)
    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    type = Column(String) # MULTIPLE_CHOICE, TRANSLATE, MATCH_PAIRS, FILL_BLANK, TYPE_ANSWER
    prompt = Column(String)
    question = Column(String)
    options = Column(Text, nullable=True) # JSON list
    correct_answer = Column(String)
    pairs = Column(Text, nullable=True) # JSON string of pairs for MATCH_PAIRS
    lesson = relationship("Lesson", back_populates="exercises")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    completed_lessons = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
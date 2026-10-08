from typing import List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json
from datetime import datetime, date

from database import engine, get_db, Base
import models, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Duolingo Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_current_user(db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="Default user not found. Run seed.py")
    return user

@app.get("/api/user/profile", response_model=schemas.UserProfile)
def get_user_profile(user: models.User = Depends(get_current_user)):
    return user

@app.post("/api/user/refill-hearts")
def refill_hearts(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    user.hearts = 5
    db.commit()
    return {"message": "Hearts refilled", "hearts": 5}

@app.post("/api/user/decrement-heart")
def decrement_heart(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    if user.hearts > 0:
        user.hearts -= 1
        db.commit()
    return {"hearts": user.hearts}

@app.get("/api/path", response_model=List[schemas.UnitOut])
def get_path(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    units = db.query(models.Unit).order_by(models.Unit.order).all()
    user_progress_map = {
        up.skill_id: up for up in db.query(models.UserProgress).filter(models.UserProgress.user_id == user.id).all()
    }

    result = []
    has_found_active = False

    for unit in units:
        skills = db.query(models.Skill).filter(models.Skill.unit_id == unit.id).order_by(models.Skill.order).all()
        skills_out = []
        
        for skill in skills:
            total_lessons = db.query(models.Lesson).filter(models.Lesson.skill_id == skill.id).count()
            progress = user_progress_map.get(skill.id)
            completed_lessons = progress.completed_lessons if progress else 0
            
            if completed_lessons >= total_lessons and total_lessons > 0:
                status = "COMPLETED"
            elif not has_found_active:
                status = "ACTIVE"
                has_found_active = True
            else:
                status = "LOCKED"

            skills_out.append(
                schemas.SkillOut(
                    id=skill.id,
                    title=skill.title,
                    order=skill.order,
                    total_lessons=total_lessons,
                    completed_lessons=completed_lessons,
                    status=status
                )
            )

        result.append(
            schemas.UnitOut(
                id=unit.id,
                title=unit.title,
                description=unit.description,
                order=unit.order,
                skills=skills_out
            )
        )

    return result

@app.get("/api/skills/{skill_id}/next-lesson", response_model=schemas.LessonOut)
def get_next_lesson(skill_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == user.id,
        models.UserProgress.skill_id == skill_id
    ).first()
    
    completed = progress.completed_lessons if progress else 0
    lesson = db.query(models.Lesson).filter(
        models.Lesson.skill_id == skill_id
    ).order_by(models.Lesson.order).offset(completed).first()

    if not lesson:
        # Loop to first lesson for replayability if all are completed
        lesson = db.query(models.Lesson).filter(models.Lesson.skill_id == skill_id).first()
        if not lesson:
            raise HTTPException(status_code=404, detail="No lessons found")

    exercises = db.query(models.Exercise).filter(models.Exercise.lesson_id == lesson.id).all()
    formatted_exercises = []
    
    for ex in exercises:
        formatted_exercises.append(
            schemas.ExerciseOut(
                id=ex.id,
                type=ex.type,
                prompt=ex.prompt,
                question=ex.question,
                options=json.loads(ex.options) if ex.options else None,
                correct_answer=ex.correct_answer,
                pairs=json.loads(ex.pairs) if ex.pairs else None
            )
        )

    return schemas.LessonOut(
        id=lesson.id,
        skill_id=lesson.skill_id,
        order=lesson.order,
        xp_reward=lesson.xp_reward,
        exercises=formatted_exercises
    )

@app.post("/api/lessons/{lesson_id}/complete")
def complete_lesson(lesson_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Update progress
    progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == user.id,
        models.UserProgress.skill_id == lesson.skill_id
    ).first()

    total_lessons = db.query(models.Lesson).filter(models.Lesson.skill_id == lesson.skill_id).count()

    if not progress:
        progress = models.UserProgress(
            user_id=user.id,
            skill_id=lesson.skill_id,
            completed_lessons=1,
            is_completed=(1 >= total_lessons)
        )
        db.add(progress)
    else:
        if progress.completed_lessons < total_lessons:
            progress.completed_lessons += 1
            if progress.completed_lessons >= total_lessons:
                progress.is_completed = True

    # Gamification: XP & Streak calculation
    today = date.today()
    last_active = user.last_active_date.date() if user.last_active_date else None

    if last_active != today:
        if last_active and (today - last_active).days == 1:
            user.current_streak += 1
        elif last_active and (today - last_active).days > 1:
            user.current_streak = 1
        else:
            user.current_streak = max(1, user.current_streak)
        user.last_active_date = datetime.utcnow()

    user.total_xp += lesson.xp_reward
    user.gems += 10
    db.commit()

    return {
        "status": "success",
        "xp_earned": lesson.xp_reward,
        "total_xp": user.total_xp,
        "current_streak": user.current_streak,
        "completed_lessons": progress.completed_lessons
    }

@app.get("/api/leaderboard")
def get_leaderboard(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    users = db.query(models.User).order_by(models.User.total_xp.desc()).all()
    board = []
    for rank, u in enumerate(users, 1):
        board.append({
            "rank": rank,
            "username": u.username,
            "xp": u.total_xp,
            "is_current_user": u.id == user.id
        })
    return board
from datetime import timedelta

@app.post("/api/user/simulate-day")
def simulate_day(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    # Pushes the last active date back 1 day to simulate time passing for the streak
    if user.last_active_date:
        user.last_active_date = user.last_active_date - timedelta(days=1)
        db.commit()
    return {"status": "success", "message": "Simulated one day passing"}
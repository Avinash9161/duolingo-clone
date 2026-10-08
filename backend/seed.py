import json
from database import SessionLocal, engine, Base
import models

def seed():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed User
    # Seed Main User & Competitors
    user = models.User(id=1, username="Avinash", total_xp=140, current_streak=3, hearts=5, gems=500)
    bot1 = models.User(id=2, username="DuoOwl_Master", total_xp=2450, current_streak=12, hearts=5)
    bot2 = models.User(id=3, username="PolyglotPro", total_xp=980, current_streak=5, hearts=5)
    bot3 = models.User(id=4, username="HolaAmigo", total_xp=610, current_streak=2, hearts=5)
    db.add_all([user, bot1, bot2, bot3])

    # Unit 1
    unit1 = models.Unit(title="Unit 1", description="Introduce yourself & order food", order=1)
    db.add(unit1)
    db.flush()

    skill1 = models.Skill(unit_id=unit1.id, title="Basics 1", order=1)
    skill2 = models.Skill(unit_id=unit1.id, title="Greetings", order=2)
    db.add_all([skill1, skill2])
    db.flush()

    # Lesson 1 for Skill 1 (1 Lesson total for quick unlocking)
    lesson1 = models.Lesson(skill_id=skill1.id, order=1, xp_reward=15)
    db.add(lesson1)
    db.flush()

    # Exercises for Lesson 1 (Covering all 5 required types)
    ex1 = models.Exercise(lesson_id=lesson1.id, type="MULTIPLE_CHOICE", prompt="Select the correct translation", question="The boy", options=json.dumps(["El niño", "La niña", "La manzana", "El agua"]), correct_answer="El niño")
    ex2 = models.Exercise(lesson_id=lesson1.id, type="TRANSLATE", prompt="Translate this sentence", question="I am a boy", options=json.dumps(["Yo", "soy", "un", "niño", "la", "manzana", "pan"]), correct_answer="Yo soy un niño")
    ex3 = models.Exercise(lesson_id=lesson1.id, type="MATCH_PAIRS", prompt="Tap the matching pairs", question="Match the Spanish and English pairs", options=None, correct_answer="", pairs=json.dumps([{"left": "Boy", "right": "Niño"}, {"left": "Girl", "right": "Niña"}, {"left": "Apple", "right": "Manzana"}, {"left": "Water", "right": "Agua"}]))
    ex4 = models.Exercise(lesson_id=lesson1.id, type="FILL_BLANK", prompt="Fill in the missing word", question="Ella ___ una mujer.", options=json.dumps(["es", "son", "somos"]), correct_answer="es")
    ex5 = models.Exercise(lesson_id=lesson1.id, type="TYPE_ANSWER", prompt="Type in Spanish", question="Apple", options=None, correct_answer="manzana")
    db.add_all([ex1, ex2, ex3, ex4, ex5])

    # Lesson 1 for Skill 2 (Greetings)
    lesson3 = models.Lesson(skill_id=skill2.id, order=1, xp_reward=15)
    db.add(lesson3)
    db.flush()

    ex6 = models.Exercise(lesson_id=lesson3.id, type="MULTIPLE_CHOICE", prompt="Translate this greeting", question="Hello", options=json.dumps(["Hola", "Adiós", "Gracias", "Por favor"]), correct_answer="Hola")
    db.add(ex6)

    # Reset Progress to 0 so the user starts fresh on Lesson 1
    user_prog = models.UserProgress(user_id=user.id, skill_id=skill1.id, completed_lessons=0, is_completed=False)
    db.add(user_prog)

    db.commit()
    db.close()
    print("Database seeded successfully! Progression is fixed.")

if __name__ == "__main__":
    seed()
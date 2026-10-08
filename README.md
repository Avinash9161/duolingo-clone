# Duolingo Web App Clone

A fullstack web application reproducing Duolingo's core learning path, gamification loop, and signature interactive exercise mechanics.

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Python FastAPI, SQLAlchemy, SQLite
- **Database**: SQLite (`duolingo.db`)

## Features Implemented
- **Learning Path**: Dynamic zig-zag unit and skill progression with progress rings and lock/unlock states.
- **Lesson Player Loop**:
  - Multiple Choice
  - Translate (Interactive Word Bank)
  - Match Pairs
  - Fill in the Blank
  - Type the Answer
- **Gamification Mechanics**: Real-time heart depletion, heart refill simulation, daily XP tracking, streak increment logic, and Diamond leaderboard.
- **Duolingo Look & Feel**: Signature 3D buttons, celebration confetti, bottom animated verification tray.

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload --port 8000
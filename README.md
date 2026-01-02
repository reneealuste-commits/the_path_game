# The Path - Leadership Training Game

A mobile-first leadership training app inspired by Jocko Willink's teachings. Think Duolingo for real-world power plays.

## Features

- **Daily Leadership Quests**: One crisp leadership tactic delivered each day
- **Audio Lessons**: Short, powerful audio lessons (Jocko voice simulation)
- **Voice Debriefs**: Record your mission outcomes (up to 45 seconds)
- **AI Evaluation**: Get scored on Discipline, Strategy, and Communication
- **Gamification**: Streaks, medals, badges, and global rankings
- **Week-based Progression**: 15 weeks, 5 phases, unlocking new quests each week
- **Streak Protection**: Miss a day? Watch the "GOOD" video and start over

## Phase Structure

### Phase I: THE FOUNDATION
- **Week 1**: Detach (7 days)
- More quests coming soon...

## Tech Stack

- **Frontend**: Vue 3 + Vite + Pinia + Vue Router
- **UI**: Mobile-first responsive design
- **Audio**: Web Audio API with MediaRecorder
- **Animations**: Canvas Confetti
- **Backend API**: Express.js (for AI evaluation)

## Development

### Prerequisites
- Bun (or Node.js)

### Installation

```bash
bun install
```

### Running the App

Start both the API server and Vite dev server:

```bash
bun start
```

Or run them separately:

```bash
# Terminal 1 - API Server
bun run api

# Terminal 2 - Vite Dev Server
bun run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
bun run build
```

## How It Works

1. **Profile Setup**: Enter your name to begin
2. **Quest Unlocked**: Each week unlocks a new quest
3. **Audio Lesson**: Listen to a 15-second tactical lesson
4. **Mission Brief**: Get your real-world assignment
5. **Debrief**: Record your outcome via microphone
6. **AI Evaluation**: Receive scores and medals
7. **Repeat**: Complete the same tactic for 7 days
8. **Streak Management**: Miss a day, restart from Day 1

## Streak Break Flow

If you miss a day:
1. See "GOOD" message from Jocko
2. Watch motivational YouTube video
3. View "MISSION FAILED" screen
4. Reset to Day 1 with streak at 0

## API Endpoints

### POST `/api/evaluate`
Evaluate audio debrief and return scores.

**Request**: `multipart/form-data` with audio file

**Response**:
```json
{
  "success": true,
  "evaluation": {
    "discipline": 85,
    "strategy": 78,
    "communication": 92,
    "overall": 85
  }
}
```

## Future Enhancements

- [ ] Actual Jocko Willink voice cloning integration
- [ ] Fine-tuned Llama 3.2 3b for AI evaluation
- [ ] All 15 weeks of quests (5 phases)
- [ ] Social features and leaderboards
- [ ] Push notifications for daily reminders
- [ ] Progressive Web App (PWA) with offline support
- [ ] Real audio files for each quest lesson

## Storage

The app uses `localStorage` to persist:
- User profile
- Quest progress
- Streak data
- Medals and badges
- Week unlock timestamps

## Mobile Optimization

- Touch-optimized UI
- Mobile-first responsive design
- PWA-ready with safe area support
- Optimized for one-handed use
- No pull-to-refresh conflicts

## License

MIT

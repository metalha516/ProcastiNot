# ProcastiNot (OmniFocus / StudyForge)

> **Intelligent, Anti-Distraction Student Productivity & Focus Platform**  
> *Engineered with Google Stitch Design Aesthetics (`#121316` / `#191a1f`), Circadian Energy Alignment, Real-Time Peer Accountability, 40 Hz Gamma Wave Neural Entrainment, and Streak-Based Gamification.*

---

## 🌟 Key Pillars & Feature Architecture

### 1. Focus Execution & Anti-Distraction Engine
- **Configurable Pomodoro Timer**:
  - Presets: Classic Pomodoro (25/5), Deep Work Sprint (50/10), Ultra Flow (90/15), and Custom intervals.
  - Cross-tab reactive synchronization using browser `BroadcastChannel`.
  - Live ticking status reflected in `document.title` (e.g. `(24:45) 🧠 Deep Focus | ProcastiNot`).
- **40 Hz Gamma Wave Neural Entrainment Engine**:
  - **Binaural Beats Mode**: Synthesizes 216 Hz carrier (Left) and 256 Hz carrier (Right) for a perceptual 40 Hz difference frequency in stereo headphones.
  - **Isochronic Pulses Mode**: 40 Hz amplitude-modulated carrier tone suitable for laptop and desk speakers.
  - **Layerable Focus Soundscapes**: Pure Gamma, Rain Shower, Pink Noise, Brown Noise, and Study Cafe ambiance.
  - Synthesized warm chimes for session start, session finish, and mindfulness reflection.
- **Website Blocker + "Second Thought" Doom-Scrolling Friction Modal**:
  - Intercepts non-productive domains (`instagram.com`, `tiktok.com`, `youtube.com`, `reddit.com`, `x.com`, etc.).
  - **Interactive Interceptor Sandbox**: Allows instant real-time simulation and testing of domain blocks.
  - Full-screen **Second Thought Intervention**:
    - 10-second box-breathing cycle (*Inhale... Hold... Exhale*) to arrest dopamine loop reflex.
    - Reflex trigger query (*Muscle memory / Boredom / Brain fatigue / Urgent search*).
    - One-click *"Return to Deep Work"* rewarding **+35 Focus Points** and logging preserved minutes.

### 2. Intelligent Circadian Planning & AI Study Agendas
- **Circadian / Energy-Based Task Organizer**:
  - Chronotype configuration: **Early Bird** (06:00–12:00 peak), **Bimodal Flow** (12:00–18:00 peak), **Night Owl** (21:00–03:00 peak).
  - Dynamic 24-hour visual biological alertness curve with live hour pin and bio-alertness score (0–100%).
  - Tasks tagged by cognitive load (`deep_focus`, `medium`, `low`) and difficulty (`easy`, `medium`, `hard`, `epic`).
  - Automatic energy mismatch warnings when high-cognitive proofs or algorithms are scheduled during biological troughs.
- **AI Study Runway & Syllabus Rebalancer**:
  - Ingests exam dates, syllabus modules, and daily available study runway hours.
  - Dynamically computes required daily focus quotas (e.g. 90 mins/day) and rebalances agenda when topics are cleared.
  - Generates spaced repetition roadmap and 40 Hz sprint schedules.
- **Exam Countdown & Deadline Cards**:
  - Live ticking countdowns to the second (Days, Hours, Minutes, Seconds).
  - Interactive syllabus completion checklist with 1-click runway rebalancing.

### 3. Social Accountability & Peer Co-working
- **Virtual Focus Rooms**:
  - Live multiplayer study rooms (*Stanford Gates Quiet Lab*, *Midnight STEM Cramming Sanctum*, *Rainy Day Lo-Fi Library*).
  - Peer focus tiles with live focus status (*Deep Work, Focusing, Short Break*), current task, remaining time, and streak badges.
  - Distraction-free audio presence and peer shoutouts/cheers (*🚀 Deep Work Mode, 🔥 Keep the streak alive!*).
- **Group Study Arena & Peer Leaderboard**:
  - Live ranking with institutional representation (MIT, Stanford, Berkeley, CMU).
  - Comparative benchmark bar graph measuring personal weekly output against group/cohort averages.

### 4. Gamification, Consistency Heatmap & Delta Curves
- **Focus-Hour Reward Points (FP)**:
  - Earn points proportionally to verified deep work minutes and resisted distraction attempts.
  - **Reward Shop**: Redeem FP for custom interface themes (*Google Stitch Dark*, *Cyberpunk Neon*, *Obsidian Emerald*, *Solar Flare Gold*) and status badges.
- **365-Day Consistency Heatmap**:
  - GitHub / Codeforces-style square activity matrix with 5 intensity levels, hover stats, and Streak Freeze shields.
- **Daily Performance Delta Curve**:
  - Interactive spline chart tracking day-over-day focus efficiency deltas.
  - Formula: `Efficiency = (Focus Mins × 0.5) + (Tasks × 10) - (Distractions × 15)`.

---

## 💻 Tech Stack
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Custom Stitch Design Tokens (`#121316` base, `#191a1f` surface, glowing borders)
- **Icons**: Lucide React
- **Audio Engine**: Native Web Audio API (Oscillators, Biquad Filters, Channel Merger, Audio Buffers)
- **Animations & Effects**: Canvas Confetti, CSS Transitions, Glassmorphism Backdrop Blur
- **State Management**: Reactive React Contexts + LocalStorage persistence + `BroadcastChannel` multi-tab sync

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run
```bash
# Clone repository
git clone https://github.com/metalha516/ProcastiNot.git
cd ProcastiNot

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🎨 UI Reference & Design Tokens
Built following the **Google Stitch Design System** (Project Reference `1507620726274103179`):
- Deep Charcoal Background: `#121316`
- Surface & Card Background: `#191a1f` / `#1e2025`
- Primary Accents: Electric Violet (`#8B5CF6`) & Cyan (`#06B6D4`)
- Subtle Border Highlights: `rgba(255, 255, 255, 0.08)`

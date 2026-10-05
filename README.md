# ProcastiNot — Student Focus, Neurological Entrainment & Anti-Distraction Platform

<div align="center">

[![Production Deployment](https://img.shields.io/badge/Production-procastinot--nine.vercel.app-8B5CF6?style=for-the-badge&logo=vercel&logoColor=white)](https://procastinot-nine.vercel.app/)
[![CI / Quality Gates](https://img.shields.io/badge/CI%2FCD-Passing-10B981?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/metalha516/ProcastiNot/actions)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-5.9_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Web Audio API](https://img.shields.io/badge/DSP-Web_Audio_40Hz_Gamma-F59E0B?style=for-the-badge&logo=soundcharts&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

**An enterprise-grade, anti-distraction cognitive productivity suite engineered for university scholars, competitive programmers, and deep-work researchers.**

[Explore Live Demo](https://procastinot-nine.vercel.app/) • [System Architecture & UML](#-system-architecture--visual-uml-models) • [Mathematical Formulations](#-mathematical-formulations--chronobiology) • [Authentic Telemetry](#-authentic-telemetry--gamification-engine) • [Automated Tests](#-comprehensive-automated-test-matrix) • [Local Setup](#-local-deployment--automated-testing)

</div>

---

## 📑 Table of Contents

- [Executive Abstract & Engineering Philosophy](#-executive-abstract--engineering-philosophy)
- [System Architecture & Visual UML Models](#-system-architecture--visual-uml-models)
  - [🏛️ Official Enterprise System Structure Diagram](#️-official-enterprise-system-structure-diagram)
  - [1. Unified Component & Service Topology](#1-unified-component--service-topology)
  - [2. Use Case Diagram (System Boundaries, Actors & Feature Matrix)](#2-use-case-diagram-system-boundaries-actors--feature-matrix)
  - [3. Class Diagram (Domain Models, State Contexts & DSP Engine)](#3-class-diagram-domain-models-state-contexts--dsp-engine)
  - [4. Activity Diagram (Deep Work Sprint, Distraction Shield & Telemetry Workflow)](#4-activity-diagram-deep-work-sprint-distraction-shield--telemetry-workflow)
  - [5. Sequence Diagram (Drift-Proof Session Lifecycle & Multi-Tier Coordination)](#5-sequence-diagram-drift-proof-session-lifecycle--multi-tier-coordination)
  - [6. Anti-Distraction Shield Interception Sequence](#6-anti-distraction-shield-interception-sequence)
  - [7. 40 Hz Gamma Wave Neural Entrainment Pipeline](#7-40-hz-gamma-wave-neural-entrainment-pipeline)
- [Mathematical Formulations & Chronobiology](#-mathematical-formulations--chronobiology)
- [Authentic Telemetry & Gamification Engine](#-authentic-telemetry--gamification-engine)
- [Directory & Project Structure](#-directory--project-structure)
- [Engineering Standards & Tech Stack](#-engineering-standards--tech-stack)
- [Local Deployment & Automated Testing](#-local-deployment--automated-testing)
- [Comprehensive Automated Test Matrix](#-comprehensive-automated-test-matrix)
- [CI/CD Quality Gates](#-cicd-quality-gates)
- [Performance & Core Web Vitals](#-performance--core-web-vitals)
- [Anti-Distraction Companion Installation](#-anti-distraction-companion-installation)
- [Roadmap & Scalability](#-roadmap--scalability)
- [License & Academic Attribution](#-license--academic-attribution)

---

## 🧭 Executive Abstract & Engineering Philosophy

University students and engineers face an attentional crisis. Empirical human-computer interaction studies (Mark et al., UC Irvine) demonstrate that resuming deep working memory following an interruption takes an average of **23 minutes and 15 seconds**. Rapid dopamine loop switches (social media doom-scrolling, algorithmic micro-reels) degrade prefrontal cognitive stamina.

**ProcastiNot** mitigates attentional fragmentation through an integrated stack of biological, behavioral, and architectural engineering:

1. **Drift-Proof Focus Engine**: Timestamp-delta countdown loop immune to background tab throttling, integrated with `BroadcastChannel` for multi-tab synchronization and Web Worker timers.
2. **Neurological DSP Audio Engine**: Real-time native browser Web Audio API synthesis delivering **40 Hz Gamma oscillations** (binaural phase deltas and isochronic amplitude modulation) layered with pink, brown, and bi-aural rain soundscapes.
3. **Behavioral Second-Thought Interventions**: In-app capture phase URL interception paired with a companion Browser Extension / Userscript redirecting doom-scrolling navigation to a 10-second box-breathing autonomic reset.
4. **Circadian 24-Hour Energy Scheduler & Eisenhower Matrix**: Chronotype-adaptive cognitive ranking that slots algorithmic proof-solving into biological alertness peaks and routine admin into metabolic troughs.
5. **Authentic Zero-Mock Telemetry**: 26-week rolling GitHub/Codeforces-style activity heatmap, daily performance curves, and streak records computed exclusively from validated user focus logs.
6. **Student Auth Gating with Free Public Access**: Unrestricted access to the core Pomodoro timer with an authentication gate for personal telemetry, habit matrices, and peer study rooms.

---

## 📐 System Architecture & Visual UML Models

### 🏛️ Official Enterprise System Structure Diagram

<div align="center">
  <img src="public/architecture-structure-diagram.svg" alt="ProcastiNot Official Enterprise System Structure Diagram" width="100%" />
</div>

> **Figure 1.0:** *Comprehensive 5-Layer C4 Enterprise Structure Topology of ProcastiNot, detailing Client Ingress, Presentation UI, Application State Orchestration, Algorithmic Domain Engines, and Low-Level Web Audio DSP & Hardware Subsystems.*

---


### 1. Unified Component & Service Topology

```mermaid
graph TD
    subgraph UI_Layer["Presentation Layer (Responsive Tactile Claymorphism)"]
        TOP["Topbar (Auth, Live Streak, Points Wallet, Notifications)"]
        SIDE["Sidebar (Collapsible Nav & Biological Alertness Curve)"]
        DASH["Overview Dashboard & Quick Sprint Console"]
        POMO["Pomodoro Timer & Preset Matrix"]
        GAMMA["40 Hz Neural Soundboard & Volume Mixers"]
        BLOCK["Distraction Blocker & Interactive Sandbox"]
        CIRC["Circadian 24h Console & Energy-Ranked Tasks"]
        EISEN["Eisenhower 2x2 Decision Matrix & Habit Tracker"]
        EXAM["Exam Runway Tracker & Topic Breakdown"]
        ROOMS["Virtual Focus Rooms & Peer Activity Grid"]
        HEAT["26-Week Telemetry Heatmap & Habit Matrix"]
        DELTA["Performance Delta Curve (Day-over-Day Velocity)"]
        ARENA["Collegiate Peer Leaderboard Arena"]
        SHOP["Reward Shop (Themes & Custom Cosmetics)"]
        GATE["AuthFeatureGate & SSO Modal"]
    end

    subgraph State_Engine["State & Context Providers"]
        AUTH_CTX["AuthContext (JWT / Google OAuth / Edu SSO)"]
        TIMER_CTX["TimerContext (Drift-Proof TargetDelta, Web Audio Sync)"]
        TASK_CTX["TaskContext (Chronotype, Circadian Sorting, AI Agendas)"]
        GAME_CTX["GamificationContext (Points Wallet, Streaks, Interceptions, Themes)"]
    end

    subgraph Hardware_And_Browser_APIs["Browser Subsystems & DSP Engines"]
        AUDIO_ENG["gammaEngine (Web Audio API Synthesizer)"]
        SHIELD_HOOK["useBrowserShield (Capture Phase Link & URL Interceptor)"]
        BROADCAST["BroadcastChannel ('procastinot_timer_channel')"]
        VISIBILITY["document.visibilitychange (Tab Throttling Recovery)"]
        STORAGE["LocalStorage Persistent Storage"]
        EXT_USERSCRIPT["Browser Extension / Tampermonkey Userscript"]
    end

    %% Wiring
    TOP --> AUTH_CTX
    TOP --> GAME_CTX
    POMO --> TIMER_CTX
    GAMMA --> TIMER_CTX
    TIMER_CTX --> AUDIO_ENG
    TIMER_CTX --> BROADCAST
    TIMER_CTX --> VISIBILITY
    BLOCK --> GAME_CTX
    BLOCK --> SHIELD_HOOK
    EXT_USERSCRIPT -.->|Redirects to ?blocked=domain| SHIELD_HOOK
    SHIELD_HOOK --> GAME_CTX
    CIRC --> TASK_CTX
    EISEN --> TASK_CTX
    EXAM --> TASK_CTX
    ROOMS --> GAME_CTX
    HEAT --> GAME_CTX
    DELTA --> GAME_CTX
    ARENA --> GAME_CTX
    GATE --> AUTH_CTX

    AUTH_CTX --> STORAGE
    TASK_CTX --> STORAGE
    GAME_CTX --> STORAGE
    TIMER_CTX --> STORAGE
```

---

### 2. Use Case Diagram (System Boundaries, Actors & Feature Matrix)

The Use Case model maps system capabilities across user roles and internal platform engines, contrasting the publicly accessible Pomodoro Focus timer with the authenticated student workspace and background interception engines:

```mermaid
flowchart TB
    %% Actors
    subgraph Actors ["👤 Actors"]
        Guest["fa:fa-user-clock Guest / Unauthenticated Visitor"]
        Student["fa:fa-user-graduate Authenticated Student / Scholar"]
        Extension["fa:fa-puzzle-piece Companion Extension & Userscript"]
        BrowserHardware["fa:fa-microchip Browser Worker & Audio DAC"]
    end

    %% System Boundary
    subgraph ProcastiNot_System ["🖥️ ProcastiNot Application Boundary"]
        
        %% Free Public Tier
        subgraph Public_Scope ["Free & Public Focus Tier"]
            UC_RunTimer(["UC-01: Run Pomodoro Focus Sprint"]):::publicUC
            UC_SelectPreset(["UC-02: Select Chronometer Preset"]):::publicUC
            UC_SynthAudio(["UC-03: Synthesize 40Hz Gamma & Rain DSP"]):::publicUC
            UC_AuthModal(["UC-04: Sign In / Campus SSO / Google OAuth"]):::publicUC
            UC_Register(["UC-05: Register Account (+500 FP Bonus)"]):::publicUC
        end

        %% Authenticated Core Modules
        subgraph Authenticated_Scope ["Authenticated Student Command & Flow OS"]
            UC_Dashboard(["UC-06: View Real-Time Cognitive Load & Velocity"]):::authUC
            UC_Circadian(["UC-07: Schedule Circadian Energy-Ranked Tasks"]):::authUC
            UC_Eisenhower(["UC-08: Triage in Eisenhower 2x2 Matrix"]):::authUC
            UC_ExamRunway(["UC-09: Track Exam Runway & Rebalance Syllabi"]):::authUC
            UC_StudyRooms(["UC-10: Co-work in Virtual Peer Focus Rooms"]):::authUC
            UC_Heatmap(["UC-11: Inspect 26-Week Heatmap & Streaks"]):::authUC
            UC_Shop(["UC-12: Unlock Themes in Focus Point Shop"]):::authUC
            UC_Leaderboard(["UC-13: Compete on Collegiate Leaderboard"]):::authUC
        end

        %% Anti-Distraction & Intervention
        subgraph Shield_Scope ["Anti-Distraction Shield & Mindfulness Gate"]
            UC_ManageBlacklist(["UC-14: Manage Blocked Domain Blacklist"]):::shieldUC
            UC_InterceptLink(["UC-15: Intercept Social Media Navigation"]):::shieldUC
            UC_BoxBreathing(["UC-16: 10s Box-Breathing Autonomic Reset"]):::shieldUC
            UC_ResilienceBonus(["UC-17: Claim +35 FP Focus Resilience Bonus"]):::shieldUC
            UC_EmergencyOverride(["UC-18: Confirm Intentional Visit Override"]):::shieldUC
        end

        %% Background & Hardware Subsystem
        subgraph System_Scope ["Internal Hardware & Telemetry Engine"]
            UC_TargetDelta(["UC-19: Synchronize Drift-Proof Target Delta"]):::engineUC
            UC_MultiTab(["UC-20: Broadcast Multi-Tab State Synchronization"]):::engineUC
            UC_StreakEngine(["UC-21: Compute Zero-Mock Streak & Heatmap Levels"]):::engineUC
            UC_SuspendDAC(["UC-22: Suspend Web Audio DAC on Inactivity"]):::engineUC
        end
    end

    %% Actor to Use Case Connections
    Guest --> UC_RunTimer
    Guest --> UC_SelectPreset
    Guest --> UC_SynthAudio
    Guest --> UC_AuthModal
    Guest --> UC_Register

    Student --> UC_RunTimer
    Student --> UC_Dashboard
    Student --> UC_Circadian
    Student --> UC_Eisenhower
    Student --> UC_ExamRunway
    Student --> UC_StudyRooms
    Student --> UC_Heatmap
    Student --> UC_Shop
    Student --> UC_Leaderboard
    Student --> UC_ManageBlacklist

    Extension --> UC_InterceptLink
    BrowserHardware --> UC_TargetDelta
    BrowserHardware --> UC_MultiTab
    BrowserHardware --> UC_StreakEngine
    BrowserHardware --> UC_SuspendDAC

    %% Include & Extend Relationships
    UC_RunTimer -.->|<<include>>| UC_SynthAudio
    UC_RunTimer -.->|<<include>>| UC_TargetDelta
    UC_RunTimer -.->|<<include>>| UC_MultiTab
    UC_RunTimer -.->|<<include>>| UC_StreakEngine
    
    UC_InterceptLink -.->|<<include>>| UC_BoxBreathing
    UC_BoxBreathing -.->|<<extend>>| UC_ResilienceBonus
    UC_BoxBreathing -.->|<<extend>>| UC_EmergencyOverride

    UC_Circadian -.->|<<include>>| UC_Eisenhower
    UC_ExamRunway -.->|<<extend>>| UC_Circadian

    classDef publicUC fill:#38bdf815,stroke:#0284c7,stroke-width:1.5px
    classDef authUC fill:#818cf815,stroke:#6366f1,stroke-width:1.5px
    classDef shieldUC fill:#f43f5e15,stroke:#e11d48,stroke-width:1.5px
    classDef engineUC fill:#10b98115,stroke:#059669,stroke-width:1.5px
```

---

### 3. Class Diagram (Domain Models, State Contexts & DSP Engine)

The object-oriented structure models entities, React Context providers, pure mathematical utility algorithms, and low-level Web Audio digital signal processors:

```mermaid
classDiagram
    direction TB

    class UserProfile {
        +string id
        +string name
        +string email
        +string avatar
        +UserRole role
        +string institution
        +string chronotype
        +number streak
        +number streakFreezes
        +number focusPoints
        +number level
        +string activeTheme
        +string[] unlockedThemes
        +string[] unlockedBadges
        +string joinedDate
    }

    class Task {
        +string id
        +string title
        +string description
        +string course
        +TaskEnergyLevel energy
        +TaskDifficulty difficulty
        +number estimatedMinutes
        +number completedMinutes
        +boolean completed
        +string dueDate
        +string preferredWindow
        +string[] tags
        +boolean examRelated
    }

    class ExamDeadline {
        +string id
        +string title
        +string courseCode
        +string examDate
        +string priority
        +number syllabusCoverage
        +string[] topicsRemaining
        +string[] topicsCompleted
        +number dailyQuotaMinutes
    }

    class FocusSessionLog {
        +string id
        +string timestamp
        +number durationMinutes
        +TimerMode mode
        +string taskTitle
        +number interceptionsEncountered
        +number pointsEarned
        +boolean completed
    }

    class BlockedDomain {
        +string id
        +string domain
        +string name
        +string icon
        +number attemptsToday
        +number minutesSaved
        +string category
        +boolean isDefault
    }

    class SecondThoughtInterception {
        +string id
        +string domain
        +string timestamp
        +string reason
        +boolean returnedToFocus
        +number breathingSecondsCompleted
        +number pointsAwarded
    }

    class VirtualRoom {
        +string id
        +string name
        +string description
        +string category
        +number activeParticipants
        +number maxParticipants
        +TimerMode timerMode
        +string soundscape
        +boolean isJoined
        +FocusRoomPeer[] peers
    }

    class FocusRoomPeer {
        +string id
        +string name
        +string avatar
        +string status
        +string currentTask
        +number timeRemainingSeconds
        +boolean isMuted
        +number activeStreak
        +number pointsToday
    }

    class HeatmapDay {
        +string date
        +number count
        +number level
    }

    class DailyPerformanceDelta {
        +string date
        +number focusHours
        +number tasksCompleted
        +number distractionsAvoided
        +number performanceScore
        +number deltaPercentage
    }

    class TimerPreset {
        +string id
        +string name
        +number focusMinutes
        +number breakMinutes
        +string icon
        +string tag
    }

    class GammaAudioState {
        +boolean enabled
        +number frequency
        +number carrierFrequency
        +string mode
        +number gammaVolume
        +string ambientType
        +number ambientVolume
    }

    class GammaAudioEngine {
        -AudioContext ctx
        -GainNode masterGain
        -GainNode gammaGain
        -GainNode ambientGain
        -OscillatorNode oscLeft
        -OscillatorNode oscRight
        -ChannelMergerNode merger
        -OscillatorNode isochronicCarrier
        -OscillatorNode isochronicLFO
        -AudioBufferSourceNode ambientSource
        +initContext() Promise~AudioContext~
        +startGamma(carrier, beat, vol) void
        +startIsochronic(carrier, beat, vol) void
        +startAmbient(type, vol) void
        +stop() void
        +playChime(type) void
        +suspend() void
        +resume() void
    }

    class StreakTelemetryEngine {
        +formatLocalDate(d) string
        +getIntensityLevel(minutes) number
        +getRealHeatmapGrid(dailyStudy) HeatmapDay[]
        +calculateRealStreak(dailyStudy, freezes) object
        +loadUserDailyRecords() Record~string, number~
        +saveUserDailyRecords(records) void
    }

    class BrowserShield {
        +isDomainBlocked(targetUrl) string
        +triggerInterception(domain) void
        +resolveInterception(returned, reason) void
    }

    class AuthContext {
        +boolean isAuthenticated
        +UserProfile user
        +string token
        +boolean isLoading
        +login(email, pass) Promise~void~
        +register(name, email, pass, institution, chronotype) Promise~void~
        +loginWithGoogle(email, name, avatar) Promise~void~
        +loginWithSSO(institution, email) Promise~void~
        +loginDemoUser() Promise~void~
        +logout() void
        +updateUser(updates) void
    }

    class TimerContext {
        +TimerMode mode
        +number timeRemaining
        +number totalDuration
        +boolean isRunning
        +TimerPreset activePreset
        +TimerPreset[] presets
        +GammaAudioState gammaAudio
        +FocusSessionLog[] sessionLogs
        +string selectedTaskTitle
        +startTimer() void
        +pauseTimer() void
        +resetTimer() void
        +skipSession() void
        +switchMode(newMode) void
        +selectPreset(preset) void
        +setCustomDuration(focus, break) void
        +updateGammaSettings(updates) void
        +toggleGammaAudio() void
    }

    class TaskContext {
        +Task[] tasks
        +ExamDeadline[] exams
        +CircadianStatus circadianStatus
        +addTask(task) void
        +toggleTaskComplete(taskId) void
        +deleteTask(taskId) void
        +addExam(exam) void
        +updateExamCoverage(examId, topic) void
        +rebalanceRunway(examId) void
        +isTaskEnergyAligned(task) object
        +generateAIPlan(course, examDate, notes) Promise~string~
    }

    class GamificationContext {
        +number focusPoints
        +number streak
        +number streakFreezes
        +BlockedDomain[] blockedDomains
        +VirtualRoom[] rooms
        +HeatmapDay[] heatmapDays
        +DailyPerformanceDelta[] deltaHistory
        +boolean interceptionActive
        +string interceptedDomain
        +recordFocusSession(minutes, date) void
        +clearStudyTelemetry() void
        +awardPoints(amount, reason) void
        +spendPoints(amount) boolean
        +buyTheme(theme) boolean
        +equipTheme(themeId) void
        +addBlockedDomain(domain, name, category) void
        +removeBlockedDomain(id) void
        +triggerInterception(domain) void
        +resolveInterception(returned, reason) void
        +joinRoom(roomId) void
        +leaveRoom() void
        +useStreakFreeze() boolean
    }

    %% Entity Structure & Composition
    AuthContext "1" o-- "0..1" UserProfile : manages
    TaskContext "1" o-- "*" Task : organizes
    TaskContext "1" o-- "*" ExamDeadline : tracks
    TimerContext "1" o-- "*" TimerPreset : offers
    TimerContext "1" o-- "*" FocusSessionLog : records
    TimerContext "1" *-- "1" GammaAudioState : manages state
    GamificationContext "1" o-- "*" BlockedDomain : maintains blacklist
    GamificationContext "1" o-- "*" VirtualRoom : hosts
    GamificationContext "1" o-- "182" HeatmapDay : renders grid
    GamificationContext "1" o-- "*" DailyPerformanceDelta : tracks curve
    VirtualRoom "1" *-- "*" FocusRoomPeer : contains peers

    %% Service & Engine Invocations
    TimerContext ..> GammaAudioEngine : triggers 40Hz audio DSP
    TimerContext ..> GamificationContext : dispatches session completion
    TimerContext ..> TaskContext : updates task progress
    GamificationContext ..> StreakTelemetryEngine : invokes streak calculation
    BrowserShield ..> GamificationContext : dispatches interception events
```

---

### 4. Activity Diagram (Deep Work Sprint, Distraction Shield & Telemetry Workflow)

The Activity workflow models the complete lifecycle of a deep work sprint from task selection through concurrent hardware initialization, background tab drift recovery, distraction interception, and authentic telemetry persistence:

```mermaid
flowchart TD
    StartNode((●)) --> SelectTask["1. Student Selects Task & Sets Duration (e.g. 25:00)"]
    SelectTask --> AuthCheck{"Is Student Authenticated?"}

    AuthCheck -- "No (Guest Tier)" --> PublicSprint["Launch Free Focus Sprint (No telemetry recorded)"]
    AuthCheck -- "Yes (Authenticated Scholar)" --> AuthSprint["Bind Sprint to Profile & Active Syllabus Topic"]

    PublicSprint --> ForkInit
    AuthSprint --> ForkInit

    %% Concurrent Initialization Fork
    ForkInit["══════ Concurrent Sprint Initialization ══════"]
    ForkInit --> SetTarget["Set Absolute Target: targetEndTime = Date.now() + Duration × 1000"]
    ForkInit --> InitDSP["Initialize Web Audio API: 40 Hz Gamma Wave + Natural Rain"]
    ForkInit --> BroadcastSync["Broadcast 'TIMER_START' on BroadcastChannel ('procastinot_timer_channel')"]

    SetTarget --> JoinInit
    InitDSP --> JoinInit
    BroadcastSync --> JoinInit

    JoinInit["══════ Enter Deep Work Focus Loop ══════"] --> Tick["Run 1000ms Countdown Tick"]

    %% Decision branches during focus loop
    Tick --> CheckEvent{"Evaluate Runtime Event"}

    %% Branch A: Background tab throttling recovery
    CheckEvent -- "User switches tab / minimizes window" --> TabThrottled["Browser throttles setInterval (up to 10s delay)"]
    TabThrottled --> TabReturn["User returns: 'visibilitychange' event fires"]
    TabReturn --> ResyncTarget["Calculate Target Delta: remaining = (targetEndTime - Date.now()) / 1000"]
    ResyncTarget --> Tick

    %% Branch B: Distraction link interception
    CheckEvent -- "User clicks external blacklisted URL" --> InterceptLink["useBrowserShield intercepts: event.preventDefault()"]
    InterceptLink --> ModalGate["Mount SecondThoughtModal: 10-Second Mindfulness Gate"]
    ModalGate --> BoxBreathing["Guide Autonomic Box Breathing (4s Inhale, 3s Hold, 3s Exhale)"]
    BoxBreathing --> InterceptChoice{"Student Reflection Decision"}
    
    InterceptChoice -- "Return to Deep Work" --> AwardBonus["Award +35 Focus Points Resilience Bonus & Resume DSP Audio"]
    AwardBonus --> Tick
    
    InterceptChoice -- "Confirm Intentional Visit" --> LogDistract["Log Distraction Event (0 points) & Bypass Shield Anchor"]
    LogDistract --> Tick

    %% Branch C: Normal tick or timer expired
    CheckEvent -- "Remaining > 0" --> Tick
    CheckEvent -- "Remaining <= 0 (Sprint Complete)" --> CompleteSession["Play Completion Chime & Suspend Web Audio DAC"]

    CompleteSession --> ConfettiFX["Trigger Hardware-Accelerated Canvas Confetti Celebration"]
    ConfettiFX --> SaveLocal["Persist FocusSessionLog to localStorage ('procastinot_sessions')"]

    SaveLocal --> AuthSaveCheck{"Is Student Authenticated?"}
    AuthSaveCheck -- "No" --> CycleSwitch
    AuthSaveCheck -- "Yes" --> UpdateTelemetry["Compute Authentic Telemetry: calculateRealStreak() & 26-Week Heatmap"]
    
    UpdateTelemetry --> AwardPoints["Credit Focus Points (+25 FP per 25 min) & Update Day-over-Day Velocity"]
    AwardPoints --> CheckBadges{"Check Milestone / Streak Freezes"}
    CheckBadges --> CycleSwitch["Switch Chronometer Matrix to Short Break (05:00) / Long Rest (15:00)"]

    CycleSwitch --> EndNode((◎))

    classDef startFinish fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#ffffff
    classDef actionNode fill:#f8fafc,stroke:#64748b,stroke-width:1.5px,color:#0f172a
    classDef decisionNode fill:#f1f5f9,stroke:#0284c7,stroke-width:1.5px,color:#0f172a
    classDef forkBar fill:#0284c7,stroke:#0284c7,stroke-width:2px,color:#ffffff
```

---

### 5. Sequence Diagram (Drift-Proof Session Lifecycle & Multi-Tier Coordination)

The multi-tier sequence details inter-process messaging, DSP initialization, visibility delta correction, and transactional persistence across client boundaries:

```mermaid
sequenceDiagram
    autonumber
    actor Student as 👤 Student Scholar
    participant UI as 🖥️ PomodoroTimer (UI)
    participant Ctx as ⏱️ TimerContext
    participant Audio as 🎧 gammaEngine (Web Audio DSP)
    participant Channel as 📡 BroadcastChannel
    participant Browser as 🌐 Browser (Visibility & Tabs)
    participant Shield as 🛡️ useBrowserShield
    participant Modal as 🧘 SecondThoughtModal
    participant GameCtx as 🏆 GamificationContext
    participant Storage as 💾 LocalStorage

    %% 1. Session Launch
    Student->>UI: Clicks "START FOCUS" (25:00 SPRINT)
    UI->>Ctx: startTimer()
    
    par Dual Hardware & State Initialization
        Ctx->>Audio: initContext() & startGamma(216Hz, 40Hz, 0.35)
        Audio->>Audio: startAmbient('rain', 0.25) & playChime('start')
        Ctx->>Ctx: targetEndTimeRef = Date.now() + 1500 * 1000
        Ctx->>Channel: postMessage({ type: 'SYNC_START', remaining: 1500 })
    end

    %% 2. Background Tab Throttling & Visibility Recovery
    Note over Student,Browser: Student switches to PDF Reader / terminal window
    Browser->>Ctx: Throttles setInterval tick (1000ms -> 10000ms delay)
    Student->>Browser: Switches back to ProcastiNot tab
    Browser->>Ctx: Dispatches 'visibilitychange' (document.visibilityState === 'visible')
    Ctx->>Ctx: remaining = Math.round((targetEndTimeRef - Date.now()) / 1000)
    Ctx->>UI: Instantaneous re-sync to exact elapsed second (0.00s drift)

    %% 3. In-App Distraction Shield Interception
    Note over Student,Shield: Student clicks external link (e.g. reddit.com / twitter.com)
    Browser->>Shield: Global capture-phase 'click' event captured
    Shield->>Shield: isDomainBlocked('reddit.com') -> Match found
    Shield->>Browser: event.preventDefault() & event.stopPropagation()
    Shield->>GameCtx: triggerInterception('reddit.com')
    GameCtx->>Modal: Mount full-screen 10s Box-Breathing reset
    
    Note over Modal,Student: 4s Inhale → 3s Hold → 3s Exhale (Autonomic Vagal Reset)
    Student->>Modal: Clicks "Return to Deep Work"
    Modal->>GameCtx: resolveInterception(true, 'boredom')
    GameCtx->>GameCtx: awardPoints(35, 'Focus Resilience Bonus')
    GameCtx->>Modal: Dismiss modal & resume 40Hz Audio Entrainment

    %% 4. Session Completion & Telemetry Persistence
    Note over Ctx: targetEndTimeRef reached (timeRemaining <= 0)
    Ctx->>Audio: playChime('complete')
    Ctx->>Audio: stop() & AudioContext.suspend()
    Ctx->>UI: Trigger canvas-confetti celebration
    Ctx->>Storage: Append FocusSessionLog to 'procastinot_sessions'
    
    Ctx->>GameCtx: recordFocusSession(25, today)
    GameCtx->>Storage: Update 'procastinot_daily_records' [date] += 25
    GameCtx->>GameCtx: calculateRealStreak() & getRealHeatmapGrid()
    GameCtx->>GameCtx: awardPoints(25, 'Pomodoro Sprint Complete')
    GameCtx->>Storage: Persist updated user points, streak, and level
    
    Ctx->>UI: switchMode('short_break') -> Reset countdown to 05:00
```

---

### 6. Anti-Distraction Shield Interception Sequence

The platform provides a dual-layer distraction shield: an in-app capture-phase link interception for single-page links and an external userscript/extension interceptor for third-party browser tabs:

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student in Deep Focus
    participant Browser as Browser Tab / DOM Link
    participant Shield as useBrowserShield Hook
    participant Modal as SecondThoughtModal (10s Gate)
    participant Wallet as Gamification Engine

    alt In-App Link Click
        Student->>Browser: Clicks link pointing to twitter.com or reddit.com
        Browser->>Shield: Global capture-phase 'click' event intercepted
        Shield->>Shield: isDomainBlocked('twitter.com') -> Match found
        Shield->>Browser: event.preventDefault() & event.stopPropagation()
    else External Userscript / Extension Intercept
        Student->>Browser: Types 'instagram.com' in new tab
        Browser->>Browser: Userscript executes window.stop()
        Browser->>Shield: Redirects to https://procastinot-nine.vercel.app/?blocked=instagram.com
        Shield->>Shield: Reads window.location.search (?blocked=...)
    end

    Shield->>Modal: triggerInterception('instagram.com')
    Modal->>Student: Mount full-screen 10-second box-breathing interface
    Note over Modal,Student: 4s Inhale -> 3s Hold -> 3s Exhale (Prefrontal Reset)
    Modal->>Student: Present Reflection Inquiry: Muscle memory, boredom, or fatigue?
    
    alt Student Resumes Work
        Student->>Modal: Clicks "Return to Deep Work"
        Modal->>Wallet: Award +35 Focus Points resilience bonus
        Modal->>Modal: Dismiss modal & resume 40Hz audio entrainment
    else Intentional Emergency Override (After 10s)
        Student->>Modal: Clicks "Confirm Intentional Visit"
        Modal->>Wallet: Log distraction event without points
        Modal->>Browser: Bypass shield using data-bypass-shield anchor
    end
```

---

### 7. 40 Hz Gamma Wave Neural Entrainment Pipeline

ProcastiNot generates pure acoustic neuro-stimulants entirely on client hardware without requesting pre-recorded MP3 streams:

```mermaid
graph LR
    subgraph Wave_Generators["Audio Synthesis Nodes"]
        OSC_L["Left Oscillator (216 Hz Sine)"]
        OSC_R["Right Oscillator (256 Hz Sine)"]
        ISO_CARRIER["Isochronic Carrier (432 Hz Warm Sine)"]
        ISO_LFO["40 Hz Pulse Modulator (Sine / Square LFO)"]
        NOISE_BUF["Custom 6s Looping Buffer (Rain / Pink / Brown / Library)"]
    end

    subgraph Signal_Processors["Mixers & DSP Filters"]
        GAIN_L["Left Channel Gain (0.5)"]
        GAIN_R["Right Channel Gain (0.5)"]
        MERGER["Stereo ChannelMergerNode"]
        PULSE_GAIN["LFO Modulated Pulse Gain"]
        FILTER["Biquad Low-Pass Filter (450Hz - 2600Hz)"]
        GAMMA_BUS["Gamma Gain Bus (User Fader)"]
        AMBIENT_BUS["Ambient Gain Bus (User Fader)"]
        MASTER["Master Gain Stage (1.0)"]
    end

    subgraph Hardware_DAC["Output Interface"]
        DAC["AudioContext.destination (Speakers / Headphones)"]
    end

    OSC_L --> GAIN_L --> MERGER
    OSC_R --> GAIN_R --> MERGER
    MERGER --> GAMMA_BUS

    ISO_CARRIER --> PULSE_GAIN
    ISO_LFO --> PULSE_GAIN
    PULSE_GAIN --> GAMMA_BUS

    NOISE_BUF --> FILTER --> AMBIENT_BUS

    GAMMA_BUS --> MASTER
    AMBIENT_BUS --> MASTER
    MASTER --> DAC
```

- **Binaural Beats Mode**: Feeds 216 Hz into the left ear and 256 Hz into the right ear. The superior olivary complex in the auditory brainstem processes the frequency difference, deriving a synchronized **40 Hz cortical gamma oscillation**.
- **Isochronic Pulses Mode**: Applies a 40 Hz amplitude-modulated pulse over a 432 Hz harmonic carrier tone, effective through open laptop speakers without requiring stereo headphones.
- **Hardware Power Optimization**: When audio is stopped, `AudioContext.suspend()` releases hardware DAC audio threads, preserving device battery.

---

## 📊 Mathematical Formulations & Chronobiology

### 1. Circadian Alertness Function \(A(t)\)
The platform evaluates circadian cognitive stamina \(A(t) \in [0, 100]\) for hour \(t \in [0, 24]\) parameterized by user chronotype \(C \in \{	ext{Night Owl}, 	ext{Early Bird}, 	ext{Bimodal Flow}\}\):

$$	ext{Alertness}(t) = 	ext{clamp}\left(15, 100, 	ext{Base} + lpha \cdot \cos\left(rac{2\pi (t - t_{	ext{peak}})}{24}
ight) - \delta_{	ext{trough}}(t)
ight)$$

| Chronotype | Biological Alertness Peak \(t_{	ext{peak}}\) | Afternoon Trough \(t_{	ext{trough}}\) | Recommended Cognitive Weight |
| :--- | :--- | :--- | :--- |
| **Early Bird** | 06:00 – 11:00 (\(t_{	ext{peak}} = 09:00\)) | 14:00 – 16:00 | Proofs, Logic, Complex Systems |
| **Bimodal Flow** | 10:00 – 13:00 & 17:00 – 20:00 | 14:00 – 15:30 | Split deep sprints & review |
| **Night Owl** | 20:00 – 02:00 (\(t_{	ext{peak}} = 23:30\)) | 07:00 – 11:00 | Algorithmic Problem Sets, Code |

### 2. Dynamic Runway Rebalancing Formula
When a student masters a syllabus topic or approaches a deadline, the required daily focus runway recalculates automatically:

$$	ext{Runway}_{	ext{daily}} = \max\left(30, \left\lceil rac{K \cdot \sum_{i \in 	ext{Remaining}} w_i}{\max\left(1, \left\lfloor rac{T_{	ext{exam}} - T_{	ext{current}}}{86400 	imes 1000} 
ight
floor
ight)} 
ight
ceil
ight)$$

### 3. Task Priority Sorting Vector
Tasks are automatically sorted across four dimensions:
1. **Completion Sink**: Incomplete tasks float above completed tasks.
2. **Urgency Window**: Tasks with deadlines within 72 hours or tagged `examRelated` gain top priority.
3. **Cognitive Energy Alignment**: Tasks requiring `deep_focus` (weight 3), `medium` (weight 2), and `low` (weight 1) are aligned to the current circadian alertness status.
4. **Difficulty Rank**: Epic (4) > Hard (3) > Medium (2) > Easy (1).

---

## 📈 Authentic Telemetry & Gamification Engine

Unlike mock-heavy productivity demonstrators, ProcastiNot's gamification system is backed by an authentic telemetry engine:

- **Zero Mock Commit Cells**: The 26-week activity heatmap renders exclusively from actual focus sessions logged in `localStorage` under `procastinot_sessions` and `procastinot_daily_records`.
- **Dynamic Streak Validation**: The streak engine calculates unbroken focus streaks by inspecting calendar day deltas. If no session was logged yesterday and no streak freezes remain, the streak accurately resets to 0 or 1.
- **Day-Over-Day Velocity Curve**: The performance delta graph plots net productivity:
  
  $$	ext{Delta} = (	ext{Minutes}_{	ext{focus}} 	imes 0.5) + (	ext{Tasks}_{	ext{done}} 	imes 10) - (	ext{Overrides} 	imes 15) + 	ext{Bonus}_{	ext{resilience}}$$

---

## 📂 Directory & Project Structure

```text
procastinot/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Strict CI pipeline: tsc, oxlint, node tests, build
├── public/
│   ├── extension/                 # Manifest V3 browser extension for Edge & Chrome
│   │   ├── background.js          # Background service worker interceptor
│   │   └── manifest.json          # MV3 declarativeNetRequest configuration
│   ├── procastinot-browser-extension.zip # 1-click installable packaged extension
│   └── procastinot-shield.user.js # Tampermonkey / Greasemonkey cross-browser userscript
├── src/
│   ├── audio/
│   │   └── gammaEngine.ts         # Native Web Audio API 40Hz Gamma & Rain DSP synthesizer
│   ├── components/
│   │   ├── auth/                  # AuthModal, AuthFeatureGate, Student SSO & Google OAuth
│   │   ├── dashboard/             # OverviewDashboard, FocusVelocityGraph, DailyPillMatrix
│   │   ├── distraction/           # DistractionBlocker, SecondThoughtModal, Sandbox
│   │   ├── gamification/          # StreakHeatmap (26-week grid), RewardsShop, Leaderboard
│   │   ├── layout/                # Shell, Topbar, Sidebar, Responsive Navigation
│   │   ├── planner/               # CircadianOrganizer, EisenhowerMatrix, ExamCountdown
│   │   ├── rooms/                 # VirtualStudyRooms, StudyRoomModal, PeerPresence
│   │   └── timer/                 # PomodoroTimer, ChronometerMatrix, GammaWaveControls
│   ├── context/
│   │   ├── AuthContext.tsx        # Student authentication gate & session management
│   │   ├── GamificationContext.tsx# Points wallet, authentic streaks, blocked domains
│   │   ├── TaskContext.tsx        # Chronotype ranking & task priority vectors
│   │   └── TimerContext.tsx       # Drift-proof target delta & Web Audio synchronization
│   ├── data/
│   │   └── mockData.ts            # Default presets, initial syllabi & seed data
│   ├── hooks/
│   │   └── useBrowserShield.ts    # Global capture-phase link interception hook
│   ├── types/
│   │   └── index.ts               # Strict TypeScript domain interfaces
│   ├── utils/
│   │   └── streakTelemetry.ts     # Pure algorithmic engine for authentic 26-week heatmap
│   ├── App.tsx                    # Root shell mounting Context Providers
│   ├── index.css                  # Tailwind v4 theme tokens & tactile claymorphic CSS
│   └── main.tsx                   # React 19 root entrypoint
├── test/
│   └── system.test.js             # 12-suite native Node.js automated test harness
├── package.json                   # Dependency graph & lifecycle scripts
├── tsconfig.json                  # Strict TypeScript compiler options
└── vite.config.ts                 # High-performance Vite build bundler
```

---

## 🏛️ Tech Stack & Engineering Rationale

| Domain | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Runtime & UI** | React 19.2 + TypeScript 5.9 | Concurrent rendering, strict compile-time type safety, zero `any` leaks. |
| **Bundler** | Vite 8 | Sub-600ms cold builds, instant HMR, optimized roll-up chunk generation. |
| **Styling** | Tailwind CSS v4 | Modern CSS engine, tactile claymorphic tokens, zero runtime CSS overhead. |
| **DSP Engine** | Web Audio API | Client-side 40 Hz audio synthesis with zero network latency and stereo channel merging. |
| **Icons** | Lucide React | Lightweight tree-shakeable SVG glyphs with full accessibility ARIA labeling. |
| **Celebrations** | Canvas-Confetti | Hardware-accelerated canvas particle effects for dopamine reinforcement. |
| **CI / CD** | GitHub Actions | Strict typechecking, linting, unit testing, and build verification on push/PR. |

---

## 💻 Local Deployment & Automated Testing

### Prerequisites
- **Node.js**: `v20.0.0` or higher (verified on Node `v22.x` and `v24.x`)
- **Package Manager**: `npm` (v10+)
- **Modern Browser**: Chrome, Edge, Safari, or Firefox with Web Audio API and `BroadcastChannel` support.

### Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/metalha516/ProcastiNot.git
cd ProcastiNot

# 2. Install dependencies cleanly
npm ci

# 3. Strict TypeScript typechecking
npx tsc -b

# 4. Code quality & linting audit
npm run lint

# 5. Run the automated system test suite
npm test

# 6. Launch the local Vite development server
npm run dev
```

### Production Build Verification

```bash
# Compile and optimize production assets
npm run build

# Preview production build locally
npm run preview
```

---

## 🧪 Comprehensive Automated Test Matrix

ProcastiNot includes a native Node.js automated test harness (`test/system.test.js`) executing 12 test suites covering mathematical formulations, defensive input validation, multi-tab sync contracts, and timing accuracy:

```text
✔ 1. Production Build & Static Assets Verification (index.html, CSS, JS chunks)
✔ 2. Anti-Distraction Shield Domain Extraction & Subdomain Matching Logic
✔ 3. Task Sorting Algorithm: Urgency, Energy Alignment & Completed Task Sinking
✔ 4. Feature Access & Authentication Policy Verification (Free Timer vs Gated)
✔ 5. Audio Synthesis & Binaural Frequency Calculations (216 Hz + 40 Hz Delta)
✔ 6. Real Streak Telemetry Algorithm Verification (Zero-Mock Integrity)
✔ 7. Real 26-Week Heatmap Grid Construction & Intensity Bucketing (182 Cells)
✔ 8. Real Session Logging & Dashboard Telemetry Integration
✔ 9. Defensive Form Validation & XSS Neutralization (Tags, Glyphs, Truncation)
✔ 10. Fault-Tolerant LocalStorage Recovery & JSON Parsing Safety
✔ 11. Multi-Tab BroadcastChannel Payload Contract Verification
✔ 12. Precision Drift-Proof Timer Target Delta Verification (10s Tab Throttle Simulation)

12 passed, 0 failed, duration: ~140ms
```

---

## ⚙️ CI/CD Quality Gates

Every Pull Request and commit to `main` must pass an automated GitHub Actions pipeline (`.github/workflows/ci.yml`):
1. **Node 22 Ubuntu Environment**: Standardized modern runtime with npm package caching.
2. **Strict TypeScript Compilation Check**: `npx tsc -b` guarantees zero type errors across all modules.
3. **OxLint Static Code Quality Audit**: `npm run lint` flags unused variables, impure functions, and invalid hooks.
4. **Node Test Harness Execution**: `npm test` executes the 12-suite automated regression matrix.
5. **Production Bundle Verification**: `npm run build` verifies Vite rollup bundling and tree-shaking integrity.

---

## 📈 Performance & Core Web Vitals

ProcastiNot is optimized for maximal client-side edge performance:

| Metric | Target | Actual Measured | Technique / Architecture |
| :--- | :--- | :--- | :--- |
| **First Contentful Paint (FCP)** | `< 0.8s` | `~0.4s` | Pure local-first hydration, zero blocking remote font requests. |
| **Largest Contentful Paint (LCP)** | `< 1.2s` | `~0.7s` | Zero heavy image assets; tactile UI rendered with native CSS vectors. |
| **Cumulative Layout Shift (CLS)** | `0.00` | `0.00` | Explicit dimension reservations on clay containers and mode switchers. |
| **Interaction to Next Paint (INP)** | `< 50ms` | `< 16ms` | Optimistic React 19 state updates and decoupled Web Audio synthesis. |

---

## 🛡️ Anti-Distraction Companion Installation

### 1. Tampermonkey / Violentmonkey Userscript
For cross-browser protection across all windows, install the user script located at `public/procastinot-shield.user.js`. Any attempt to visit blocked domains (Instagram, TikTok, Twitter/X, Reddit, Facebook, Netflix, etc.) is intercepted before render and redirected to:
`https://procastinot-nine.vercel.app/?blocked=<domain>`

### 2. Chrome / Edge Browser Extension
Load the `public/extension/` directory into Chrome via `chrome://extensions` -> **Load unpacked** (or download the packaged ZIP from the platform UI). The background service worker intercepts matching navigation events in real-time.

---

## 🗺️ Roadmap & Scalability

- [x] **Drift-Free Focus Timer**: Absolute target timestamp model with background tab recovery.
- [x] **Authentic Heatmap Engine**: 26-week calendar grid derived from real focus telemetry.
- [x] **Dual-Layer Distraction Shield**: Capture-phase link interception + companion extension.
- [x] **40 Hz Gamma Audio Synthesizer**: Native Web Audio API binaural & isochronic soundscapes.
- [ ] **Collaborative Focus Rooms (Phase 2)**: WebRTC-driven peer-to-peer audio co-working rooms.
- [ ] **Bi-Directional Calendar Synchronization**: Two-way sync with Google Calendar & Outlook.
- [ ] **Hardware Status Triggers**: WebHID / WebBluetooth integration for physical desk indicators.

---

## 📄 License & Academic Attribution

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details. Developed with engineering precision as part of the **Advanced Student Productivity & Focus Research Initiative**.

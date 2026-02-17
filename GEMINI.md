# Drill Machine: Grammar Practice - Developer Context

## Project Overview

**Drill Machine** is a feature-rich, static web application designed for English as a Second Language (ESL) students to practice grammar drills. It simulates a language lab environment, focusing on sentence construction accuracy, fluency, and automaticity through randomized prompts and immediate feedback.

The application allows users (teachers or students) to **Build** custom drills and **Play** them in an interactive, gamified mode.

## Tech Stack

*   **Frontend:** Vanilla JavaScript (ES6+) using **Namespace Patterns**.
*   **Styling:** Tailwind CSS (via CDN) + Custom CSS (`style.css`).
*   **Audio:** Browser-native `SpeechSynthesis` API (Text-to-Speech) encapsulated in `DrillAudio`.
*   **State Management:** `localStorage` for saving drill configurations and user preferences (Dark Mode).
*   **Assets:** AI-generated icons in `images/`.

## Directory Structure

*   `index.html`: Main entry point. Contains the UI for Builder/Player, Dark Mode toggle, and visual feedback elements.
*   `script.js`: Core logic partitioned into:
    *   `DrillAudio`: TTS, voice management, and sound effects.
    *   `DrillBuilder` (concept): Form handling and data validation.
    *   `DrillPlayer` (concept): Game loop, scoring, timer, and session history.
    *   **Data**: `PREMADE_VERB_MODELS` for quick starts.
*   `style.css`: Custom animations (fade-ins), prompt styling, and specific component overrides.
*   `images/`: Static assets (e.g., `stopwatch.png`).

## Key Features

### 1. Drill Builder
*   **Tense Support:** Simple Present (Logic extensible to Simple Past).
*   **Vocabulary Management:** Custom input for Subjects, Verbs, and Complements.
*   **Presets:** One-click loading of curated lists (Daily Routine, Food & Drink).
*   **Configurable Rigor:** Toggle sentence types (Affirmative/Negative/Question), Audio Cue styles, and Speed.

### 2. Drill Player (Gamified)
*   **Interactive Loop:** 
    1.  **Prompt:** Visual + Audio Cue (e.g., "She [beep] TV").
    2.  **Response Window:** Visual Countdown Bar creates positive pressure.
    3.  **Feedback:** Model answer revealed with **Syntax Highlighting** (coloring key grammar points like *doesn't* or *es*).
    4.  **Audio Model:** TTS speaks the correct sentence for pronunciation checking.
*   **Session Recap:** A summary screen at the end of the drill lists all practiced sentences for review.
*   **Accessibility:** Full **Dark Mode** support and ARIA live regions.

## Development Conventions

*   **Architecture:** Logic is organized to avoid global scope pollution. `DrillAudio` is the primary example of this Namespace pattern.
*   **State:** The app is stateless on the server (client-side only). `localStorage` persists the active drill config.
*   **Git:** Semantic versioning and commit messages.

## Roadmap & Status

### Completed Features ✅
*   [x] **Visual Countdown Bar:** Progress bar synchronized with the student's speaking time.
*   [x] **Syntax Highlighting:** Intelligent coloring of grammatical structures in model answers.
*   [x] **Dark Mode:** System-aware toggle with persistence.
*   [x] **Session Recap:** History view of all generated sentences after a drill.
*   [x] **Audio Refactor:** Encapsulated `SpeechSynthesis` logic for robustness.

### Future Improvements / Backlog
*   **Simple Past Tense:** Full implementation of irregular verb tables and auxiliary logic ("Did").
*   **Export/Share:** Ability to share a drill configuration via URL parameters.
*   **PWA Support:** Make the app installable offline.
*   **Tailwind Build:** Transition from CDN to a compile step for production performance.

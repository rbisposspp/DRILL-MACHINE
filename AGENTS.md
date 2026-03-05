# Repository Guidelines

## Project Structure & Module Organization
`DRILL-MACHINE` is a static ESL web app focused on drill-based speaking practice.

- `index.html`: app shell (Builder + Drill Player tabs, controls, recap view).
- `script.js`: core behavior (configuration, sentence generation, audio cues, round loop, summary).
- `style.css`: layout, component styles, responsive behavior.
- `images/`: UI assets.
- `sounds/`: audio cues (`beep.wav`).
- `nanobanana-output/`: generated design artifacts.

Keep feature edits localized and preserve current architecture split (audio module + builder flow + player flow).

## Build, Test, and Development Commands
No build step.

- Open directly: `index.html`
- Recommended local server: `python3 -m http.server 8000`
- Optional: `npx serve .`

Use local server when validating audio and browser API behavior.

## Coding Style & Naming Conventions
- JavaScript: ES6+, `const`/`let`, semicolons, `camelCase` identifiers.
- Constants: `UPPER_SNAKE_CASE`.
- CSS classes/ids: keep existing kebab-case patterns.
- Prefer small helper functions and avoid large refactors.

## Audio & Drill-Specific Rules
- Preserve Web Speech API flow (`speechSynthesis`) and voice fallback behavior.
- Keep pause/resume and timer/countdown logic stable.
- Do not break localStorage config keys (`drillConfig`, dark mode preference).
- Keep Simple Present generation behavior stable unless a tense update is explicitly requested.

## Testing Guidelines (Manual)
Smoke-check before finishing:
- Builder save flow (pronouns, verbs, complements, settings).
- Drill start/pause/resume/next round.
- Cue playback + model playback button.
- Typed answer comparison and feedback area.
- Session summary/recap render.
- Dark mode toggle persistence.

## Commit & PR Guidelines
- Commits: short imperative messages (example: `Fix auto-advance timer after pause`).
- Keep one logical change per commit.
- For UI/UX changes, include screenshot or short GIF in PR.

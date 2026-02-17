# Repository Guidelines

## Project Structure & Module Organization
This repository is a static web app with no backend build system.

- `index.html`: main UI shell for Drill Builder and Drill Player.
- `script.js`: core application logic (audio, builder flow, player flow, presets).
- `style.css`: custom styling, animations, and component overrides.
- `images/`: production image assets.
- `sounds/`: local audio assets used by cue playback (`beep.wav`).
- `nanobanana-output/`: generated asset output files.
- `README.md`: product overview and usage notes.
- `GEMINI.md`: developer context and architecture notes.

Keep feature logic grouped in `script.js` by namespace-style sections (`DrillAudio`, builder/player behavior), and place media assets under `images/` or `sounds/` by type.

## Build, Test, and Development Commands
No compile step is required.

- `start index.html` (Windows): open the app directly in your browser.
- `python -m http.server 8080`: run a local server for browser API behavior checks.
- `npx serve .`: alternative static server if Node tooling is preferred.

Use a local server when validating Web Speech behavior or mobile-device testing.

## Coding Style & Naming Conventions
- JavaScript: ES6+, 4-space indentation, semicolons, single quotes.
- CSS: 4-space indentation, kebab-case class names (for example, `.tab-button`).
- Constants: `UPPER_SNAKE_CASE` (for example, `TENSE_SIMPLE_PRESENT`).
- Functions/variables: `camelCase`; DOM helpers should be small and explicit.

Prefer clear, modular additions over large inlined blocks. Keep comments short and only for non-obvious logic.

## Testing Guidelines
There is currently no automated test framework in this repository. Validate changes with focused manual checks:

- Builder flow: create/edit/save drill configurations.
- Player flow: start drill, timer/countdown behavior, recap rendering.
- Audio flow: prompt/model playback and fallback behavior if voices are unavailable.
- UI checks: responsive layout and dark mode persistence.

For bug fixes, include reproducible steps in the PR and verify the fix in at least one Chromium-based browser.

## Commit & Pull Request Guidelines
This repository is tracked in Git and published on GitHub. Use this convention:

- Commit format: `type(scope): short imperative summary` (for example, `feat(player): add recap clear button`).
- Branch naming: `feature/<topic>`, `fix/<topic>`, `chore/<topic>`.
- PRs should include: purpose, key changes, manual test steps, and screenshots/GIFs for UI updates.
- Link related issues/tasks and call out any behavior changes affecting drill logic or audio.

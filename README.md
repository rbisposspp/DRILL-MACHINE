# Drill Machine

## What it is
Drill Machine is a browser-based ESL grammar drilling app built for repeated sentence production practice. It combines a configurable drill builder with a timed player focused on fluency, accuracy, and spoken response.

## Who it is for
This project is designed for ESL teachers, adult learners, and live 1-on-1 or small-group lessons. It works well for online classes where the teacher wants fast speaking practice with clear prompts and immediate feedback.

## Main features
- Custom drill builder for subjects, verbs, complements, and sentence types
- Timed drill player with countdown feedback and round progression
- Web Speech API model playback for listen-and-repeat practice
- Optional typed response field for quick comparison and self-checking
- Session recap with generated sentence history
- Local browser storage for saved drill settings and preferences

## Teaching value
The app supports high-repetition grammar practice without turning the lesson into a worksheet. It helps learners move from controlled sentence building to faster oral production, while giving teachers a simple way to reuse or adjust drill sets for different lessons.

## Tech stack
- HTML
- CSS
- Vanilla JavaScript
- Web Speech API
- localStorage

## How to run
Use a local static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

You can also open `index.html` directly in a browser, but a local server is more reliable for audio and browser API testing.

## Notes
The current drill content is centered on simple present sentence patterns. Speech synthesis support depends on the browser and the voices available on the local machine.

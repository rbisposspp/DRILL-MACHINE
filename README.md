# 🎯 Drill Machine: Grammar Practice

> A powerful, static web application for English Language Teaching (ELT), focusing on sentence construction accuracy and fluency through gamified audio-lingual drills.

![Status](https://img.shields.io/badge/Status-Complete-green)
![Tech](https://img.shields.io/badge/Tech-Vanilla%20JS%20%7C%20Tailwind%20CSS-blue)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

## 📖 Overview

**Drill Machine** simulates a language lab environment directly in your browser. It allows teachers and students to configure custom grammar drills (currently focused on Simple Present) and practice them using an interactive "Listen & Speak" loop powered by the Web Speech API.

Unlike static quizzes, Drill Machine focuses on **production speed** and **pronunciation**, utilizing auditory cues and visual countdowns to create positive pressure.

## ✨ Key Features

### 🎮 Gamified Player
*   **Audio-First Experience:** Prompts are delivered via TTS (Text-to-Speech) with customizable voices (US/UK) and speed.
*   **Visual Countdown:** A dynamic progress bar provides immediate visual feedback on speaking time limits.
*   **Syntax Highlighting:** Model answers automatically highlight key grammatical structures (e.g., *doesn't like*, *Does she go*) to reinforce rules.
*   **Session Recap:** Review a full history of generated sentences at the end of each session.

### 🛠️ Drill Builder
*   **Customizable Content:** Define your own Subjects, Verbs, and Complements.
*   **Smart Logic:** Automatically handles 3rd Person conjugation (He/She/It rules).
*   **Presets:** Includes built-in sets for "Daily Routine", "Free Time", and "Food & Drink".
*   **Flexible Config:** Toggle Affirmative, Negative, and Interrogative sentence types.

### 🌓 Accessibility & UI
*   **Dark Mode:** Built-in system-aware dark mode for comfortable night study.
*   **Responsive Design:** Works seamlessly on desktop and mobile.
*   **Client-Side Only:** No backend required. All data is stored locally in your browser (`localStorage`).

## 🚀 Quick Start

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/drill-machine.git
    ```
2.  **Open the App:**
    Simply open the `index.html` file in any modern web browser (Chrome, Edge, Firefox, Safari).
    
    *Note: An internet connection is required to load Tailwind CSS via CDN.*

## 🕹️ How to Use

1.  **Build Phase:**
    *   Select a Tense (Simple Present).
    *   Load a Preset (e.g., "Daily Routine") or type your own verbs.
    *   Adjust settings (Speed, Rounds, Sentence Types).
    *   Click "Save Drill Configuration".

2.  **Play Phase:**
    *   Switch to the "Drill Player" tab.
    *   Click **Start Drill**.
    *   **Listen** to the cue (e.g., *"She [beep] TV"*).
    *   **Speak** the full sentence during the blue countdown bar (*"She watches TV"*).
    *   **Listen** to the model answer and compare.

## 🏗️ Architecture

This project is built with **Vanilla JavaScript** using a Namespace pattern to keep code organized and maintainable.

*   `DrillAudio`: Encapsulates all Web Speech API logic.
*   `DrillBuilder` & `DrillPlayer`: Manage UI state and Game Logic.
*   `Tailwind CSS`: Utility-first styling via CDN.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

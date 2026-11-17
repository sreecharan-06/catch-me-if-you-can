# 🏃‍♂️💨 Catch Me If You Can!

> **A hilarious, high-energy arcade evasion browser game where the button runs away from your cursor!** Built with pure HTML5, CSS3, and modern vanilla JavaScript.
> 
> 🔗 **Live Demo:** [https://sreecharan-06.github.io/catch-me-if-you-can/](https://sreecharan-06.github.io/catch-me-if-you-can/)

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen.svg)
![GitHub Pages Ready](https://img.shields.io/badge/Deploy-GitHub%20Pages-success.svg)

---

## 🎮 Game Overview

**Catch Me If You Can** turns the simple act of clicking a button into an exhilarating test of reflexes, wit, and patience. The button has serious personal space issues: whenever your mouse cursor or touchscreen finger dares to get close, it detects you, mocks you with funny taunts, and bolts across the arena in a flash!

Every time it escapes, its speed and agility increase. You have **60 seconds** to outsmart its evasion algorithms, chain consecutive catches into massive combo streaks, and claim the highest rank!

---

## ✨ Features & Highlights

### 🎯 Core Gameplay Mechanics
- **Smart Proximity Evasion**: Real-time Euclidean distance detection forces the button to dynamically dodge in the opposite direction before you can click it.
- **Corner Ricochet & Boundary Clamping**: Intelligent collision avoidance prevents the button from getting pinned against corners or clipping outside the game arena.
- **Speed Escalation**: With every escape, the button’s evasion agility accelerates (up to 3.2x speed!).
- **Combo Multipliers**: Catching the button in quick succession triggers streak multipliers (`1x`, `2x`, `3x`...).
- **60-Second Countdown**: Real-time timer with urgent heartbeat audio, pulsing visuals, and progress indicators during the final 10 seconds.

### 🌶️ 3 Difficulty Levels
1. **Easy (Chill)**:
   - Smaller evasion radius (85px)
   - Relaxed speed jump (+0.04x per escape)
   - Straightforward escapes (100 base points)
2. **Medium (Spicy)**:
   - Balanced proximity threshold (125px)
   - Faster dodges with 18% fake-out juke chance (150 base points)
3. **Hard (Chaos Mode)**:
   - Extreme detection radius (165px)
   - Lightning-fast evasion with 35% unpredictable feints and sidesteps (250 base points)

### 🔊 Procedural Web Audio Synthesizer (Zero External Audio Files)
- **100% self-contained**: Built entirely using the native browser **Web Audio API**.
- Features custom-synthesized sound effects:
  - 💨 Whoosh evasion sweep
  - 💥 Triumphant multi-tone chord arpeggio on catches
  - 🌀 Cartoon spring "boing" for funny taunts
  - ⏳ Retro arcade countdown ticks and urgent warning beeps
  - 🏆 Fanfare and game-over jingles
- Mute/Unmute toggle with persistent preference saved in `localStorage`.

### 🎨 Visuals & Arcade Aesthetics
- **Neo-Arcade Theme**: Cyberpunk glow accents, ambient light orbs, scanline grids, and glassmorphic translucent panels.
- **Living Character Button**: Dynamic animated emojis that react to the chase (`😜` Smug, `😱` Panic, `😵` Caught, `🚀` Speeding).
- **Floating Taunt Bubbles**: 25+ witty, funny roasts displayed dynamically above the button.
- **Confetti & Particle Bursts**: Smooth HTML5 Canvas particle engine with zero external libraries.
- **Humorous Performance Ranks**: From *“🥔 Certified Couch Potato”* to *“👑 Cybernetic God of Speed”*.

### 📱 Responsive & Touch-Ready
- Seamlessly plays on desktop monitors, laptops, tablets, and smartphones.
- Supports mouse movements and touch gestures (`touchstart`, `touchmove`).
- Prevents accidental mobile browser scroll gestures while chasing inside the arena.

### 💾 LocalStorage High Scores
- High scores are saved independently for each difficulty level so you can track your progress.

---

## 📸 Screenshots & Preview

```
+---------------------------------------------------------------------------------+
|  CATCH ME IF YOU CAN! 🏃‍♂️💨                                  [ 🔊 Sound ON ] [ ? Rules ] |
+---------------------------------------------------------------------------------+
| [ ⭐ SCORE: 1,450 ]   [ ⏳ TIME: 38s ]   [ 👑 HIGH SCORE: 2,800 ]   [ 🔥 COMBO: 3x ] |
+---------------------------------------------------------------------------------+
|  Difficulty: [ Easy (Chill) ]  [ ● Medium (Spicy) ]  [ Hard (Chaos) ]   Speed: 1.8x     |
+---------------------------------------------------------------------------------+
| +-----------------------------------------------------------------------------+ |
| |                                                                             | |
| |               💬 "My grandma clicks faster! 👵💨"                           | |
| |                  [ 😜 CATCH ME! ]                                           | |
| |                                                                             | |
| |                                   +150 COMBO x3! ✨                         | |
| |                                                                             | |
| +-----------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------+
|          [ ▶ START ]            [ ⏸ PAUSE ]            [ 🔄 RESTART ]         |
+---------------------------------------------------------------------------------+
|  LATEST ROAST: "Did a sloth teach you how to click? 🦥"                          |
+---------------------------------------------------------------------------------+
```

---

## 🛠️ Technologies Used

- **HTML5**: Semantic tags, canvas rendering element, accessibility attributes (`aria-label`, `role`).
- **CSS3**: Custom properties (CSS variables), Flexbox, CSS Grid, Glassmorphism (`backdrop-filter`), keyframe animations.
- **Vanilla JavaScript (ES6+)**:
  - Web Audio API (real-time procedural sound wave synthesis)
  - HTML5 Canvas 2D particle simulation
  - Euclidean distance mathematics and trigonometric angle deflection
  - `localStorage` API for state and high score persistence
- **Google Fonts**: `Fredoka` & `Bungee`

---

## 📁 Project Structure

```
catch-me-if-you-can/
│
├── index.html        # Game layout, scoreboard, HUD, modal dialogs, and canvas
├── style.css         # Arcade styling, responsive media queries, animations, themes
├── script.js         # Game loop, evasion physics, Web Audio synthesizer, particles
└── README.md         # Documentation, feature guide, and deployment instructions
```

---

## 🚀 Quick Start / Local Installation

No build steps, node modules, or bundlers required!

### Option 1: Double-Click to Run
1. Clone or download this repository:
   ```bash
   git clone https://github.com/sreecharan-06/catch-me-if-you-can.git
   ```
2. Navigate into the project folder:
   ```bash
   cd catch-me-if-you-can
   ```
3. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).

### Option 2: Run with a Local Web Server
You can also launch it with any local development server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx serve)
npx serve .

# Using VS Code Live Server extension:
# Right-click index.html -> "Open with Live Server"
```
Visit `http://localhost:8000` in your browser.

---

## 🌐 Deploying to GitHub Pages (Step-by-Step)

Because this project is 100% static client-side code, deploying to GitHub Pages takes less than 60 seconds:

1. **Create a GitHub Repository**:
   - Go to [github.com/new](https://github.com/new).
   - Name your repository (e.g., `catch-me-if-you-can`).
   - Leave it public and click **Create repository**.

2. **Push Your Files**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Catch Me If You Can arcade game"
   git branch -M main
   git remote add origin https://github.com/sreecharan-06/catch-me-if-you-can.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - In your GitHub repository, click on **Settings** (gear icon).
   - In the left sidebar, click on **Pages**.
   - Under **Build and deployment > Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and folder `/ (root)`.
   - Click **Save**.

4. **Play Your Live Game**:
   - Wait 30–60 seconds. Your live URL will appear at:
     `https://sreecharan-06.github.io/catch-me-if-you-can/`

---

## ⌨️ Controls & Keyboard Shortcuts

| Key / Action | Function |
|---|---|
| **Mouse Hover / Touch** | Approach the button to trigger evasion |
| **Click / Tap** | Catch the button to score points |
| <kbd>Space</kbd> | Start / Pause / Resume game |
| <kbd>R</kbd> | Restart game |
| <kbd>M</kbd> | Toggle Sound (Mute / Unmute) |

---

## 🏆 Performance Rank Tier List

| Catches in 60s | Rank Title |
|:---:|---|
| **0** | 🥔 Certified Couch Potato |
| **1 – 3** | 🐌 Sleepy Snail |
| **4 – 7** | 🐢 Distracted Turtle |
| **8 – 12** | 🐱 Curious Cat |
| **13 – 18** | 🥷 Reflex Ninja |
| **19 – 25** | ⚡ Lightning Wizard |
| **26+** | 👑 Cybernetic God of Speed |

---

## 📄 License

This project is open-source and released under the [MIT License](LICENSE). Feel free to play, fork, remix, and enjoy!

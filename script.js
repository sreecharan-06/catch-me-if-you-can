/**
 * ============================================================================
 * CATCH ME IF YOU CAN - ARCADE BROWSER GAME
 * ============================================================================
 * An interactive, fast-paced game where a cheeky button runs away from your
 * cursor using dynamic proximity physics, funny taunts, procedural sound
 * effects, particle confetti, and difficulty progression.
 *
 * Authors: Vanilla JS implementation with Web Audio API & HTML5 Canvas
 * ============================================================================
 */

'use strict';

/* ============================================================================
   1. PROCEDURAL SOUND SYNTHESIZER (Web Audio API)
   ============================================================================
   Zero external audio assets required. All sounds are synthesized on-the-fly
   to avoid network latency, missing asset 404s, or loading delays.
*/
class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
    this.loadMutePreference();
  }

  // Initialize or resume audio context on first user gesture
  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    } else if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  loadMutePreference() {
    try {
      const saved = localStorage.getItem('catchMe_muted');
      this.muted = saved === 'true';
    } catch (e) {
      this.muted = false;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    try {
      localStorage.setItem('catchMe_muted', this.muted);
    } catch (e) {}
    return this.muted;
  }

  // High-pitch swoosh when the button flees
  playDodge() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch slide from 400Hz up to 900Hz and back
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.18);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  }

  // Cartoon boing/spring sound for silly taunts
  playBoing() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(550, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  }

  // Triumphant multi-tone chord when user clicks the button
  playCatch() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      const now = ctx.currentTime;

      freqs.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = now + index * 0.04;
        const endTime = startTime + 0.22;

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(endTime);
      });
    } catch (e) {}
  }

  // Gentle clock tick for countdown
  playTick() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  // Urgent buzzer beep when timer <= 10s
  playUrgentTick() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(950, now);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {}
  }

  // Game over jingle
  playGameOver(isHighScore = false) {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      if (isHighScore) {
        // Triumphant fanfare
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          const st = now + idx * 0.1;
          gain.gain.setValueAtTime(0.2, st);
          gain.gain.exponentialRampToValueAtTime(0.001, st + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(st);
          osc.stop(st + 0.4);
        });
      } else {
        // Descending defeat notes
        const notes = [587.33, 523.25, 440, 349.23];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          const st = now + idx * 0.14;
          gain.gain.setValueAtTime(0.18, st);
          gain.gain.exponentialRampToValueAtTime(0.001, st + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(st);
          osc.stop(st + 0.35);
        });
      }
    } catch (e) {}
  }

  // UI button click sound
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }
}

/* ============================================================================
   2. PARTICLE & CONFETTI ENGINE (HTML5 Canvas)
   ============================================================================
   Renders smooth particle explosions on button clicks and game-over celebrations.
*/
class ParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animating = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawnBurst(x, y, count = 28) {
    const colors = ['#ff2a85', '#00f0ff', '#ffe600', '#39ff14', '#9d4edd', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        shape: Math.random() > 0.5 ? 'circle' : 'rect',
        alpha: 1,
        decay: Math.random() * 0.025 + 0.015,
        gravity: 0.22
      });
    }

    if (!this.animating) {
      this.animating = true;
      requestAnimationFrame(() => this.loop());
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);

      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.3);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

/* ============================================================================
   3. FUNNY TAUNT & QUOTE REPOSITORY
   ============================================================================
   Contextual roasts and emojis displayed as the button sneaks away!
*/
const TAUNT_QUOTES = [
  { text: "Too slow! Try again! 🐢", emoji: "🐢" },
  { text: "Missed me by an inch! 🤏", emoji: "🤏" },
  { text: "Did a snail teach you how to click? 🐌", emoji: "🐌" },
  { text: "My pet hamster has faster reflexes! 🐹", emoji: "🐹" },
  { text: "Nice try, slippery fingers! 🧈", emoji: "🧈" },
  { text: "Status 404: Reflexes not found! 🤖", emoji: "🤖" },
  { text: "Are your fingers made of warm jelly? 🍮", emoji: "🍮" },
  { text: "Error: Click too slow. Please recalibrate! 💻", emoji: "💻" },
  { text: "Whoosh! What a lovely breeze! 💨", emoji: "💨" },
  { text: "Did you just blink? Almost had me! 😉", emoji: "😉" },
  { text: "Acrobatic sidestep activated! 🤸‍♂️", emoji: "🤸‍♂️" },
  { text: "My evasion engine runs non-stop! 🛡️", emoji: "🛡️" },
  { text: "You clicked my shadow! Almost! 👻", emoji: "👻" },
  { text: "Is your mouse pointer on low battery? 🔋", emoji: "🔋" },
  { text: "Try using your other hand! 🖐️", emoji: "🖐️" },
  { text: "Catch me? Keep dreaming! 😴", emoji: "😴" },
  { text: "Pure velocity right here! ⚡", emoji: "⚡" },
  { text: "Sidestepping like a crab! 🦀", emoji: "🦀" },
  { text: "Did you click with your elbow? 😂", emoji: "😂" },
  { text: "Better luck on the next click! 🎯", emoji: "🎯" },
  { text: "Zoom! Gone like rocket fuel! 🚀", emoji: "🚀" },
  { text: "Nice air breeze you stirred up! 🌬️", emoji: "🌬️" },
  { text: "Was that a click or a stretch? 🥱", emoji: "🥱" },
  { text: "Too agile for your pointer! 🕺", emoji: "🕺" },
  { text: "Maybe chess is more your speed? ♟️", emoji: "♟️" }
];

const BUTTON_EMOJIS_NORMAL = ['😜', '😏', '😎', '👻', '🕺', '🥳', '🤪'];
const BUTTON_EMOJIS_DODGE  = ['😱', '🏃‍♂️', '💨', '🚀', '⚡', '🤸‍♂️', '🙀'];
const BUTTON_EMOJIS_CAUGHT = ['😵', '⭐', '💥', '🤕', '🥺', '🤯'];

/* ============================================================================
   4. MAIN GAME CONTROLLER CLASS
   ============================================================================
*/
class CatchMeGame {
  constructor() {
    // Sound & Particle Systems
    this.sound = new SoundEngine();
    this.particles = new ParticleEngine(document.getElementById('particleCanvas'));

    // Game State
    this.state = 'IDLE'; // 'IDLE', 'PLAYING', 'PAUSED', 'GAMEOVER'
    this.score = 0;
    this.timeLeft = 60;
    this.totalDuration = 60;
    this.timerInterval = null;

    // Stats
    this.catches = 0;
    this.escapes = 0;
    this.currentStreak = 0;
    this.bestStreak = 0;

    // Difficulty Settings
    this.difficulty = 'medium'; // 'easy', 'medium', 'hard'
    this.config = {
      easy: {
        baseDistance: 85,
        mobileDistance: 65,
        baseSpeed: 0.38, // CSS transition seconds
        acceleration: 0.04,
        maxSpeedMultiplier: 1.8,
        points: 100,
        jukeChance: 0
      },
      medium: {
        baseDistance: 125,
        mobileDistance: 95,
        baseSpeed: 0.26,
        acceleration: 0.07,
        maxSpeedMultiplier: 2.5,
        points: 150,
        jukeChance: 0.18
      },
      hard: {
        baseDistance: 165,
        mobileDistance: 125,
        baseSpeed: 0.16,
        acceleration: 0.10,
        maxSpeedMultiplier: 3.2,
        points: 250,
        jukeChance: 0.35
      }
    };

    this.speedMultiplier = 1.0;
    this.lastEscapeTime = 0;
    this.escapeCooldownMs = 120; // Prevent spamming escapes in a single frame

    // High Scores cache
    this.highScores = {
      easy: 0,
      medium: 0,
      hard: 0
    };

    // Cache DOM Elements
    this.dom = {
      arena: document.getElementById('gameArena'),
      runnerBtn: document.getElementById('runnerBtn'),
      runnerEmoji: document.getElementById('runnerEmoji'),
      runnerText: document.getElementById('runnerText'),
      tauntBubble: document.getElementById('tauntBubble'),
      bubbleEmoji: document.getElementById('bubbleEmoji'),
      bubbleText: document.getElementById('bubbleText'),
      tickerText: document.getElementById('tickerText'),
      clickContainer: document.getElementById('clickFeedbackContainer'),

      // Scoreboard
      scoreDisplay: document.getElementById('scoreDisplay'),
      scoreSparkle: document.getElementById('scoreSparkle'),
      timerDisplay: document.getElementById('timerDisplay'),
      timerBar: document.getElementById('timerBar'),
      timerCard: document.getElementById('timerCard'),
      highScoreDisplay: document.getElementById('highScoreDisplay'),
      streakCount: document.getElementById('streakCount'),
      escapesDisplay: document.getElementById('escapesDisplay'),
      speedValue: document.getElementById('speedValue'),

      // Controls
      startBtn: document.getElementById('startBtn'),
      pauseBtn: document.getElementById('pauseBtn'),
      restartBtn: document.getElementById('restartBtn'),
      soundToggleBtn: document.getElementById('soundToggleBtn'),
      soundIcon: document.getElementById('soundIcon'),
      soundText: document.getElementById('soundText'),
      helpBtn: document.getElementById('helpBtn'),
      diffBtns: document.querySelectorAll('.diff-btn'),

      // Arena Overlay
      arenaOverlay: document.getElementById('arenaOverlay'),
      overlayTitle: document.getElementById('overlayTitle'),
      overlayDesc: document.getElementById('overlayDesc'),
      overlayStartBtn: document.getElementById('overlayStartBtn'),

      // Modals
      gameOverModal: document.getElementById('gameOverModal'),
      modalTitle: document.getElementById('modalTitle'),
      modalAvatar: document.getElementById('modalAvatar'),
      modalRank: document.getElementById('modalRank'),
      modalQuote: document.getElementById('modalQuote'),
      modalFinalScore: document.getElementById('modalFinalScore'),
      modalDifficulty: document.getElementById('modalDifficulty'),
      modalCatches: document.getElementById('modalCatches'),
      modalEscapes: document.getElementById('modalEscapes'),
      modalAccuracy: document.getElementById('modalAccuracy'),
      modalHighScore: document.getElementById('modalHighScore'),
      newHighScoreBadge: document.getElementById('newHighScoreBadge'),
      modalPlayAgainBtn: document.getElementById('modalPlayAgainBtn'),
      shareScoreBtn: document.getElementById('shareScoreBtn'),

      rulesModal: document.getElementById('rulesModal'),
      closeRulesBtn: document.getElementById('closeRulesBtn'),
      rulesGotItBtn: document.getElementById('rulesGotItBtn'),
      toast: document.getElementById('toast')
    };

    // Current Button Position (percentages or pixels)
    this.btnPos = { x: 50, y: 50, inPercent: true };

    this.loadHighScores();
    this.updateSoundButtonUI();
    this.bindEvents();
    this.centerButton();
  }

  /* ==========================================================================
     High Score Persistence via LocalStorage
     ========================================================================== */
  loadHighScores() {
    try {
      const stored = localStorage.getItem('catchMe_highScores');
      if (stored) {
        this.highScores = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
    this.updateHighScoreDisplay();
  }

  saveHighScore(difficulty, score) {
    if (score > (this.highScores[difficulty] || 0)) {
      this.highScores[difficulty] = score;
      try {
        localStorage.setItem('catchMe_highScores', JSON.stringify(this.highScores));
      } catch (e) {}
      this.updateHighScoreDisplay();
      return true; // Is a new high score
    }
    return false;
  }

  updateHighScoreDisplay() {
    const currentHigh = this.highScores[this.difficulty] || 0;
    this.dom.highScoreDisplay.textContent = currentHigh.toLocaleString();
  }

  /* ==========================================================================
     Event Listeners & Input Handling
     ========================================================================== */
  bindEvents() {
    // Arena Mouse & Touch Tracking
    this.dom.arena.addEventListener('mousemove', (e) => this.handleCursorMove(e));
    this.dom.arena.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    this.dom.arena.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });

    // Target Button Click / Touch
    this.dom.runnerBtn.addEventListener('click', (e) => this.handleCatch(e));
    this.dom.runnerBtn.addEventListener('touchstart', (e) => {
      // Direct touch on button counts as catch
      this.handleCatch(e);
    }, { passive: false });

    // Toolbar Controls
    this.dom.startBtn.addEventListener('click', () => this.startGame());
    this.dom.overlayStartBtn.addEventListener('click', () => this.startGame());
    this.dom.pauseBtn.addEventListener('click', () => this.togglePause());
    this.dom.restartBtn.addEventListener('click', () => this.restartGame());

    // Sound Toggle
    this.dom.soundToggleBtn.addEventListener('click', () => {
      const isMuted = this.sound.toggleMute();
      this.updateSoundButtonUI();
      this.showToast(isMuted ? 'Sound Muted 🔇' : 'Sound Enabled 🔊');
    });

    // Difficulty Pills
    this.dom.diffBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const diff = btn.getAttribute('data-difficulty');
        this.setDifficulty(diff);
      });
    });

    // Modals
    this.dom.helpBtn.addEventListener('click', () => this.openRulesModal());
    this.dom.closeRulesBtn.addEventListener('click', () => this.closeRulesModal());
    this.dom.rulesGotItBtn.addEventListener('click', () => this.closeRulesModal());
    this.dom.modalPlayAgainBtn.addEventListener('click', () => {
      this.closeGameOverModal();
      this.startGame();
    });
    this.dom.shareScoreBtn.addEventListener('click', () => this.shareScore());

    // Window keyboard shortcuts (Space: Start/Pause, R: Restart, M: Mute)
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.state === 'IDLE' || this.state === 'GAMEOVER') {
          this.startGame();
        } else {
          this.togglePause();
        }
      } else if (e.code === 'KeyR') {
        this.restartGame();
      } else if (e.code === 'KeyM') {
        const isMuted = this.sound.toggleMute();
        this.updateSoundButtonUI();
        this.showToast(isMuted ? 'Sound Muted 🔇' : 'Sound Enabled 🔊');
      }
    });

    // Resize recalculation to keep button safely inside bounds
    window.addEventListener('resize', () => {
      this.clampButtonInArena();
    });
  }

  updateSoundButtonUI() {
    if (this.sound.muted) {
      this.dom.soundIcon.textContent = '🔇';
      this.dom.soundText.textContent = 'Muted';
      this.dom.soundToggleBtn.classList.add('muted');
    } else {
      this.dom.soundIcon.textContent = '🔊';
      this.dom.soundText.textContent = 'Sound ON';
      this.dom.soundToggleBtn.classList.remove('muted');
    }
  }

  /* ==========================================================================
     Difficulty Management
     ========================================================================== */
  setDifficulty(diff) {
    if (!this.config[diff]) return;
    this.difficulty = diff;

    this.dom.diffBtns.forEach((b) => {
      const active = b.getAttribute('data-difficulty') === diff;
      b.classList.toggle('active', active);
      b.setAttribute('aria-checked', active ? 'true' : 'false');
    });

    this.sound.playClick();
    this.updateHighScoreDisplay();
    this.resetSpeed();

    // If game is running, notify user
    if (this.state === 'PLAYING') {
      this.showToast(`Switched to ${diff.toUpperCase()} mode! 🔥`);
    }
  }

  resetSpeed() {
    this.speedMultiplier = 1.0;
    this.dom.speedValue.textContent = '1.0x';
    this.applyButtonTransition();
  }

  increaseSpeed() {
    const curConfig = this.config[this.difficulty];
    this.speedMultiplier = Math.min(
      curConfig.maxSpeedMultiplier,
      this.speedMultiplier + curConfig.acceleration
    );
    this.dom.speedValue.textContent = `${this.speedMultiplier.toFixed(1)}x`;
    this.applyButtonTransition();
  }

  applyButtonTransition() {
    const curConfig = this.config[this.difficulty];
    const duration = curConfig.baseSpeed / this.speedMultiplier;
    this.dom.runnerBtn.style.transition = `transform ${duration.toFixed(3)}s cubic-bezier(0.2, 0.9, 0.3, 1), left ${duration.toFixed(3)}s cubic-bezier(0.2, 0.9, 0.3, 1), top ${duration.toFixed(3)}s cubic-bezier(0.2, 0.9, 0.3, 1)`;
  }

  /* ==========================================================================
     Game Lifecycle Controls: Start, Pause, Resume, Restart, End
     ========================================================================== */
  startGame() {
    this.sound.init();
    this.sound.playClick();

    this.state = 'PLAYING';
    this.score = 0;
    this.timeLeft = this.totalDuration;
    this.catches = 0;
    this.escapes = 0;
    this.currentStreak = 0;
    this.bestStreak = 0;
    this.resetSpeed();

    // UI Updates
    this.updateScoreUI();
    this.updateTimerUI();
    this.dom.arenaOverlay.classList.add('hidden');
    this.closeGameOverModal();

    this.dom.startBtn.disabled = true;
    this.dom.pauseBtn.disabled = false;
    this.dom.pauseBtn.querySelector('.icon').textContent = '⏸';
    this.dom.pauseBtn.querySelector('.label').textContent = 'PAUSE';

    // Button personality reset
    this.setButtonEmoji('😜');
    this.setButtonText('CATCH ME!');
    this.centerButton();

    // Start Timer Interval
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.gameTick(), 1000);

    this.showRandomTaunt('Game started! Catch me if you dare! 🚀');
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.pauseGame();
    } else if (this.state === 'PAUSED') {
      this.resumeGame();
    }
  }

  pauseGame() {
    if (this.state !== 'PLAYING') return;
    this.state = 'PAUSED';
    clearInterval(this.timerInterval);
    this.sound.playClick();

    // Show paused banner on arena overlay
    this.dom.overlayTitle.textContent = 'GAME PAUSED ⏸';
    this.dom.overlayDesc.textContent = 'Take a breather! Click resume when you are ready to chase again.';
    this.dom.overlayStartBtn.innerHTML = '<span>▶</span> RESUME GAME';
    this.dom.arenaOverlay.classList.remove('hidden');

    this.dom.pauseBtn.querySelector('.icon').textContent = '▶';
    this.dom.pauseBtn.querySelector('.label').textContent = 'RESUME';
  }

  resumeGame() {
    if (this.state !== 'PAUSED') return;
    this.state = 'PLAYING';
    this.sound.playClick();

    this.dom.arenaOverlay.classList.add('hidden');
    this.dom.pauseBtn.querySelector('.icon').textContent = '⏸';
    this.dom.pauseBtn.querySelector('.label').textContent = 'PAUSE';

    // Resume timer
    this.timerInterval = setInterval(() => this.gameTick(), 1000);
  }

  restartGame() {
    this.sound.playClick();
    clearInterval(this.timerInterval);
    this.startGame();
  }

  gameTick() {
    if (this.state !== 'PLAYING') return;

    this.timeLeft--;
    this.updateTimerUI();

    if (this.timeLeft <= 10 && this.timeLeft > 0) {
      this.dom.timerCard.classList.add('urgent');
      this.sound.playUrgentTick();
    } else if (this.timeLeft > 10) {
      this.dom.timerCard.classList.remove('urgent');
      this.sound.playTick();
    }

    if (this.timeLeft <= 0) {
      this.endGame();
    }
  }

  updateTimerUI() {
    this.dom.timerDisplay.innerHTML = `${this.timeLeft}<small>s</small>`;
    const pct = (this.timeLeft / this.totalDuration) * 100;
    this.dom.timerBar.style.width = `${Math.max(0, pct)}%`;
  }

  updateScoreUI() {
    this.dom.scoreDisplay.textContent = this.score.toLocaleString();
    this.dom.streakCount.textContent = `${this.currentStreak}x`;
    this.dom.escapesDisplay.textContent = this.escapes;
  }

  endGame() {
    this.state = 'GAMEOVER';
    clearInterval(this.timerInterval);
    this.dom.timerCard.classList.remove('urgent');

    this.dom.startBtn.disabled = false;
    this.dom.pauseBtn.disabled = true;

    // Check High Score
    const isNewHigh = this.saveHighScore(this.difficulty, this.score);
    this.sound.playGameOver(isNewHigh);

    // Calculate Accuracy & Performance Rank
    const totalInteractions = this.catches + this.escapes;
    const accuracy = totalInteractions > 0 ? Math.round((this.catches / totalInteractions) * 100) : 0;
    const rankInfo = this.calculateRank(this.catches, accuracy);

    // Populate Game Over Modal
    this.dom.modalFinalScore.textContent = this.score.toLocaleString();
    this.dom.modalDifficulty.textContent = this.difficulty.toUpperCase();
    this.dom.modalCatches.textContent = this.catches;
    this.dom.modalEscapes.textContent = this.escapes;
    this.dom.modalAccuracy.textContent = `${accuracy}%`;
    this.dom.modalHighScore.textContent = (this.highScores[this.difficulty] || 0).toLocaleString();

    this.dom.modalTitle.textContent = isNewHigh ? '🎉 NEW RECORD!' : "TIME'S UP!";
    this.dom.modalAvatar.textContent = rankInfo.avatar;
    this.dom.modalRank.textContent = rankInfo.title;
    this.dom.modalQuote.textContent = `"${rankInfo.quote}"`;

    if (isNewHigh) {
      this.dom.newHighScoreBadge.classList.remove('hidden');
      // Confetti burst for high score celebration
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      this.particles.spawnBurst(cx, cy, 75);
    } else {
      this.dom.newHighScoreBadge.classList.add('hidden');
    }

    this.openGameOverModal();
  }

  calculateRank(catches, accuracy) {
    if (catches === 0) {
      return {
        avatar: '🥔',
        title: 'Certified Couch Potato',
        quote: 'Did you forget to plug in your mouse? Zero catches!'
      };
    } else if (catches <= 3) {
      return {
        avatar: '🐌',
        title: 'Sleepy Snail',
        quote: 'Slow and steady does NOT win this race.'
      };
    } else if (catches <= 7) {
      return {
        avatar: '🐢',
        title: 'Distracted Turtle',
        quote: 'You got some catches, but the button mostly laughed at you.'
      };
    } else if (catches <= 12) {
      return {
        avatar: '🐱',
        title: 'Curious Cat',
        quote: 'Decent paw-eye coordination! Keep training those claws.'
      };
    } else if (catches <= 18) {
      return {
        avatar: '🥷',
        title: 'Reflex Ninja',
        quote: 'Impessive evasion breaking! The button was trembling.'
      };
    } else if (catches <= 25) {
      return {
        avatar: '⚡',
        title: 'Lightning Wizard',
        quote: 'Astonishing speed! You read the button\'s mind.'
      };
    } else {
      return {
        avatar: '👑',
        title: 'Cybernetic God of Speed',
        quote: 'Incredible! You broke the button\'s spirit. Masterclass!'
      };
    }
  }

  /* ==========================================================================
     Button Placement, Bounds Clamping & Proximity Physics
     ========================================================================== */
  centerButton() {
    this.btnPos = { x: 50, y: 50, inPercent: true };
    this.dom.runnerBtn.style.left = '50%';
    this.dom.runnerBtn.style.top = '50%';
  }

  clampButtonInArena() {
    const arenaRect = this.dom.arena.getBoundingClientRect();
    const btnRect = this.dom.runnerBtn.getBoundingClientRect();

    const padding = 20;
    const minX = btnRect.width / 2 + padding;
    const maxX = arenaRect.width - btnRect.width / 2 - padding;
    const minY = btnRect.height / 2 + padding;
    const maxY = arenaRect.height - btnRect.height / 2 - padding;

    let curPxX = (this.btnPos.x / 100) * arenaRect.width;
    let curPxY = (this.btnPos.y / 100) * arenaRect.height;

    curPxX = Math.max(minX, Math.min(maxX, curPxX));
    curPxY = Math.max(minY, Math.min(maxY, curPxY));

    this.btnPos.x = (curPxX / arenaRect.width) * 100;
    this.btnPos.y = (curPxY / arenaRect.height) * 100;

    this.dom.runnerBtn.style.left = `${this.btnPos.x.toFixed(2)}%`;
    this.dom.runnerBtn.style.top = `${this.btnPos.y.toFixed(2)}%`;
  }

  handleCursorMove(e) {
    if (this.state !== 'PLAYING') return;

    const arenaRect = this.dom.arena.getBoundingClientRect();
    const cursorX = e.clientX - arenaRect.left;
    const cursorY = e.clientY - arenaRect.top;

    this.checkProximityAndEscape(cursorX, cursorY, false);
  }

  handleTouchMove(e) {
    if (this.state !== 'PLAYING') return;
    if (e.touches.length > 0) {
      e.preventDefault();
      const arenaRect = this.dom.arena.getBoundingClientRect();
      const touch = e.touches[0];
      const touchX = touch.clientX - arenaRect.left;
      const touchY = touch.clientY - arenaRect.top;
      this.checkProximityAndEscape(touchX, touchY, true);
    }
  }

  handleTouchStart(e) {
    if (this.state !== 'PLAYING') return;
    if (e.touches.length > 0) {
      const arenaRect = this.dom.arena.getBoundingClientRect();
      const touch = e.touches[0];
      const touchX = touch.clientX - arenaRect.left;
      const touchY = touch.clientY - arenaRect.top;
      this.checkProximityAndEscape(touchX, touchY, true);
    }
  }

  /**
   * Core avoidance logic:
   * Calculates Euclidean distance from pointer to button center.
   * If closer than threshold, computes an evasion vector away from pointer,
   * adds angular juke/noise, clamps inside safe arena bounds, and moves.
   */
  checkProximityAndEscape(pointerX, pointerY, isTouch = false) {
    const now = Date.now();
    if (now - this.lastEscapeTime < this.escapeCooldownMs) return;

    const arenaRect = this.dom.arena.getBoundingClientRect();
    const btnRect = this.dom.runnerBtn.getBoundingClientRect();

    const btnCenterX = (btnRect.left + btnRect.width / 2) - arenaRect.left;
    const btnCenterY = (btnRect.top + btnRect.height / 2) - arenaRect.top;

    const dx = pointerX - btnCenterX;
    const dy = pointerY - btnCenterY;
    const distance = Math.hypot(dx, dy);

    const curConfig = this.config[this.difficulty];
    const threshold = isTouch ? curConfig.mobileDistance : curConfig.baseDistance;

    if (distance < threshold) {
      this.lastEscapeTime = now;
      this.performEscape(pointerX, pointerY, btnCenterX, btnCenterY, arenaRect, btnRect);
    }
  }

  performEscape(pointerX, pointerY, btnCenterX, btnCenterY, arenaRect, btnRect) {
    this.escapes++;
    this.currentStreak = 0; // Combo resets when button escapes
    this.updateScoreUI();
    this.increaseSpeed();

    // Trigger visual dodge squash & audio
    this.dom.runnerBtn.classList.add('dodging');
    setTimeout(() => this.dom.runnerBtn.classList.remove('dodging'), 250);
    this.sound.playDodge();

    // Randomize face
    const randomFace = BUTTON_EMOJIS_DODGE[Math.floor(Math.random() * BUTTON_EMOJIS_DODGE.length)];
    this.setButtonEmoji(randomFace);
    setTimeout(() => {
      if (this.state === 'PLAYING') {
        const calmFace = BUTTON_EMOJIS_NORMAL[Math.floor(Math.random() * BUTTON_EMOJIS_NORMAL.length)];
        this.setButtonEmoji(calmFace);
      }
    }, 400);

    // Occasional silly speech taunt bubble
    if (Math.random() < 0.45) {
      this.triggerTauntBubble(btnCenterX, btnCenterY);
    }

    // Safety margins
    const pad = 24;
    const minX = btnRect.width / 2 + pad;
    const maxX = arenaRect.width - btnRect.width / 2 - pad;
    const minY = btnRect.height / 2 + pad;
    const maxY = arenaRect.height - btnRect.height / 2 - pad;

    // Evasion Vector: Move away from cursor
    let awayAngle = Math.atan2(btnCenterY - pointerY, btnCenterX - pointerX);

    // Juke / feint chance based on difficulty
    const curConfig = this.config[this.difficulty];
    if (Math.random() < curConfig.jukeChance) {
      // Fake-out sharp 90-degree sidestep
      awayAngle += (Math.random() > 0.5 ? 1 : -1) * (Math.PI / 2);
    } else {
      // Slight randomized arc (±40 degrees) so movement is unpredictable
      awayAngle += (Math.random() - 0.5) * (Math.PI / 2.2);
    }

    // Jump distance scales with difficulty
    const jumpDistance = Math.min(arenaRect.width, arenaRect.height) * (0.35 + Math.random() * 0.35);

    let targetX = btnCenterX + Math.cos(awayAngle) * jumpDistance;
    let targetY = btnCenterY + Math.sin(awayAngle) * jumpDistance;

    // Corner Avoidance / Edge Bounce: If target pushes outside safe arena bounds,
    // invert direction towards arena center with extra flair
    if (targetX < minX || targetX > maxX || targetY < minY || targetY > maxY) {
      const centerX = arenaRect.width / 2;
      const centerY = arenaRect.height / 2;
      // Slingshot towards center-ish quadrant
      targetX = centerX + (Math.random() - 0.5) * (arenaRect.width * 0.4);
      targetY = centerY + (Math.random() - 0.5) * (arenaRect.height * 0.4);
    }

    // Hard clamp to ensure zero overflow outside arena
    targetX = Math.max(minX, Math.min(maxX, targetX));
    targetY = Math.max(minY, Math.min(maxY, targetY));

    // Convert to percentage for responsive scaling
    this.btnPos.x = (targetX / arenaRect.width) * 100;
    this.btnPos.y = (targetY / arenaRect.height) * 100;

    this.dom.runnerBtn.style.left = `${this.btnPos.x.toFixed(2)}%`;
    this.dom.runnerBtn.style.top = `${this.btnPos.y.toFixed(2)}%`;
  }

  /* ==========================================================================
     Successful Catch Handler
     ========================================================================== */
  handleCatch(e) {
    if (this.state !== 'PLAYING') return;
    e.stopPropagation();

    this.catches++;
    this.currentStreak++;
    if (this.currentStreak > this.bestStreak) {
      this.bestStreak = this.currentStreak;
    }

    // Multiplier bonus for combos
    const multiplier = 1 + (this.currentStreak - 1) * 0.25;
    const basePts = this.config[this.difficulty].points;
    const earnedPoints = Math.round(basePts * multiplier);
    this.score += earnedPoints;

    // Sound & Particles
    this.sound.playCatch();
    const btnRect = this.dom.runnerBtn.getBoundingClientRect();
    const clickX = btnRect.left + btnRect.width / 2;
    const clickY = btnRect.top + btnRect.height / 2;
    this.particles.spawnBurst(clickX, clickY, 32);

    // Button visual feedback: caught spin & expression
    const caughtFace = BUTTON_EMOJIS_CAUGHT[Math.floor(Math.random() * BUTTON_EMOJIS_CAUGHT.length)];
    this.setButtonEmoji(caughtFace);
    this.setButtonText('OUCH!');
    this.dom.runnerBtn.classList.add('caught');

    // Floating Points Feedback (+150! COMBO x2!)
    this.showClickFeedback(clickX, clickY, earnedPoints, this.currentStreak);

    // Score Sparkle in stat card
    this.triggerScoreSparkle(`+${earnedPoints}`);
    this.updateScoreUI();

    // After brief stun, button recovers and dashes to a fresh safe spot
    setTimeout(() => {
      this.dom.runnerBtn.classList.remove('caught');
      this.setButtonEmoji('😜');
      this.setButtonText('CATCH ME!');
      if (this.state === 'PLAYING') {
        this.relocateButtonRandomly();
      }
    }, 380);
  }

  relocateButtonRandomly() {
    const arenaRect = this.dom.arena.getBoundingClientRect();
    const btnRect = this.dom.runnerBtn.getBoundingClientRect();

    const pad = 30;
    const minX = btnRect.width / 2 + pad;
    const maxX = arenaRect.width - btnRect.width / 2 - pad;
    const minY = btnRect.height / 2 + pad;
    const maxY = arenaRect.height - btnRect.height / 2 - pad;

    const randX = minX + Math.random() * (maxX - minX);
    const randY = minY + Math.random() * (maxY - minY);

    this.btnPos.x = (randX / arenaRect.width) * 100;
    this.btnPos.y = (randY / arenaRect.height) * 100;

    this.dom.runnerBtn.style.left = `${this.btnPos.x.toFixed(2)}%`;
    this.dom.runnerBtn.style.top = `${this.btnPos.y.toFixed(2)}%`;
  }

  showClickFeedback(screenX, screenY, pts, streak) {
    const arenaRect = this.dom.arena.getBoundingClientRect();
    const relX = screenX - arenaRect.left;
    const relY = screenY - arenaRect.top;

    const el = document.createElement('div');
    el.className = 'click-float-msg';
    el.style.left = `${relX}px`;
    el.style.top = `${relY}px`;
    el.innerHTML = streak > 1 ? `+${pts} <small>COMBO x${streak}!</small>` : `+${pts}`;

    this.dom.clickContainer.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 950);
  }

  triggerScoreSparkle(text) {
    this.dom.scoreSparkle.textContent = text;
    this.dom.scoreSparkle.classList.add('pop');
    setTimeout(() => this.dom.scoreSparkle.classList.remove('pop'), 400);
  }

  /* ==========================================================================
     Funny Speech Bubble & Roasts
     ========================================================================== */
  triggerTauntBubble(btnX, btnY) {
    const taunt = TAUNT_QUOTES[Math.floor(Math.random() * TAUNT_QUOTES.length)];
    this.dom.bubbleEmoji.textContent = taunt.emoji;
    this.dom.bubbleText.textContent = taunt.text;

    // Smart position bubble so it doesn't clip outside arena bounds
    const bubble = this.dom.tauntBubble;
    const arenaRect = this.dom.arena.getBoundingClientRect();

    let bubbleX = btnX - 40;
    let bubbleY = btnY - 65;

    // Horizontal bounds
    bubbleX = Math.max(15, Math.min(arenaRect.width - 240, bubbleX));
    // If too close to top, show below button
    if (bubbleY < 15) {
      bubbleY = btnY + 45;
    }

    bubble.style.left = `${bubbleX}px`;
    bubble.style.top = `${bubbleY}px`;
    bubble.classList.add('visible');

    // Update bottom ticker
    this.dom.tickerText.textContent = `"${taunt.text}"`;

    clearTimeout(this.tauntTimeout);
    this.tauntTimeout = setTimeout(() => {
      bubble.classList.remove('visible');
    }, 1400);
  }

  showRandomTaunt(overrideText = null) {
    if (overrideText) {
      this.dom.tickerText.textContent = overrideText;
      return;
    }
    const t = TAUNT_QUOTES[Math.floor(Math.random() * TAUNT_QUOTES.length)];
    this.dom.tickerText.textContent = `"${t.text}"`;
  }

  setButtonEmoji(emoji) {
    this.dom.runnerEmoji.textContent = emoji;
  }

  setButtonText(text) {
    this.dom.runnerText.textContent = text;
  }

  /* ==========================================================================
     Modals & Toast System
     ========================================================================== */
  openGameOverModal() {
    this.dom.gameOverModal.classList.add('active');
  }

  closeGameOverModal() {
    this.dom.gameOverModal.classList.remove('active');
  }

  openRulesModal() {
    if (this.state === 'PLAYING') {
      this.pauseGame();
    }
    this.dom.rulesModal.classList.add('active');
  }

  closeRulesModal() {
    this.dom.rulesModal.classList.remove('active');
  }

  showToast(message) {
    this.dom.toast.textContent = message;
    this.dom.toast.classList.add('visible');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.dom.toast.classList.remove('visible');
    }, 2000);
  }

  shareScore() {
    const shareText = `🏃‍♂️💨 I scored ${this.score.toLocaleString()} points in Catch Me If You Can (${this.difficulty.toUpperCase()} mode)! Can you catch the cheeky button? 😜`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText)
        .then(() => this.showToast('Score copied to clipboard! 📋'))
        .catch(() => this.fallbackShare(shareText));
    } else {
      this.fallbackShare(shareText);
    }
  }

  fallbackShare(text) {
    window.prompt('Copy your score to share:', text);
  }
}

/* ============================================================================
   5. BOOTSTRAP INITIALIZATION ON DOM READY
   ============================================================================
*/
document.addEventListener('DOMContentLoaded', () => {
  window.game = new CatchMeGame();
});

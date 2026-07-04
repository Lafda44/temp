// ===== STARS =====
const starsContainer = document.getElementById('stars');
for (let i = 0; i < 150; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.left = Math.random() * 100 + '%';
  star.style.top = Math.random() * 100 + '%';
  star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
  star.style.setProperty('--max-opacity', (Math.random() * 0.6 + 0.3));
  star.style.animationDelay = Math.random() * 5 + 's';
  star.style.width = star.style.height = (Math.random() * 2.5 + 1) + 'px';
  starsContainer.appendChild(star);
}

// ===== FALLING HEARTS =====
const fallingContainer = document.getElementById('fallingHearts');
const heartSymbols = ['❤', '💕', '💗', '💖', '💝', '🥰', '💘'];

function createFallingHeart() {
  const el = document.createElement('div');
  el.className = 'fall-heart';
  el.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  el.style.left = Math.random() * 100 + '%';
  el.style.fontSize = (Math.random() * 18 + 12) + 'px';
  el.style.animationDuration = (Math.random() * 5 + 5) + 's';
  el.style.opacity = '0';
  fallingContainer.appendChild(el);
  setTimeout(() => el.remove(), 10000);
}

setInterval(createFallingHeart, 350);
for (let i = 0; i < 8; i++) setTimeout(createFallingHeart, i * 300);

// ===== CANVAS HEARTS =====
const canvas = document.getElementById('heartsCanvas');
const ctx = canvas.getContext('2d');
let heartParticles = [];
let mouseX = 0, mouseY = 0;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class HeartParticle {
  constructor() { this.reset(); }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 20;
    this.size = Math.random() * 14 + 8;
    this.speedY = Math.random() * -0.4 - 0.2;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.swing = Math.random() * 2;
    this.swingSpeed = Math.random() * 0.02 + 0.005;
    this.angle = Math.random() * Math.PI * 2;
    this.opacity = Math.random() * 0.25 + 0.08;
    this.hue = Math.random() * 25 + 340;
    this.glow = Math.random() * 10 + 5;
    this.symbols = ['❤', '💕', '💗', '💖'];
    this.symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
  }

  update() {
    this.angle += this.swingSpeed;
    this.x += this.speedX + Math.sin(this.angle) * this.swing;
    this.y += this.speedY;

    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      this.x -= dx * 0.003;
      this.y -= dy * 0.003;
    }

    if (this.y < -40) this.reset();
    if (this.x < -30 || this.x > canvas.width + 30) this.speedX *= -1;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.shadowColor = `hsla(${this.hue}, 80%, 65%, ${this.opacity * 0.5})`;
    ctx.shadowBlur = this.glow;
    ctx.font = `${this.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = this.opacity;
    ctx.fillText(this.symbol, 0, 0);
    ctx.restore();
  }
}

for (let i = 0; i < 30; i++) {
  const h = new HeartParticle();
  h.y = Math.random() * canvas.height;
  heartParticles.push(h);
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  heartParticles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateCanvas);
}

animateCanvas();

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// ===== CARD NAVIGATION =====
let currentCard = 0;
const cards = [
  document.getElementById('cardLove'),
  document.getElementById('cardQuestion'),
  document.getElementById('cardCelebration')
];

function showCard(index) {
  cards.forEach((c, i) => {
    if (i === index) {
      c.classList.remove('hidden');
      c.style.animation = 'none';
      void c.offsetHeight;
      c.style.animation = 'cardEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    } else {
      c.classList.add('hidden');
    }
  });
  currentCard = index;
}

document.getElementById('nextBtn').addEventListener('click', () => {
  showCard(1);
  setTimeout(staggerReasons, 300);
});

// ===== STAGGER REASONS ON QUESTION CARD =====
function staggerReasons() {
  const reasons = document.querySelectorAll('#reasonsContainer .reason');
  reasons.forEach((r, i) => {
    r.classList.remove('show');
    setTimeout(() => r.classList.add('show'), i * 150);
  });
}

// Initial stagger on page load
setTimeout(staggerReasons, 500);

// ===== YES / NO BUTTONS =====
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

yesBtn.addEventListener('click', () => {
  showCard(2);
  launchConfetti();
});

noBtn.addEventListener('mouseenter', () => {
  const x = (Math.random() - 0.5) * 200;
  const y = (Math.random() - 0.5) * 100;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
  noBtn.style.transition = 'transform 0.2s ease-out';
});

noBtn.addEventListener('click', () => {
  const x = (Math.random() - 0.5) * 300;
  const y = (Math.random() - 0.5) * 150;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
});

// ===== CONFETTI =====
function launchConfetti() {
  const colors = ['#ff3366', '#ff1493', '#ff6b6b', '#ffd700', '#ff8c00', '#ff69b4', '#ff4500', '#adff2f'];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random() * 100 + '%';
    el.style.top = '-10px';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.width = (Math.random() * 8 + 5) + 'px';
    el.style.height = (Math.random() * 8 + 5) + 'px';
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    el.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
    el.style.animationDelay = Math.random() * 2 + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
}

// ===== LOVE COUNTER =====
function updateCounter() {
  const start = new Date('2024-01-01');
  const now = new Date();
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  document.getElementById('counter').innerHTML = `💕 ${diff} days of love<br>and counting forever...`;
}
updateCounter();
setInterval(updateCounter, 60000);

// ===== MUSIC (Web Audio) =====
let audioCtx = null;
let isPlaying = false;
const musicBtn = document.getElementById('musicToggle');
let musicNodes = [];

function playTone(freq, duration, startTime) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.08, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
  musicNodes.push({ osc, gain, end: startTime + duration });
}

const melody = [
  { note: 523.25, dur: 0.4 }, { note: 587.33, dur: 0.3 },
  { note: 659.25, dur: 0.4 }, { note: 698.46, dur: 0.3 },
  { note: 783.99, dur: 0.6 }, { note: 698.46, dur: 0.3 },
  { note: 659.25, dur: 0.4 }, { note: 587.33, dur: 0.3 },
  { note: 523.25, dur: 0.8 }, { note: 0, dur: 0.2 },
  { note: 659.25, dur: 0.4 }, { note: 698.46, dur: 0.3 },
  { note: 783.99, dur: 0.6 }, { note: 880, dur: 0.4 },
  { note: 783.99, dur: 0.3 }, { note: 698.46, dur: 0.4 },
  { note: 659.25, dur: 0.3 }, { note: 587.33, dur: 0.8 },
];

let melodyInterval = null;

function startMusic() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  isPlaying = true;
  musicBtn.classList.add('playing');

  function playLoop() {
    if (!isPlaying) return;
    const now = audioCtx.currentTime;
    let time = now;
    melody.forEach(m => {
      if (m.note > 0) playTone(m.note, m.dur, time);
      time += m.dur;
    });
    melodyInterval = setTimeout(playLoop, (time - now) * 1000 + 200);
  }

  playLoop();
}

function stopMusic() {
  isPlaying = false;
  musicBtn.classList.remove('playing');
  clearTimeout(melodyInterval);
  musicNodes.forEach(n => {
    try { n.osc.stop(); } catch (e) {}
  });
  musicNodes = [];
}

musicBtn.addEventListener('click', () => {
  isPlaying ? stopMusic() : startMusic();
});

// ===== CLICK SPARKLE =====
document.addEventListener('click', e => {
  for (let i = 0; i < 10; i++) {
    const spark = document.createElement('div');
    spark.textContent = ['❤', '💕', '✨', '💖', '💗', '🩷'][Math.floor(Math.random() * 6)];
    spark.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      font-size: ${Math.random() * 10 + 14}px;
      pointer-events: none;
      z-index: 999;
      transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 1;
    `;
    document.body.appendChild(spark);
    const angle = (Math.PI * 2 / 10) * i + Math.random() * 0.5;
    const dist = Math.random() * 90 + 40;
    requestAnimationFrame(() => {
      spark.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0.3)`;
      spark.style.opacity = '0';
    });
    setTimeout(() => spark.remove(), 1000);
  }
});

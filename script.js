/* ══════════════════════════════════════════
   CURSOR GLOW
══════════════════════════════════════════ */
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let glowX = mouseX, glowY = mouseY;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

(function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateCursor);
})();

/* ══════════════════════════════════════════
   HERO CANVAS — animated particles & lines
══════════════════════════════════════════ */
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 212, 255, ${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 14000);
  for (let i = 0; i < count; i++) particles.push(new Particle());
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateCanvas);
}

const ro = new ResizeObserver(() => { resizeCanvas(); initParticles(); });
ro.observe(canvas);
resizeCanvas(); initParticles(); animateCanvas();

/* ══════════════════════════════════════════
   NAVBAR — scroll solid + active link
══════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');
const allSections = document.querySelectorAll('section[id]');

function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  let current = '';
  allSections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 90) current = sec.id;
  });
  navLinkEls.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Mobile nav */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navLinks');
navToggle.addEventListener('click', () => { navMenu.classList.toggle('open'); });
navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navMenu.classList.remove('open'));
});

/* ══════════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    }
  });
});

/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.children].filter(el => el.classList.contains('reveal'));
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), idx * 90);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* Hero reveal — triggered immediately */
const heroRevEls = document.querySelectorAll('.reveal-hero');
heroRevEls.forEach(el => {
  // small delay for DOMContentLoaded fade-in
  setTimeout(() => el.classList.add('visible'), 200);
});

/* ══════════════════════════════════════════
   TYPEWRITER
══════════════════════════════════════════ */
const roles = [
  'Quantitative Analyst',
  'Portfolio Optimizer',
  'Fixed Income Strategist',
  'Data Engineer',
  'ML Practitioner',
];
const tw = document.getElementById('typewriter');
let ri = 0, ci = 0, deleting = false;

function typewriterTick() {
  const role = roles[ri];
  if (!deleting) {
    ci++;
    tw.textContent = role.slice(0, ci);
    if (ci === role.length) {
      deleting = true;
      setTimeout(typewriterTick, 1800);
      return;
    }
    setTimeout(typewriterTick, 70);
  } else {
    ci--;
    tw.textContent = role.slice(0, ci);
    if (ci === 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
      setTimeout(typewriterTick, 300);
      return;
    }
    setTimeout(typewriterTick, 38);
  }
}
setTimeout(typewriterTick, 1000);

/* ══════════════════════════════════════════
   ANIMATED COUNTERS
══════════════════════════════════════════ */
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(easeOut(progress) * target);
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = target;
  }
  requestAnimationFrame(frame);
}

const statNums = document.querySelectorAll('.stat-num');
let countersStarted = false;
const statsSection = document.getElementById('hero');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !countersStarted) {
      countersStarted = true;
      setTimeout(() => {
        statNums.forEach(animateCounter);
      }, 900);
    }
  });
}, { threshold: 0.5 });
if (statsSection) counterObs.observe(statsSection);

/* ══════════════════════════════════════════
   FOOTER YEAR
══════════════════════════════════════════ */
document.getElementById('year').textContent = new Date().getFullYear();

/* ══════════════════════════════════════════
   PILL STAGGER ANIMATION
══════════════════════════════════════════ */
const pillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const pills = entry.target.querySelectorAll('.pill, .tag');
    pills.forEach((pill, i) => {
      pill.style.opacity = '0';
      pill.style.transform = 'translateY(8px)';
      setTimeout(() => {
        pill.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        pill.style.opacity = '1';
        pill.style.transform = 'none';
      }, i * 50);
    });
    pillObs.unobserve(entry.target);
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-block').forEach(b => pillObs.observe(b));

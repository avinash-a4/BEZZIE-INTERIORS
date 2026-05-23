/* ─── js/hero.js — Canvas particles, parallax, video zoom ─── */

const Hero = (() => {
  let canvas, ctx, particles = [], W, H, mouse = { x: 0.5, y: 0.5 };
  let animFrame, isReduced = Utils.isMobile();

  /* ── Particles ── */
  function createParticle() {
    return {
      x: Utils.randomBetween(0, W),
      y: Utils.randomBetween(H * 0.2, H),
      size: Utils.randomBetween(0.5, 2.5),
      speedX: Utils.randomBetween(-0.4, 0.4),
      speedY: Utils.randomBetween(-0.8, -0.2),
      opacity: 0,
      maxOpacity: Utils.randomBetween(0.2, 0.8),
      life: 0,
      maxLife: Utils.randomInt(120, 280),
      hue: Utils.randomBetween(42, 55),
    };
  }

  function drawParticle(p) {
    const progress = p.life / p.maxLife;
    const fade = progress < 0.1 ? progress / 0.1 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
    p.opacity = p.maxOpacity * fade;
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = `hsl(${p.hue}, 80%, 65%)`;
    ctx.shadowColor = `hsl(${p.hue}, 90%, 70%)`;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    const maxP = isReduced ? 30 : 80;
    if (particles.length < maxP) particles.push(createParticle());

    particles = particles.filter(p => {
      p.life++;
      p.x += p.speedX + (mouse.x - 0.5) * 0.2;
      p.y += p.speedY;
      drawParticle(p);
      return p.life < p.maxLife;
    });

    animFrame = requestAnimationFrame(tick);
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    isReduced = Utils.isMobile();
  }

  /* ── Parallax ── */
  function onMouseMove(e) {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
    const dx = (mouse.x - 0.5) * 8;
    const dy = (mouse.y - 0.5) * 4;
    const teal = document.querySelector('.hero-ov-teal');
    const fog  = document.querySelector('.hero-ov-fog');
    const portal = document.querySelector('.hero-portal');
    const depth = document.querySelector('.hero-depth-layer');
    if (teal) teal.style.transform = `translate(${dx * 0.4}px, ${dy * 0.4}px)`;
    if (fog)  fog.style.transform  = `translate(${dx * 0.2}px, ${dy * 0.2}px)`;
    if (depth) depth.style.transform = `translate(${dx * 0.6}px, ${dy * 0.6}px)`;
    if (portal) portal.style.transform = `translateX(calc(-50% + ${dx * 0.3}px)) scale(0.82)`;
  }

  /* ── Video Scroll Zoom ── */
  function initVideoZoom() {
    // Disabled JS scroll zoom so the CSS breatheZoom animation can control the scale
    return;
  }

  /* ── Video Fallback ── */
  function initVideo() {
    const video = document.getElementById('hero-video');
    if (!video) return;
    video.addEventListener('error', () => {
      document.querySelector('.hero-fallback-bg').style.zIndex = '1';
      video.style.display = 'none';
    });
  }

  /* ── Init ── */
  function init() {
    canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', Utils.debounce(resize, 200));
    window.addEventListener('mousemove', onMouseMove);
    tick();
    initVideoZoom();
    initVideo();
  }

  return { init };
})();

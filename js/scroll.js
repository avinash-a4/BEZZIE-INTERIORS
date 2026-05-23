/* ─── js/scroll.js — GSAP ScrollTrigger storytelling ─── */

const ScrollAnimations = (() => {

  function init() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* ── Smooth Scroll ── */
    gsap.to(window, { duration: 0 });

    /* ── Generic reveals ── */
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    });
    gsap.utils.toArray('.reveal-fade').forEach(el => {
      gsap.to(el, {
        opacity: 1, duration: 1.4, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
      });
    });
    gsap.utils.toArray('.reveal-left').forEach(el => {
      gsap.to(el, {
        opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    });
    gsap.utils.toArray('.reveal-right').forEach(el => {
      gsap.to(el, {
        opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    });

    /* ── Story section text stagger ── */
    const storyLines = document.querySelectorAll('.story-line');
    storyLines.forEach((line, i) => {
      gsap.from(line, {
        opacity: 0, y: 40, duration: 1.2, ease: 'power3.out', delay: i * 0.2,
        scrollTrigger: { trigger: '#story', start: 'top 70%' }
      });
    });

    /* ── Service chapters stagger ── */
    gsap.utils.toArray('.service-chapter').forEach((ch, i) => {
      gsap.from(ch, {
        opacity: 0, y: 60, duration: 1, ease: 'power3.out', delay: i * 0.1,
        scrollTrigger: { trigger: ch, start: 'top 88%', toggleActions: 'play none none reverse' }
      });
    });

    /* ── Project panels parallax ── */
    gsap.utils.toArray('.project-panel').forEach(panel => {
      const img = panel.querySelector('.project-img');
      if (!img) return;
      gsap.to(img, {
        yPercent: -12, ease: 'none',
        scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      });
    });

    /* ── Project info reveal ── */
    gsap.utils.toArray('.project-info').forEach(info => {
      gsap.from(info, {
        opacity: 0, x: -40, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: info, start: 'top 80%' }
      });
    });

    /* ── Experience quote ── */
    const expLines = document.querySelectorAll('.exp-line');
    expLines.forEach((line, i) => {
      gsap.from(line, {
        opacity: 0, y: 30, duration: 1.4, ease: 'power3.out', delay: i * 0.25,
        scrollTrigger: { trigger: '#experience', start: 'top 65%' }
      });
    });

    /* ── Testimonial inscriptions ── */
    gsap.utils.toArray('.inscription').forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 60, rotateX: 15, duration: 1.2, ease: 'power3.out', delay: i * 0.2,
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    /* ── Process timeline draw ── */
    const fill = document.querySelector('.timeline-line-fill');
    if (fill) {
      gsap.to(fill, {
        height: '100%', ease: 'none',
        scrollTrigger: { trigger: '#process', start: 'top 70%', end: 'bottom 80%', scrub: 1 }
      });
    }
    gsap.utils.toArray('.process-step').forEach((step, i) => {
      gsap.from(step, {
        opacity: 0, x: -30, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: step, start: 'top 85%' }
      });
    });

    /* ── Myth pillars reveal ── */
    gsap.utils.toArray('.pillar').forEach((p, i) => {
      gsap.from(p, {
        scaleY: 0, transformOrigin: 'bottom', duration: 1.4, ease: 'power3.out', delay: i * 0.12,
        scrollTrigger: { trigger: '#mythology', start: 'top 70%' }
      });
    });

    /* ── Footer brand ── */
    gsap.from('.footer-brand h2', {
      opacity: 0, y: 40, duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: '#footer', start: 'top 80%' }
    });

    /* ── Background experience canvas particles ── */
    initExperienceCanvas();
  }

  function initExperienceCanvas() {
    const canvas = document.getElementById('exp-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let particles = [];

    function mkP() {
      return {
        x: Utils.randomBetween(0, W), y: H,
        size: Utils.randomBetween(0.5, 2),
        vy: Utils.randomBetween(-0.5, -0.15),
        vx: Utils.randomBetween(-0.2, 0.2),
        life: 0, maxLife: Utils.randomInt(200, 400),
        hue: Utils.randomBetween(42, 55)
      };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      if (particles.length < 50) particles.push(mkP());
      particles = particles.filter(p => {
        p.life++; p.x += p.vx; p.y += p.vy;
        const t = p.life / p.maxLife;
        const a = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 0.6;
        ctx.save();
        ctx.globalAlpha = a * 0.5;
        ctx.fillStyle = `hsl(${p.hue},80%,65%)`;
        ctx.shadowColor = `hsl(${p.hue},90%,70%)`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return p.life < p.maxLife;
      });
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    });
    draw();
  }

  return { init };
})();

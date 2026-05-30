/* Offering page motion and interaction */

document.addEventListener('DOMContentLoaded', () => {
  const hoverTargets = document.querySelectorAll('.lux-card, .gallery-item, .featured-card, .material-chip, .mode-toggle button');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
  });

  const stage = document.querySelector('.offering-hero-stage');
  if (stage) {
    window.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      stage.style.transform = `rotateY(${x * 0.18}deg) rotateX(${-y * 0.14}deg)`;
    });
  }

  const loungeStage = document.querySelector('.lounge-stage');
  const modeButtons = document.querySelectorAll('[data-lounge-mode]');
  modeButtons.forEach(button => {
    button.addEventListener('click', () => {
      modeButtons.forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      if (loungeStage) loungeStage.classList.toggle('daylight', button.dataset.loungeMode === 'day');
    });
  });

  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.offering-hero-copy > *').forEach((el, index) => {
      gsap.from(el, { opacity:0, y:34, duration:1.1, delay:index * 0.12, ease:'power3.out' });
    });

    gsap.from('.offering-hero-stage', { opacity:0, y:50, scale:0.96, duration:1.4, ease:'power3.out', delay:0.25 });

    gsap.utils.toArray('.offering-section .reveal, .offering-section .glass-panel, .gallery-item').forEach(el => {
      gsap.from(el, {
        opacity:0,
        y:46,
        duration:1,
        ease:'power3.out',
        scrollTrigger:{ trigger:el, start:'top 86%', toggleActions:'play none none reverse' }
      });
    });

    gsap.utils.toArray('.parallax-soft').forEach(el => {
      gsap.to(el, {
        yPercent:-10,
        ease:'none',
        scrollTrigger:{ trigger:el, start:'top bottom', end:'bottom top', scrub:1.5 }
      });
    });

    gsap.to('.structural-cube', {
      rotateZ:90,
      scale:1.08,
      ease:'none',
      scrollTrigger:{ trigger:'.offering-hero', start:'top top', end:'bottom top', scrub:1.2 }
    });
  }

  const particles = document.querySelector('.offering-particles');
  if (particles) {
    for (let i = 0; i < 18; i++) {
      const dot = document.createElement('span');
      dot.className = 'offering-particle';
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.animation = `floatParticle ${6 + Math.random() * 7}s ease-in-out ${Math.random() * 4}s infinite`;
      particles.appendChild(dot);
    }
  }
});

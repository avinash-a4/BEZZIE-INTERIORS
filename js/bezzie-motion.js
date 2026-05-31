/* Bezzie in Motion: lazy Shorts playback and atmosphere */

document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('bezzie-motion');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('[data-motion-card]'));
  const visibility = new Map();
  let activeCard = null;

  function send(card, func) {
    const iframe = card.querySelector('[data-motion-video]');
    if (!iframe || !iframe.contentWindow || !iframe.src) return;
    iframe.contentWindow.postMessage(JSON.stringify({
      event:'command',
      func,
      args:[]
    }), '*');
  }

  function load(card) {
    const iframe = card.querySelector('[data-motion-video]');
    if (!iframe || iframe.src || !iframe.dataset.src) return;
    iframe.src = iframe.dataset.src;
  }

  function pause(card) {
    if (!card) return;
    send(card, 'pauseVideo');
    card.classList.remove('is-playing');
    const sound = card.querySelector('[data-motion-sound]');
    sound.classList.remove('is-enabled');
    sound.textContent = 'Tap For Sound';
    card.dataset.sound = 'off';
  }

  function play(card) {
    if (!card) return;
    load(card);
    if (activeCard && activeCard !== card) pause(activeCard);
    activeCard = card;
    if (card.dataset.sound !== 'on') send(card, 'mute');
    send(card, 'playVideo');
    card.classList.add('is-playing');
  }

  function playMostVisible() {
    const next = cards
      .filter(card => (visibility.get(card) || 0) >= 0.42)
      .sort((a, b) => visibility.get(b) - visibility.get(a))[0];

    if (!next) {
      pause(activeCard);
      activeCard = null;
      return;
    }

    if (next !== activeCard) play(next);
  }

  const loadObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        load(entry.target);
        loadObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin:'320px 0px' });

  const playObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => visibility.set(entry.target, entry.intersectionRatio));
    playMostVisible();
  }, { threshold:[0, 0.24, 0.42, 0.58, 0.76] });

  cards.forEach(card => {
    loadObserver.observe(card);
    playObserver.observe(card);

    const sound = card.querySelector('[data-motion-sound]');
    const iframe = card.querySelector('[data-motion-video]');
    card.addEventListener('click', event => {
      if (event.target.closest('a, button')) return;
      const link = card.querySelector('.motion-card-link');
      window.open(link.href, '_blank', 'noopener,noreferrer');
    });

    iframe.addEventListener('load', () => {
      if (activeCard !== card) return;
      send(card, card.dataset.sound === 'on' ? 'unMute' : 'mute');
      send(card, 'playVideo');
    });

    sound.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      if (activeCard && activeCard !== card) pause(activeCard);
      activeCard = card;
      load(card);
      send(card, 'playVideo');
      send(card, 'unMute');
      card.dataset.sound = 'on';
      card.classList.add('is-playing');
      sound.classList.add('is-enabled');
      sound.textContent = 'Sound On';
    });
  });

  const particles = section.querySelector('.motion-particles');
  for (let index = 0; index < 24; index += 1) {
    const dot = document.createElement('span');
    dot.className = 'motion-particle';
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.transform = `scale(${0.5 + Math.random()})`;
    particles.appendChild(dot);
  }

  window.addEventListener('scroll', () => {
    const bounds = section.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
    section.querySelector('.motion-glow').style.transform = `translateY(${bounds.top * -0.035}px)`;
    particles.style.transform = `translateY(${bounds.top * -0.018}px)`;
  }, { passive:true });
});

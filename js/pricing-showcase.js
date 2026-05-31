/* Investment in Excellence: expandable showroom cards and micro interactions */

document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('investment');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('[data-investment-card]'));
  const formatPrice = value => new Intl.NumberFormat('en-IN').format(value);

  cards.forEach((card, index) => {
    const toggle = card.querySelector('[data-investment-toggle]');
    const image = card.querySelector('.investment-image-wrap img');
    card.style.setProperty('--reveal-delay', `${index * 90}ms`);

    toggle.addEventListener('click', () => {
      const willOpen = !card.classList.contains('is-open');
      cards.forEach(item => {
        item.classList.remove('is-open');
        item.querySelector('[data-investment-toggle]').setAttribute('aria-expanded', 'false');
      });
      card.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
    });

    card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--spot-x', `${(x + 0.5) * 100}%`);
      card.style.setProperty('--spot-y', `${(y + 0.5) * 100}%`);
      image.style.transform = `scale(1.11) translate(${x * -7}px, ${y * -7}px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--spot-x', '50%');
      card.style.setProperty('--spot-y', '22%');
      image.style.transform = '';
    });
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('luxury-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold:0.18 });

  cards.forEach(card => revealObserver.observe(card));

  const priceObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      priceObserver.unobserve(entry.target);
      const price = entry.target;
      const target = Number(price.dataset.priceValue);
      const suffix = price.dataset.priceSuffix || '';
      const start = performance.now();
      const duration = 1100;

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        price.textContent = `₹${formatPrice(Math.round(target * eased))}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }, { threshold:0.58 });

  section.querySelectorAll('[data-price-value]').forEach(price => priceObserver.observe(price));

  section.querySelectorAll('.magnetic-btn').forEach(button => {
    button.addEventListener('mousemove', event => {
      const rect = button.getBoundingClientRect();
      button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.1}px, ${(event.clientY - rect.top - rect.height / 2) * 0.15}px)`;
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });

  const particles = section.querySelector('.investment-particles');
  for (let index = 0; index < 28; index += 1) {
    const dot = document.createElement('span');
    dot.className = 'investment-particle';
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.transform = `scale(${0.45 + Math.random()})`;
    dot.style.animationDelay = `${Math.random() * -7}s`;
    particles.appendChild(dot);
  }

  section.addEventListener('mousemove', event => {
    const bounds = section.getBoundingClientRect();
    section.style.setProperty('--ambient-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    section.style.setProperty('--ambient-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  });

  section.addEventListener('mouseleave', () => {
    section.style.setProperty('--ambient-x', '50%');
    section.style.setProperty('--ambient-y', '18%');
  });

  window.addEventListener('scroll', () => {
    const bounds = section.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
    section.querySelector('.investment-glow').style.transform = `translateY(${bounds.top * -0.03}px)`;
    particles.style.transform = `translateY(${bounds.top * -0.015}px)`;
  }, { passive:true });
});

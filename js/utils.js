/* ─── js/utils.js ─── */
const Utils = {
  isMobile: () => window.innerWidth < 768,
  isTablet: () => window.innerWidth < 1024,
  clamp: (v, mn, mx) => Math.min(Math.max(v, mn), mx),
  lerp: (a, b, t) => a + (b - a) * t,
  map: (v, in1, in2, out1, out2) => out1 + ((v - in1) / (in2 - in1)) * (out2 - out1),
  debounce(fn, ms) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  },
  throttle(fn, ms) {
    let last = 0;
    return (...args) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...args); } };
  },
  randomBetween: (a, b) => Math.random() * (b - a) + a,
  randomInt: (a, b) => Math.floor(Math.random() * (b - a + 1)) + a,
};

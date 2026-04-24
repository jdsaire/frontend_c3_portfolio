/* ============================================================
   i18n COPY DICTIONARY
   All bilingual copy keyed to data-i18n attributes.
   EN is source of record; ES is locked per principal selection.
   ============================================================ */
const COPY = {
  EN: {
    nav_work:         'Work',
    nav_services:     'Services',
    nav_capabilities: 'Capabilities',
    nav_about:        'Mindset',
    nav_cta:          'Connect',
    hero_badge:       'Building in Lima, Peru',
    hero_h1_line1:    'Your digital',
    hero_h1_line2:    'ambitions',
    hero_h1_line3:    'live here',
    hero_tag1:        'Frontend',
    hero_tag2:        'UX/UI',
    hero_tag3:        'Growth Hacking',
    hero_tag4:        'Agile/Scrum',
    hero_tag5:        'Analytics',
    hero_eyebrow:     'Proven impact',
    hero_stat1:       'A decade across three disciplines',
    hero_stat2:       'Students and users shaped by the work',
    hero_stat3:       'Projects shipped across 5 industries',
    hero_stat4:       'Faster builds with AI in the loop',
    hero_cta:         'See the work',
    hero_cta_aria:    'See the work — case studies',
  },
  ES: {
    nav_work:         'Proyectos',
    nav_services:     'Servicios',
    nav_capabilities: 'Competencias',
    nav_about:        'Mentalidad',
    nav_cta:          'Conectar',
    hero_badge:       'Innovando desde Lima, Perú',
    hero_h1_line1:    'Ambiciones',
    hero_h1_line2:    'digitales',
    hero_h1_line3:    'sin límites',
    hero_tag1:        'Frontend',
    hero_tag2:        'UX/UI',
    hero_tag3:        'Growth Hacking',
    hero_tag4:        'Agile/Scrum',
    hero_tag5:        'Analytics',
    hero_eyebrow:     'Impacto demostrado',
    hero_stat1:       'Una década en tres disciplinas',
    hero_stat2:       'Estudiantes y usuarios impactados',
    hero_stat3:       'Productos entregados en 5 industrias',
    hero_stat4:       'Builds más rápidos con IA integrada',
    hero_cta:         'Explorar',
    hero_cta_aria:    'Explorar proyectos — casos de estudio',
  }
};

/* ============================================================
   i18n ENGINE — swapLang(lang)
   Finds all [data-i18n] nodes and updates textContent.
   Updates html[lang], aria-labels, and page title.
   ============================================================ */
function swapLang(lang) {
  const dict = COPY[lang];
  if (!dict) return;
  document.documentElement.setAttribute('lang', lang === 'ES' ? 'es' : 'en');
  document.documentElement.setAttribute('data-lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  /* aria-label swap for CTA anchor */
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
  });
}

/* ============================================================
   NAV scroll hide/show
   ============================================================ */
const nav = document.getElementById('navbar');
let lastScroll = 0, ticking = false;
function onScroll() {
  const cur = window.scrollY;
  nav.classList.toggle('nav--hidden', cur > lastScroll && cur > 80);
  lastScroll = cur; ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });

/* ============================================================
   Mobile overlay — open/close + CHG-21 lang↔X swap
   ============================================================ */
const hamburger    = document.getElementById('hamburger');
const overlay      = document.getElementById('navOverlay');
const langSelector = document.getElementById('langSelector');
const mobileClose  = document.getElementById('mobileClose');

function isMobile() { return window.innerWidth <= 768; }

function openOverlay() {
  overlay.classList.add('nav__overlay--open');
  hamburger.setAttribute('aria-expanded', 'true');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (isMobile()) { langSelector.style.display = 'none'; mobileClose.style.display = 'flex'; }
}
function closeOverlay() {
  overlay.classList.remove('nav__overlay--open');
  hamburger.setAttribute('aria-expanded', 'false');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (isMobile()) { mobileClose.style.display = 'none'; langSelector.style.display = ''; }
}

hamburger.addEventListener('click', openOverlay);
mobileClose.addEventListener('click', closeOverlay);
document.getElementById('overlayClose').addEventListener('click', closeOverlay);
overlay.querySelectorAll('.nav__overlay-link').forEach(el => el.addEventListener('click', closeOverlay));

/* ============================================================
   Language selector — globe + panel + i18n trigger
   ============================================================ */
const langPanel = document.getElementById('langPanel');
const langLabel = document.getElementById('langLabel');

document.getElementById('langBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  langSelector.classList.toggle('nav__lang--panel-open');
});
document.addEventListener('click', () => langSelector.classList.remove('nav__lang--panel-open'));

langPanel.querySelectorAll('.nav__lang-option').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    /* Update active state in panel */
    langPanel.querySelectorAll('.nav__lang-option').forEach(b => {
      b.classList.toggle('nav__lang-option--active', b === btn);
      b.setAttribute('aria-selected', String(b === btn));
    });
    langLabel.textContent = lang;
    langSelector.classList.remove('nav__lang--panel-open');
    /* Fire i18n swap */
    swapLang(lang);
  });
});

/* ============================================================
   HERO stat count-up
   ============================================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const counters = document.querySelectorAll('.stat__number[data-target]');
function renderFinal(el) {
  el.textContent = parseInt(el.dataset.target,10).toLocaleString() + (el.dataset.suffix||'');
}
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  counters.forEach(renderFinal);
} else {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target,10);
      const suffix = el.dataset.suffix || '';
      const steps = 40, interval = 1200 / steps;
      let step = 0;
      const t = setInterval(() => {
        step++;
        el.textContent = Math.round(target*(step/steps)).toLocaleString() + suffix;
        if (step >= steps) { clearInterval(t); renderFinal(el); }
      }, interval);
      obs.unobserve(el);
    });
  }, { threshold: 0.3 });
  counters.forEach(el => io.observe(el));
}

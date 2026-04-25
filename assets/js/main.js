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
    nav_cta:          'Contact',
    hero_badge:       'Building in Lima, Peru',
    hero_h1_line1:    'Your digital',
    hero_h1_line2:    'ambitions',
    hero_h1_line3:    'live here',
    hero_tag1:        'BUILD',
    hero_tag2:        'SCALE',
    hero_tag3:        'CONTROL',
    hero_eyebrow:     'Proven impact',
    hero_stat1:       'A decade across three disciplines',
    hero_stat2:       'Students and users shaped by the work',
    hero_stat3:       'Projects shipped across 5 industries',
    hero_stat4:       'Faster builds with AI in the loop',
    hero_cta:         'See the work',
    hero_cta_aria:    'See the work — case studies',
    work_eyebrow:     'SELECTED WORK',
    work_cta:         'Explore',
    work_card1_label:   'Build',
    work_card1_heading: 'Built a revenue-first app for 40M+ passengers',
    work_card1_body:    'Lima Airport\'s new terminal needed a mobile experience to unlock non-aeronautical revenue. We prototyped LimaFly in high fidelity — a full passenger journey for 40M+ annual arrivals and departures.',
    work_card2_label:   'Scale',
    work_card2_heading: 'Aligned airport staff with premium Agile workshops',
    work_card2_body:    'Lima Airport\'s cultural shift to Agile needed real traction, fast. We ran three hybrid workshops — 70 employees across all divisions walked away ready to apply it in their teams.',
    work_card3_label:   'Execute',
    work_card3_heading: 'Reset playbook of critical airport program',
    work_card3_body:    'Designing an unprecedented aeronautical fee meant making high-stakes calls without a playbook. We codified lessons from the TUUA Transfer to shape Lima Airport\'s next major programs.',
    work_card4_label:   'Build · In progress',
    work_card4_heading: 'Building JDigital v1 with modern Microsoft frontend',
    work_card4_body:    'This site is the first version of a full-stack boutique practice. Midway through a Microsoft front-end specialization, every technique gets pressure-tested here before it ships to partners.',
    work_card4_status:  'Shipping across Q2 2026',
  },
  ES: {
    nav_work:         'Proyectos',
    nav_services:     'Servicios',
    nav_capabilities: 'Competencias',
    nav_about:        'Mentalidad',
    nav_cta:          'Contacto',
    hero_badge:       'Innovando desde Lima, Perú',
    hero_h1_line1:    'Ambiciones',
    hero_h1_line2:    'digitales',
    hero_h1_line3:    'sin límites',
    hero_tag1:        'BUILD',
    hero_tag2:        'SCALE',
    hero_tag3:        'CONTROL',
    hero_eyebrow:     'Impacto demostrado',
    hero_stat1:       'Una década en tres disciplinas',
    hero_stat2:       'Estudiantes y usuarios impactados',
    hero_stat3:       'Productos entregados en 5 industrias',
    hero_stat4:       'Builds más rápidos con IA integrada',
    hero_cta:         'Explorar',
    hero_cta_aria:    'Explorar proyectos — casos de estudio',
    work_eyebrow:     'PROYECTOS DESTACADOS',
    work_cta:         'Explorar',
    work_card1_label:   'Build',
    work_card1_heading: 'Desarrollamos app para monetizar 40M+ pasajeros',
    work_card1_body:    'El nuevo terminal de Lima Airport necesitaba una experiencia móvil que generara ingresos fuera de la aeronáutica. Construimos LimaFly App en alta fidelidad — el journey completo para 40M+ viajeros al año.',
    work_card2_label:   'Scale',
    work_card2_heading: 'Alineamos mentalidad ágil con talleres premium',
    work_card2_body:    'Lima Airport necesitaba que su gente adoptara Agile — no solo lo entendiera. Facilitamos tres workshops híbridos con 70 colaboradores de todas las divisiones: salieron listos para aplicarlo en sus equipos.',
    work_card3_label:   'Execute',
    work_card3_heading: 'Replanteamos gestión del programa más crítico',
    work_card3_body:    'Diseñar el cobro de una nueva tasa aeronáutica sin precedente mundial exigió decidir sin manual. Ejecutamos el post-mortem del TUUA Transfer y codificamos las lecciones para programas de Lima Airport.',
    work_card4_label:   'Build · En progreso',
    work_card4_heading: 'Construyendo JDigital v1 con Microsoft frontend',
    work_card4_body:    'JDigital no es solo un portafolio — es el primer producto de nuestra agencia. Lo construimos con el último stack front-end de Microsoft, probando aquí cada decisión técnica antes de escalar.',
    work_card4_status:  'Culminando en Q2 2026',
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
langPanel.addEventListener('click', e => e.stopPropagation());

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

/* ============================================================
   WORK v5 — Touch interaction (mobile + tablet)
   ============================================================ */
(function () {
  var workCards = document.querySelectorAll('.work-card');
  var workTrack = document.querySelector('.work__track');
  var workDots  = document.querySelectorAll('.work__dot');
  var isTouch   = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (isTouch) {
    workCards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.work-card__close')) {
          card.classList.remove('is-active');
          return;
        }
        if (e.target.closest('.work-card__cta')) return;
        workCards.forEach(function (c) {
          if (c !== card) c.classList.remove('is-active');
        });
        card.classList.toggle('is-active');
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('is-active');
        }
        if (e.key === 'Escape') {
          card.classList.remove('is-active');
        }
      });
    });
  }

  /* Dot pagination */
  if (workTrack && workDots.length) {
    function updateDots () {
      var first = workTrack.firstElementChild;
      if (!first) return;
      var cardWidth = first.getBoundingClientRect().width;
      var gap = parseFloat(getComputedStyle(workTrack).gap) || 12;
      var idx = Math.round(workTrack.scrollLeft / (cardWidth + gap));
      workDots.forEach(function (d, i) {
        d.classList.toggle('work__dot--active', i === idx);
      });
    }

    var ticking = false;
    workTrack.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () { updateDots(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });

    workDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(dot.dataset.cardIndex, 10);
        var first = workTrack.firstElementChild;
        if (!first) return;
        var cardWidth = first.getBoundingClientRect().width;
        var gap = parseFloat(getComputedStyle(workTrack).gap) || 12;
        workTrack.scrollTo({ left: idx * (cardWidth + gap), behavior: 'smooth' });
      });
    });
  }
})();

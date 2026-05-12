/* ============================================================
   i18n ENGINE — swapLang(lang)
   Dictionaries are loaded asynchronously from assets/i18n/{lang}.json
   on first use of each language; subsequent calls hit the cache.
   swapLang(lang)'s public signature is unchanged — callers
   fire-and-forget. The HTML's default English markup is the
   render fallback during the brief async fetch window.
   ============================================================ */
const i18nDicts   = { EN: null, ES: null };
const i18nLoading = { EN: null, ES: null };
let   i18nCurrent = 'EN';

function loadDict(lang) {
  if (i18nDicts[lang])   return Promise.resolve(i18nDicts[lang]);
  if (i18nLoading[lang]) return i18nLoading[lang];
  const file = lang === 'ES' ? 'es.json' : 'en.json';
  i18nLoading[lang] = fetch('assets/i18n/' + file)
    .then(r => r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)))
    .then(dict => { i18nDicts[lang] = dict; return dict; })
    .catch(err => { console.warn('i18n fetch failed for ' + lang + ':', err); return null; });
  return i18nLoading[lang];
}

function swapLang(lang) {
  i18nCurrent = lang;
  loadDict(lang).then(dict => {
    if (!dict || i18nCurrent !== lang) return;
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

    /* placeholder swap for form inputs/textarea */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (dict[key] !== undefined) el.placeholder = dict[key];
    });
  });
}

document.addEventListener('DOMContentLoaded', function () { swapLang('EN'); });

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

/* ============================================================
   ABOUT — Dot pagination (mobile + tablet)
   ============================================================ */
(function () {
  var aboutTrack = document.querySelector('.about-cards-track');
  var aboutDots  = document.querySelectorAll('.about__dot');
  if (!aboutTrack || !aboutDots.length) return;

  function updateAboutDots() {
    var first = aboutTrack.firstElementChild;
    if (!first) return;
    var cardWidth = first.getBoundingClientRect().width;
    var gap = parseFloat(getComputedStyle(aboutTrack).gap) || 12;
    var idx = Math.round(aboutTrack.scrollLeft / (cardWidth + gap));
    aboutDots.forEach(function (d, i) {
      d.classList.toggle('about__dot--active', i === idx);
    });
  }

  var ticking = false;
  aboutTrack.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () { updateAboutDots(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  aboutDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var idx = parseInt(dot.dataset.cardIndex, 10);
      var first = aboutTrack.firstElementChild;
      if (!first) return;
      var cardWidth = first.getBoundingClientRect().width;
      var gap = parseFloat(getComputedStyle(aboutTrack).gap) || 12;
      aboutTrack.scrollTo({ left: idx * (cardWidth + gap), behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   ABOUT — Card tap-to-toggle (mobile touch)
   Tap inactive card → show body; tap same card → revert to heading
   Tap outside any card → deactivate all
   ============================================================ */
(function () {
  var cards = document.querySelectorAll('.about-card');
  if (!cards.length) return;

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var wasActive = card.classList.contains('is-active');
      cards.forEach(function (c) { c.classList.remove('is-active'); });
      if (!wasActive) card.classList.add('is-active');
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.about-card')) {
      cards.forEach(function (c) { c.classList.remove('is-active'); });
    }
  });
}());

/* ============================================================
   CONTACT — Form validation + Formspree submit
   ============================================================ */
(function () {
  'use strict';

  const contactForm      = document.getElementById('contactForm');
  const contactSuccess   = document.getElementById('formSuccess');
  const engagementSelect = document.getElementById('engagementType');

  if (engagementSelect) {
    engagementSelect.addEventListener('change', function () {
      engagementSelect.classList.toggle('is-placeholder', engagementSelect.value === '');
    });
  }

  if (contactForm) {
    const contactFields = [
      { id: 'field-name',    input: 'fullName',       test: function (v) { var t = v.trim(); return t.length >= 2 && /^[a-zA-ZÀ-ÿ\s'\-\.]+$/.test(t); } },
      { id: 'field-email',   input: 'email',          test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
      { id: 'field-type',    input: 'engagementType', test: function (v) { return v !== ''; } },
      { id: 'field-message', input: 'message',        test: function (v) { return v.trim().length >= 10; } }
    ];

    function validateContactField(field) {
      const wrapper = document.getElementById(field.id);
      const input   = document.getElementById(field.input);
      if (!wrapper || !input) return true;
      if (input.disabled) return true;
      const valid = field.test(input.value);
      wrapper.classList.toggle('has-error', !valid);
      return valid;
    }

    contactFields.forEach(function (field) {
      const wrapper = document.getElementById(field.id);
      const input   = document.getElementById(field.input);
      if (!wrapper || !input) return;
      const clear = function () { wrapper.classList.remove('has-error'); };
      input.addEventListener('input', clear);
      input.addEventListener('change', clear);
    });

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const allValid = contactFields.map(validateContactField).every(Boolean);
      if (!allValid) {
        const firstError = contactForm.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstError) firstError.focus();
        return;
      }
      try {
        const data     = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body:   data,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          contactForm.classList.add('is-submitted');
          if (contactSuccess) {
            contactSuccess.classList.add('is-visible');
            document.activeElement?.blur();
            contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          console.warn('Formspree returned non-OK status:', response.status);
        }
      } catch (err) {
        console.error('Form submission error:', err);
      }
    });

    var successResetBtn = document.getElementById('formSuccessReset');
    if (successResetBtn) {
      successResetBtn.addEventListener('click', function () {
        contactForm.classList.remove('is-submitted');
        if (contactSuccess) contactSuccess.classList.remove('is-visible');
        contactForm.reset();
        contactFields.forEach(function (field) {
          var wrapper = document.getElementById(field.id);
          if (wrapper) wrapper.classList.remove('has-error');
        });
        if (engagementSelect) engagementSelect.classList.add('is-placeholder');
      });
    }
  }
})();

/* ============================================================
   CONTACT v5 — Dual-intent behavior layer (P4)
   Wires intent toggle, conditional validation, URL hash pre-fill,
   and submit routing. Layered ALONGSIDE the v4 submit handler via
   a capture-phase listener; v4 fetch + success flow are unchanged.
   ============================================================ */
(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;

  const intentRadios    = form.querySelectorAll('input[name="intent"]');
  const collabFieldsEl  = form.querySelector('.contact__fields--collab');
  const briefFieldsEl   = form.querySelector('.contact__fields--brief');
  const disclaimerEl    = form.querySelector('.contact__disclaimer');
  const submitLabelEl   = form.querySelector('button[type="submit"] .cta__label');
  const intentPathInput = form.querySelector('input[name="intent_path"]');
  const caseSelect      = form.querySelector('#contact-brief-case');

  if (!collabFieldsEl || !briefFieldsEl || !disclaimerEl || !submitLabelEl || !intentPathInput) return;

  if (caseSelect) {
    caseSelect.addEventListener('change', function () {
      caseSelect.classList.toggle('is-placeholder', caseSelect.value === '');
    });
  }

  /* Capture the v4 collab submit-label key from the markup (do not invent). */
  const COLLAB_SUBMIT_KEY     = submitLabelEl.dataset.i18n || 'contact_submit';
  const COLLAB_DISCLAIMER_KEY = 'contact_disclaimer';
  const BRIEF_DISCLAIMER_KEY  = 'contact_brief_disclaimer';
  const BRIEF_SUBMIT_KEY      = 'contact_brief_submit';

  const VALID_CASE_IDS = ['limafly', 'agile', 'tuua', 'jdigital'];

  /* Brief-path field configs (P4 owns its own validator; the v4 validator
     handles collab path and skips disabled inputs via the guard added in
     the v4 IIFE above). */
  const briefFields = [
    { id: 'contact-brief-case',    wrapperId: 'brief-field-case',    test: function (v) { return v !== ''; } },
    { id: 'contact-brief-name',    wrapperId: 'brief-field-name',    test: function (v) { return v.trim().length >= 2; } },
    { id: 'contact-brief-email',   wrapperId: 'brief-field-email',   test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
    { id: 'contact-brief-company', wrapperId: 'brief-field-company', test: function (v) { return v.trim().length >= 1; } },
    { id: 'contact-brief-role',    wrapperId: 'brief-field-role',    test: function (v) { return v.trim().length >= 1; } },
    { id: 'contact-brief-context', wrapperId: 'brief-field-context', test: function (v) { return v.trim().length >= 5; } }
  ];

  briefFields.forEach(function (f) {
    const el      = document.getElementById(f.id);
    const wrapper = document.getElementById(f.wrapperId);
    if (!el || !wrapper) return;
    const clear = function () { wrapper.classList.remove('has-error'); };
    el.addEventListener('input', clear);
    el.addEventListener('change', clear);
  });

  function setFieldsetDisabled(fieldsetEl, disabled) {
    fieldsetEl.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.disabled = disabled;
    });
  }

  function currentLang() {
    return document.documentElement.dataset.lang || 'EN';
  }

  function setActivePath(path) {
    form.classList.remove('contact__form--collab', 'contact__form--brief');

    if (path === 'brief') {
      form.classList.add('contact__form--brief');
      setFieldsetDisabled(collabFieldsEl, true);
      setFieldsetDisabled(briefFieldsEl, false);
      disclaimerEl.setAttribute('data-i18n', BRIEF_DISCLAIMER_KEY);
      submitLabelEl.setAttribute('data-i18n', BRIEF_SUBMIT_KEY);
    } else if (path === 'collaboration') {
      form.classList.add('contact__form--collab');
      setFieldsetDisabled(briefFieldsEl, true);
      setFieldsetDisabled(collabFieldsEl, false);
      disclaimerEl.setAttribute('data-i18n', COLLAB_DISCLAIMER_KEY);
      submitLabelEl.setAttribute('data-i18n', COLLAB_SUBMIT_KEY);
    }

    /* Re-render i18n so swapped data-i18n keys take effect in active language. */
    if (typeof window.swapLang === 'function') {
      window.swapLang(currentLang());
    }
  }

  function validateBriefFields() {
    let firstInvalid = null;
    let allValid = true;
    briefFields.forEach(function (f) {
      const el      = document.getElementById(f.id);
      const wrapper = document.getElementById(f.wrapperId);
      if (!el || el.disabled || !wrapper) return;
      const valid = f.test(el.value);
      wrapper.classList.toggle('has-error', !valid);
      if (!valid) {
        allValid = false;
        if (!firstInvalid) firstInvalid = el;
      }
    });
    if (firstInvalid) firstInvalid.focus();
    return allValid;
  }

  function getActivePath() {
    const checked = form.querySelector('input[name="intent"]:checked');
    return checked ? checked.value : null;
  }

  function parseHashAndPrefill() {
    const raw = window.location.hash;
    if (!raw || !raw.startsWith('#contact')) return;
    const queryStr = raw.split('?')[1];
    if (!queryStr) return;
    const params = new URLSearchParams(queryStr);
    const caseId = params.get('case');
    if (!caseId || VALID_CASE_IDS.indexOf(caseId) === -1) return;

    const briefRadio = form.querySelector('input[name="intent"][value="brief"]');
    if (!briefRadio) return;
    briefRadio.checked = true;
    setActivePath('brief');
    if (caseSelect) {
      caseSelect.value = caseId;
      caseSelect.classList.remove('is-placeholder');
    }
  }

  /* Initial state: both fieldsets disabled, no path active. The
     :not(--collab):not(--brief) CSS rule hides both wrappers. */
  setFieldsetDisabled(collabFieldsEl, true);
  setFieldsetDisabled(briefFieldsEl, true);

  /* Bind intent radio change → activate path. */
  intentRadios.forEach(function (r) {
    r.addEventListener('change', function (e) {
      if (e.target.checked) setActivePath(e.target.value);
    });
  });

  /* Capture-phase submit listener: gates validation + sets intent_path
     BEFORE the v4 bubble-phase handler runs. */
  form.addEventListener('submit', function (e) {
    const path = getActivePath();
    if (!path) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const firstRadio = form.querySelector('input[name="intent"]');
      if (firstRadio) firstRadio.focus();
      return;
    }

    if (path === 'brief') {
      if (!validateBriefFields()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
    }

    intentPathInput.value = path;
    /* Allow bubble-phase v4 handler to run (preventDefault → fetch → success).
       The disabled-input guard in validateContactField ensures inactive-path
       collab fields auto-pass when brief is the active path. */
  }, { capture: true });

  /* Hash pre-fill runs after initial swapLang('EN') so disclaimer/submit
     i18n re-render lands on the brief copy if the hash auto-selects brief. */
  document.addEventListener('DOMContentLoaded', parseHashAndPrefill);
})();

/* ============================================================
   SERVICES — Carousel IIFE
   ============================================================ */
(function () {
  'use strict';

  const track        = document.getElementById('servicesTrack');
  if (!track) return;
  const slides       = document.querySelectorAll('.services__slide');
  const prevBtn      = document.querySelector('.services__controls .services__nav--prev');
  const nextBtn      = document.querySelector('.services__controls .services__nav--next');
  const servicesDots = document.querySelectorAll('.services__dot');
  const desktopCounter = document.querySelector('.services__counter');
  const total        = slides.length;
  let   index        = 0;

  function isMobile() { return window.innerWidth <= 767; }

  function getSlideStep() {
    if (!slides[0]) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return slides[0].offsetWidth + gap;
  }

  function goTo(newIndex) {
    if (newIndex < 0)      newIndex = total - 1;
    if (newIndex >= total) newIndex = 0;
    index = newIndex;

    if (!isMobile()) {
      track.style.transform = 'translateX(-' + (index * getSlideStep()) + 'px)';
      slides.forEach(function (s, i) {
        s.classList.toggle('services__slide--active', i === index);
        s.setAttribute('aria-hidden', i !== index ? 'true' : 'false');
      });
    } else {
      track.style.transform = '';
      slides.forEach(function (s, i) {
        s.classList.toggle('services__slide--active', i === index);
        s.removeAttribute('aria-hidden');
      });
      var targetSlide = slides[index];
      if (targetSlide && carousel) {
        var paddingLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
        carousel.scrollTo({ left: targetSlide.offsetLeft - paddingLeft, behavior: 'smooth' });
      }
    }

    servicesDots.forEach(function (d, i) {
      d.classList.toggle('services__dot--active', i === index);
    });

    if (desktopCounter) desktopCounter.textContent = (index + 1) + ' / ' + total;
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); });

  track.addEventListener('click', function (e) {
    var btn = e.target.closest('.services__nav--mobile');
    if (!btn) return;
    if (btn.classList.contains('services__nav--prev')) goTo(index - 1);
    if (btn.classList.contains('services__nav--next')) goTo(index + 1);
  });

  servicesDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(dot.dataset.slideIndex, 10));
    });
  });

  var carousel = document.querySelector('.services__carousel');
  if (carousel) {
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    });

    var touchStartX = 0, touchStartY = 0;
    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].screenX - touchStartX;
      var dy = e.changedTouches[0].screenY - touchStartY;
      if (!isMobile() && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        goTo(dx < 0 ? index + 1 : index - 1);
      }
    }, { passive: true });

    carousel.addEventListener('scroll', function () {
      if (!isMobile()) return;
      var step = getSlideStep();
      if (step === 0) return;
      var nearest = Math.round(carousel.scrollLeft / step);
      if (nearest !== index && nearest >= 0 && nearest < total) {
        index = nearest;
        slides.forEach(function (s, i) { s.classList.toggle('services__slide--active', i === index); });
        servicesDots.forEach(function (d, i) { d.classList.toggle('services__dot--active', i === index); });
        if (desktopCounter) desktopCounter.textContent = (index + 1) + ' / ' + total;
      }
    }, { passive: true });
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { goTo(index); }, 120);
  });

  goTo(0);
})();

/* ============================================================
   CAPABILITIES — Mental Map Canvas
   Scoped IIFE to avoid polluting global scope.
   IDs prefixed with "cap" to avoid conflicts.
   Logo loaded from file path (assets/img/capabilities/logo_map_edit.svg).
   ============================================================ */
(function () {
  'use strict';

  // Guard — element may not exist on the page
  const capWrapper = document.getElementById('capMapWrapper');
  const capCanvas  = document.getElementById('capMapCanvas');
  if (!capWrapper || !capCanvas) return;

  // ── Brand colors (Accenture purple spectrum) ──
  const BRAND = {
    purple:        '#A100FF',
    purpleDark:    '#7500C0',
    purpleDarkest: '#460073',
    purpleLight:   '#C2A3FF',
  };

  // ── Logo ──
  const logoImg  = new Image();
  let   logoReady = false;
  logoImg.onload = () => { logoReady = true; };
  logoImg.src = 'assets/img/capabilities/logo_map_edit.svg';

  // ── Data ──
  const BRANCHES = [
    {
      id: 'build', label: 'BUILD', labelES: 'CREA', angle: 90,
      color: '#A100FF', glow: 'rgba(161,0,255,0.45)',
      nodes: [
        { id: 'pd',  label: 'Product\nDesigner',    labelES: 'Product\nDesigner',        desc: 'Every interface decision is a bet on user behavior. We design with behavioral assumptions baked into every interaction — tested against real users, not design committee preference.' },
        { id: 'fd',  label: 'Front-end\nDeveloper', labelES: 'Desarrollador\nFront-end', desc: 'Design dies in handoff when no one can build it. We close that gap — writing production-grade Vanilla HTML/CSS/JS and C#, accelerated by AI workflows that ship, perform, and survive the first real user.' },
        { id: 'ux',  label: 'UX/UI\nEngineer',      labelES: 'Ingeniero\nUX/UI',          desc: 'The handoff gap between Figma and production is where digital products lose their soul. We close it — owning both the design system and the code that implements it, frame by frame.' },
      ]
    },
    {
      id: 'scale', label: 'SCALE', labelES: 'CRECE', angle: 210,
      color: '#C2A3FF', glow: 'rgba(194,163,255,0.45)',
      nodes: [
        { id: 'cx',  label: 'CX\nLead',          labelES: 'Líder\nCX',          desc: 'Customer journey maps are decorative without an owner for each friction point. We map end-to-end experiences and assign accountability — so improvements have a name attached, not a committee.' },
        { id: 'tt',  label: 'Tech\nTrainer',      labelES: 'Instructor\nTech',   desc: 'Tool adoption stalls the moment the rollout team leaves. We design and facilitate upskilling programs that move internal teams from passive recipients to active owners of new processes.' },
        { id: 'gh',  label: 'Growth\nHacker',     labelES: 'Growth\nHacker',     desc: 'Acquisition only matters if the product retains. We identify high-leverage conversion levers through rapid experimentation — driving innovation by measuring what users do, not what they report.' },
      ]
    },
    {
      id: 'control', label: 'CONTROL', labelES: 'CONTROLA', angle: 330,
      color: '#7500C0', glow: 'rgba(117,0,192,0.55)',
      nodes: [
        { id: 'pm',  label: 'Project\nManager',   desc: 'Complex programs lose money in the gaps between workstreams — not in the work itself. We govern multi-project and multi-phase portfolios with the systemic view that separates structure from noise.' },
        { id: 'sm',  label: 'Scrum\nMaster',      desc: 'Agile ceremonies without accountability are expensive theater. We run sprint cadences where every ceremony has a decision attached — and the board reflects reality, not wishful planning.' },
        { id: 'prd', label: 'Product\nManager',   desc: 'Roadmaps fail when no one can trace a feature to a business outcome. We own the product backlog with prioritization grounded in user evidence and business strategy — not committee consensus.' },
      ]
    }
  ];

  // ── Canvas setup ──
  const ctx = capCanvas.getContext('2d');
  let W, H, R, cx, cy;
  let nodes       = [];
  let hoveredNode = null;
  let openNode    = null;

  function getCanvasHeight() {
    if (W <= 480) return 480;
    if (W <= 767) return 540;
    return 680;
  }

  function toRad(deg) { return deg * Math.PI / 180; }

  function computeLayout() {
    W  = capCanvas.offsetWidth;
    H  = getCanvasHeight();
    capCanvas.width  = W * devicePixelRatio;
    capCanvas.height = H * devicePixelRatio;
    capCanvas.style.height = H + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);

    R  = Math.min(W, H);
    cx = W / 2;
    cy = H / 2;

    const branchR = R * (W <= 767 ? 0.21 : 0.24);
    const childR  = R * (W <= 767 ? 0.16 : 0.18);
    const fanSpan = W <= 767 ? 80 : 68;

    nodes = [];

    BRANCHES.forEach(branch => {
      const bAngle = toRad(branch.angle);
      const bx = cx + Math.cos(bAngle) * branchR;
      const by = cy - Math.sin(bAngle) * branchR;
      const n    = branch.nodes.length;
      const step = n > 1 ? (2 * fanSpan) / (n - 1) : 0;
      const startAngle = branch.angle - fanSpan;

      branch.nodes.forEach((nd, i) => {
        const angle = toRad(startAngle + i * step);
        const nx = bx + Math.cos(angle) * childR;
        const ny = by - Math.sin(angle) * childR;
        nodes.push({
          ...nd,
          branchId:    branch.id,
          branchColor: branch.color,
          branchGlow:  branch.glow,
          bx, by,
          x: nx, y: ny,
          phase:      Math.random() * Math.PI * 2,
          floatAmp:   2.5 + Math.random() * 2,
          floatSpeed: 0.6 + Math.random() * 0.5,
        });
      });

      branch._bx = bx;
      branch._by = by;
    });
  }

  // ── Drawing helpers ──
  function hexAlpha(hex, a) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  function drawConnector(x1, y1, x2, y2, color, alpha, lw) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 - 10;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(mx, my, x2, y2);
    ctx.strokeStyle = hexAlpha(color, alpha);
    ctx.lineWidth   = lw;
    ctx.stroke();
  }

  function drawNode(nd, t) {
    const floatY = Math.sin(t * nd.floatSpeed + nd.phase) * nd.floatAmp;
    const isHov  = hoveredNode === nd;
    const isOpen = openNode   === nd;
    const x = nd.x;
    const y = nd.y + floatY;
    nd._ry = y;

    const scale  = isHov || isOpen ? 1.16 : 1.0;
    const baseR  = W < 480 ? 38 : 44;
    const r      = baseR * scale;

    // glow halo
    const gAlpha = isHov || isOpen ? 0.50 : 0.14;
    const grd    = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 2.2);
    grd.addColorStop(0, hexAlpha(nd.branchColor, gAlpha));
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // node fill
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    const fill = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.1, x, y, r);
    fill.addColorStop(0, hexAlpha(nd.branchColor, isHov || isOpen ? 0.22 : 0.08));
    fill.addColorStop(1, hexAlpha(nd.branchColor, isHov || isOpen ? 0.06 : 0.02));
    ctx.fillStyle   = fill;
    ctx.fill();
    ctx.strokeStyle = hexAlpha(nd.branchColor, isHov || isOpen ? 0.95 : 0.50);
    ctx.lineWidth   = isHov || isOpen ? 1.8 : 1.2;
    ctx.stroke();

    // active dashed ring
    if (isOpen) {
      ctx.beginPath();
      ctx.arc(x, y, r + 6, 0, Math.PI * 2);
      ctx.strokeStyle = hexAlpha(nd.branchColor, 0.35);
      ctx.lineWidth   = 1;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // label
    const nodeLang  = document.documentElement.dataset.lang || 'EN';
    const nodeLabel = (nodeLang === 'ES' && nd.labelES) ? nd.labelES : nd.label;
    const lines  = nodeLabel.split('\n');
    const fSize  = W < 480 ? 10 : 11;
    ctx.font     = `600 ${fSize}px 'Graphik', Arial, sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    const lAlpha = isHov || isOpen ? 1 : 0.80;
    const lH     = fSize * 1.42;
    const totalH = (lines.length - 1) * lH;
    lines.forEach((ln, i) => {
      ctx.fillStyle = `rgba(255,255,255,${lAlpha})`;
      ctx.fillText(ln, x, y - totalH / 2 + i * lH);
    });
  }

  function drawBranchLabel(branch) {
    const bx     = branch._bx;
    const by     = branch._by;
    const fSize  = W < 480 ? 13 : 16;
    const bLang  = document.documentElement.dataset.lang || 'EN';
    const bLabel = (bLang === 'ES' && branch.labelES) ? branch.labelES : branch.label;

    ctx.font         = `600 ${fSize}px 'Graphik', Arial, sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = '#FFFFFF';
    ctx.fillText(bLabel, bx, by);
  }

  function drawCenter(t) {
    const pulse = 1 + Math.sin(t * 0.8) * 0.015;
    const r     = (W < 480 ? 52 : 64) * pulse;

    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.15);
    grd.addColorStop(0, 'rgba(161,0,255,0.10)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    if (logoReady) {
      const logoAspect = 90 / 36; // native SVG viewBox 90×36
      const logoH = Math.min(r * 2.5 / logoAspect, r * 0.88);
      const logoW = logoH * logoAspect;
      ctx.drawImage(logoImg, cx - logoW / 2, cy - logoH / 2, logoW, logoH);
    } else {
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.font         = `900 20px 'Graphik', Arial, sans-serif`;
      ctx.fillStyle    = '#A100FF';
      ctx.fillText('JD', cx - 16, cy);
      ctx.font         = `300 20px 'Graphik', Arial, sans-serif`;
      ctx.fillStyle    = '#ffffff';
      ctx.fillText('igital', cx + 20, cy);
    }
  }

  // ── Render loop ──
  function render(ts) {
    const t = ts / 1000;
    ctx.clearRect(0, 0, W, H);

    const vgrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.75);
    vgrd.addColorStop(0, 'rgba(0,0,0,0)');
    vgrd.addColorStop(1, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = vgrd;
    ctx.fillRect(0, 0, W, H);

    BRANCHES.forEach(b => {
      const hasActive = nodes.some(n => n.branchId === b.id && (openNode === n || hoveredNode === n));
      drawConnector(cx, cy, b._bx, b._by, b.color, hasActive ? 0.80 : 0.50, hasActive ? 2.8 : 1.8);
    });

    nodes.forEach(nd => {
      const floatY = Math.sin(t * nd.floatSpeed + nd.phase) * nd.floatAmp;
      const isAct  = hoveredNode === nd || openNode === nd;
      drawConnector(nd.bx, nd.by, nd.x, nd.y + floatY, nd.branchColor, isAct ? 0.85 : 0.50, isAct ? 2.8 : 1.6);
    });

    BRANCHES.forEach(b => drawBranchLabel(b));
    nodes.forEach(nd => drawNode(nd, t));
    drawCenter(t);

    requestAnimationFrame(render);
  }

  // ── Hit detection ──
  function hitTest(mx, my) {
    const hitR = W < 480 ? 46 : 52;
    for (const nd of nodes) {
      const ry = nd._ry ?? nd.y;
      if (Math.hypot(mx - nd.x, my - ry) < hitR) return nd;
    }
    return null;
  }

  // ── Info card (desktop) ──
  const capInfoCard  = document.getElementById('capInfoCard');
  const capInfoTitle = document.getElementById('capInfoTitle');
  const capInfoDesc  = document.getElementById('capInfoDesc');

  function openInfoCard(nd) {
    const lang = document.documentElement.dataset.lang || 'EN';
    const dict = i18nDicts[lang] || {};
    capInfoTitle.textContent = dict[`capabilities_node_${nd.id}_label`] || nd.label.replace('\n', ' ');
    capInfoDesc.textContent  = dict[`capabilities_node_${nd.id}_desc`]  || nd.desc;

    const margin = 12;
    const cardW  = 288;
    const cardH  = 170;
    let left     = nd.x + 30;
    let top      = (nd._ry ?? nd.y) - 44;

    if (left + cardW + margin > W) left = nd.x - cardW - 30;
    if (top < margin) top = margin;
    if (top + cardH > H - margin) top = H - cardH - margin;

    capInfoCard.style.left = left + 'px';
    capInfoCard.style.top  = top  + 'px';
    capInfoCard.classList.add('visible');
  }

  function closeInfoCard() {
    capInfoCard.classList.remove('visible');
    openNode = null;
  }

  // ── Bottom sheet (mobile) ──
  const capBottomSheet = document.getElementById('capBottomSheet');
  const capSheetTitle  = document.getElementById('capSheetTitle');
  const capSheetDesc   = document.getElementById('capSheetDesc');
  const capBackdrop    = document.getElementById('capBackdrop');

  function openSheet(nd) {
    const lang = document.documentElement.dataset.lang || 'EN';
    const dict = i18nDicts[lang] || {};
    capSheetTitle.textContent = dict[`capabilities_node_${nd.id}_label`] || nd.label.replace('\n', ' ');
    capSheetDesc.textContent  = dict[`capabilities_node_${nd.id}_desc`]  || nd.desc;
    capBottomSheet.classList.add('visible');
    capBackdrop.classList.add('visible');
  }
  function closeSheet() {
    capBottomSheet.classList.remove('visible');
    capBackdrop.classList.remove('visible');
    openNode = null;
  }
  capBackdrop.addEventListener('click', closeSheet);
  document.getElementById('capInfoCardClose').addEventListener('click', closeInfoCard);
  document.getElementById('capBottomSheetClose').addEventListener('click', closeSheet);

  // ── Interaction ──
  function getPos(e) {
    const rect = capCanvas.getBoundingClientRect();
    return {
      x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
      y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top,
    };
  }

  capCanvas.addEventListener('mousemove', e => {
    const { x, y } = getPos(e);
    hoveredNode = hitTest(x, y);
    capCanvas.style.cursor = hoveredNode ? 'pointer' : 'default';
  });

  capCanvas.addEventListener('mouseleave', () => {
    hoveredNode = null;
    capCanvas.style.cursor = 'default';
  });

  capCanvas.addEventListener('click', e => {
    const { x, y } = getPos(e);
    const hit = hitTest(x, y);
    if (!hit)             { closeInfoCard(); return; }
    if (openNode === hit) { closeInfoCard(); return; }
    openNode = hit;
    openInfoCard(hit);
  });

  capCanvas.addEventListener('touchend', e => {
    e.preventDefault();
    const rect = capCanvas.getBoundingClientRect();
    const tx   = e.changedTouches[0].clientX - rect.left;
    const ty   = e.changedTouches[0].clientY - rect.top;
    const hit  = hitTest(tx, ty);
    if (!hit) return;
    if (openNode === hit) { closeSheet(); return; }
    openNode = hit;
    openSheet(hit);
  }, { passive: false });

  document.addEventListener('click', e => {
    if (!capInfoCard.contains(e.target) && e.target !== capCanvas) closeInfoCard();
  });

  // ── Resize ──
  const ro = new ResizeObserver(() => {
    closeInfoCard();
    closeSheet();
    computeLayout();
  });
  ro.observe(capWrapper);

  // ── Init ──
  computeLayout();
  requestAnimationFrame(render);
})();

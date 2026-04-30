# JDigital — Portfolio project context

**Project:** JDigital personal portfolio — single-page, static HTML/CSS/JS, bilingual (EN/ES)
**Purpose:** Showcase digital capabilities, expertise, and proven impact (design, development, growth hacking)
**Target audience:** Prospective clients, partners, recruiters in LATAM + international
**Live:** https://jdigital.pe
**GitHub:** https://github.com/jdsaire/frontend_c3_portfolio (main = production)

---

## Tech Stack
- **Frontend:** Plain HTML/CSS/JS — no framework, no bundler, no build step
- **i18n:** Custom JS engine (COPY dictionary, swapLang function)
- **Responsive:** Mobile-first, CSS Grid + Flexbox, viewport units (clamp)
- **Accessibility:** ARIA labels, semantic HTML, focus visible, reduced-motion support

---

## Brand Rules (Accenture + JD Partners)

### Color Palette
- **Primary:** #A100FF (brand purple)
- **Hover state:** #8C00D9 (darker purple)
- **Light accent:** #C2A3FF
- **Black (bg):** #000000
- **White (text):** #FFFFFF
- **Text muted:** rgba(255, 255, 255, 0.6)
- **Text dim:** rgba(255, 255, 255, 0.45)
- **Border faint:** rgba(255, 255, 255, 0.06)
- **Border soft:** rgba(255, 255, 255, 0.1)

### Typography
- **Font:** Graphik (or Arial fallback)
- **Weights:** 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 900 (black)
- **Size scale:** Fluid clamp() for responsive typography
- **Letter spacing:** Vary per element (H1: -0.025em, nav: 0.005em, labels: 0.12em)

### Motion & Timing
- **Easing standard:** cubic-bezier(0.4, 0, 0.2, 1)
- **Easing decelerate:** cubic-bezier(0, 0, 0.2, 1)
- **Duration UI:** 250ms (quick interactions)
- **Duration ambient:** 7000ms (background gradients, pulse animations)
- **Respect:** prefers-reduced-motion (all animations disabled if set)

### Spacing & Layout
- **Max width:** 1440px
- **Gutter (padding):** clamp(1rem, 3.5vw, 5rem) — responsive horizontal padding
- **Nav height:** clamp(3.5rem, 4vw, 4rem)
- **Grid gap:** clamp(1rem, 1.8vw, 1.75rem) — responsive vertical stacking

### Design Patterns
- **Navbar:** Fixed, scrolls up when user scrolls down (nav--hidden class), blur backdrop, subtle borders
- **Hero:** Full viewport height (100vh/100svh), animated gradient background (drift keyframe), stat counter animation on scroll
- **Buttons/CTAs:** Purple background, underline animation, icon + label layout
- **Tags:** Border 1px light, hover state brightens border + text
- **Cards:** TBD (not yet built)
- **Forms:** TBD (not yet built)

---

## Copy Tone & Voice

### English (Source of Record)
- **Tone:** Confident, direct, results-focused
- **Voice:** First-person (JD perspective), action-oriented
- **Examples:**
  - Nav: "Work", "Services", "Capabilities", "Mindset", "Connect"
  - Hero H1: "Your digital / ambitions / live here" (line 3 in purple)
  - CTA: "See the work"

### Spanish (ES)
- **Tone:** Same confident, direct, results-focused — localized to Peruvian context
- **Voice:** First-person, action-oriented, culturally resonant for LATAM
- **Note:** Not a literal translation; adapted for local voice and rhythm
- **Examples:**
  - Nav: "Proyectos", "Servicios", "Competencias", "Mentalidad", "Conectar"
  - Hero H1: "Ambiciones / digitales / sin límites" (line 3 in purple)
  - CTA: "Explorar"

**Locked copy** (verified with principal):
- Hero badge EN/ES ✓
- Hero H1 lines 1–3 EN/ES ✓
- Discipline tags (Frontend, UX/UI, Growth Hacking, Agile/Scrum, Analytics) — identical EN/ES ✓
- Stats block EN/ES ✓
- Nav links + CTA EN/ES ✓

---

## Organism Status

| Organism | Status | Notes |
|---|---|---|
| **Nav** | ✓ Done | v9 bilingual, scroll-hide, mobile overlay, lang selector |
| **Hero** | ✓ Done | v9 bilingual, animated background, stat count-up, responsive grid |
| **About/Mindset** | Pending | Section content TBD; copy locked (title = "Mentalidad" ES / "Mindset" EN) |
| **Services** | Pending | Card grid or list; copy from jdp-copywriting-en + jdp-copywriting-es skills |
| **Capabilities/Competencies** | ✓ Done | Mental map canvas + 2×2 badge grid; EN copy locked; ES placeholder = EN (next iteration) |
| **Work/Projects** | Pending | Case study cards or carousel; copy from skills |
| **Contact** | Pending | Form or email CTA; copy from skills |
| **Footer** | Pending | Links, legal, social; copy from skills |

---

## File Structure

```
jdigital-index/
├── index.html                 # Single HTML file, all organisms included
├── CLAUDE.md                  # This file — project context (read at session start)
├── assets/
│   ├── css/
│   │   ├── main.css          # All styles (nav, hero, future organisms)
│   │   └── organisms/        # (Optional) Individual CSS partials per organism
│   │       ├── nav.css
│   │       └── hero.css
│   ├── js/
│   │   └── main.js           # i18n engine, event listeners (nav, hero, future organisms)
│   └── img/                  # Images, logos, case study assets
└── organisms/                # (Reference only) Isolated HTML snippets
    ├── nav.html
    └── hero.html
```

---

## Git Workflow

- **Default branch:** `main` (production-ready)
- **Commit message format:** `feat: <organism>`, `fix: <issue>`, `chore: <maintenance>`
- **Deploy:** Push to `main` → GitHub Pages auto-deploys (if enabled)
- **Note:** Each organism integration = 1 atomic commit

---

## Skills & Knowledge

When building organisms, trigger these skills in Claude Code:
- **`anthropic-skills:accenture-branding`** — Color, spacing, motion, responsive rules
- **`anthropic-skills:jdp-copywriting-en`** — English copy and tone validation
- **`anthropic-skills:jdp-copywriting-es`** — Spanish copy and tone validation

---

## Next Steps (Before Next Session)

1. ✓ Nav + Hero exported from Claude Project → local index.html
2. ✓ CSS + JS extracted into separate files
3. ✓ CLAUDE.md generated with brand rules + organism status
4. **Next:** Push initial commit to GitHub
5. **Then:** Build remaining organisms (About, Services, Work, Contact, Footer) one per session

---

## Session Optimization Tips

1. **Scope:** One organism per Claude Code session (keeps context low, tokens cheap)
2. **Reference:** Always say "read `assets/css/main.css`" instead of pasting code
3. **Skills:** Trigger brand + copy skills automatically; no need to re-paste rules
4. **Model:** Use Sonnet for organisms, Haiku for mechanical edits
5. **Preview:** Use `mcp__Claude_Preview__preview_start` + screenshot to verify visually
6. **Commit:** After each organism is integrated and green, commit atomically
7. **Compact:** If a session runs long, use `/compact` to compress history without losing context

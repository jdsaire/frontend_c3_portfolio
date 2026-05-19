# JDigital — Personal Portfolio

Single-page, static, bilingual (EN/ES) portfolio for **JDigital**, the solo digital-architecture practice of Juan Diego Saire.

- **Live site:** https://jdigital.pe/
- **Repo:** https://github.com/jdsaire/frontend_c3_portfolio

## Tech stack

- Vanilla HTML5, CSS3, JavaScript — no framework, no bundler, no build step
- Custom i18n engine (`COPY` dictionary + `swapLang()` in `assets/js/main.js`, with `assets/i18n/{en,es}.json`)
- Formspree for contact form submission
- Phosphor Icons (locked icon family)

## Structure

```
index.html              # Single HTML file, all organisms inline
assets/
  css/main.css          # All styles
  js/main.js            # i18n engine + organism IIFEs
  i18n/{en,es}.json     # Bilingual copy dictionaries
  img/                  # Portrait, work, services, capabilities assets
logos/                  # JDigital wordmark variants
```

## Local preview

No build step. Open `index.html` directly in a browser, or serve the repo root with any static server:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000/
```

## Deployment

Deployed via **GitHub Pages** from the `main` branch at https://jdigital.pe/. The `.nojekyll` file at the repo root disables Jekyll processing so that any future asset paths beginning with `_` are served verbatim.

## Course submission

Built and submitted for the Microsoft Front-End Specialization Course 3 final assignment. Course-criteria coverage:

- Criterion 1 — HTML structure (5 pt)
- Criterion 2 — Accessibility (3 pt)
- Criterion 3 — CSS styling (5 pt)
- Criterion 4 — JavaScript interactivity (5 pt)
- Criterion 5 — Responsive design (2 pt)

Total target: 20 / 20.

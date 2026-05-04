# ColumnCalc – Cross-Section Selection for Compression Members

Online calculator for determining the required cross-sectional area of centrally compressed steel members per **SP 16.13330.2017**.

🔗 **[Open Calculator](https://columncalc.sherhn.space/)**

---

## About

This tool helps structural engineers quickly determine the **minimum required cross-sectional area** of a compressed member (column, strut, diagonal):

```
A ≥ N / (φ × Ry × γc)
```

without manually interpolating tables or doing hand calculations.

### Features

- Determines the design resistance **Ry** by steel grade and selected thickness range (Table B.5 of SP 16)
- Calculates the reduced slenderness **λ̄ = λ × √(Ry / E)**
- Finds the buckling reduction factor **φ** for stability curves **a / b / c**
- Returns the required area **A_req** in cm² and m²
- Displays the full formula substitution with all values
- Supports units: N / kN / MN / tf, mm² / cm² / m²
- Interface available in **5 languages**: RU, EN, DE, FR, 中文

---

## Supported Steel Grades

C235 · C245 · C255 · C345 · C345K · C355 · C355-1/K · C390/C390-1 · C440 · C590 · C690

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styles | CSS (Custom Properties, Grid, Flexbox) |
| Logic | Vanilla JS (ES Modules) |
| Fonts | IBM Plex Sans / IBM Plex Mono |
| Hosting | GitHub Pages |

No frameworks, no dependencies – a single `index.html` and two helper modules.

---

## Repository Structure

```
├── index.html          # Main page
├── scripts/
│   ├── calculator.js   # Computation core (Ry, λ̄, φ, area selection)
│   └── i18n.js         # Localization strings
├── images/
│   ├── a.png           # Section icon – type a
│   ├── b.png           # Section icon – type b
│   └── c.png           # Section icon – type c
├── README.md
└── LICENSE
```

---

## Running Locally

Since the project uses ES Modules, files must be served through a local server rather than opened directly from the filesystem.

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .
```

Then open `http://localhost:8000` in your browser.

---

## Deploying to GitHub Pages

1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select branch `main`, folder `/ (root)`
4. Click **Save** – the site will be available at `https://<username>.github.io/<repo>/`

---

## Normative References

- **SP 16.13330.2017** – Steel Structures (updated edition of SNiP II-23-81*)
- Table B.5 – Design resistances of rolled steel
- Annex D – Buckling reduction factor φ for stability curves a, b, c

---

## License

© 2026 sherhn. All rights reserved.  
Use, distribution, and commercial application are permitted only with the author's written consent.  
See the [LICENSE](./LICENSE) file for details.
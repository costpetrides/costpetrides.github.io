# Constantinos Petrides — Personal Portfolio

**Website:** https://costpetrides.github.io/

A minimal, editorial-style academic/developer portfolio built with HTML, CSS and vanilla JavaScript. No build step is required. The original starfield hero photo is retained, with a compact, readable layout and navigation that adapts from dark to light as visitors scroll.

## Site structure

The name in the navigation links to the top of the page; the navigation has three main destinations:

- **About:** a short biography with CV, GitHub, LinkedIn and email links.
- **Repositories:** six selected public GitHub repositories shown in compact rows, with an optional control to reveal the entire list.
- **Simulations:** three lightweight poster previews linking to existing individual simulation pages in the separate [Fluid Dynamics gallery](https://costpetrides.github.io/Fluid-Dynamics-Navier-Stokes/).

Repositories are loaded using the public GitHub API. The six static repository links remain available if JavaScript is disabled or GitHub rate-limits a visitor. The full GitHub profile is always linked.

## Homepage files

| Path | Purpose |
| --- | --- |
| `index.html` | Accessible homepage, starfield hero, metadata and static fallback content |
| `css/portfolio.css` | Minimal design system and responsive styles |
| `js/portfolio.js` | Mobile navigation, legacy hash support, curated repository display and expansion |
| `wallpaper.jpg` | Original background photo used in the cinematic hero (preloaded for faster first render) |
| `favicon.svg` | Site favicon |
| `Full_CV.pdf` | Existing CV |

**Animation posters are loaded directly from the Fluid Dynamics repository.** This homepage does not auto-play or duplicate GIFs/MP4s.

## Legacy compatibility

The unlisted `classes.html` course-material page remains accessible at its old URL, with all existing PDF links intact. It uses the original `css/styles.css` and `js/main.js`. Existing PDF and media files remain untouched.

Old homepage fragment links are retained through redirects in `js/portfolio.js`: `#research`, `#projects`, `#visualizations`, and `#contact`.

## Local preview

Run in the repository root:

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000/`.

## Deployment

Static files are served by GitHub Pages from the `main` branch; there is no npm install or compilation.

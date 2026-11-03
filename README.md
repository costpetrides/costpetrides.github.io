# Constantinos Petrides — Personal Portfolio

**Website:** https://costpetrides.github.io/

A minimal, editorial-style academic/developer portfolio built with HTML, CSS and vanilla JavaScript. No build step is required. The original starfield hero photo is retained, with a compact, readable layout and navigation that adapts from dark to light as visitors scroll.

## Full-viewport scrolling

The hero and the three main sections are explicit `screen-section` panels with full browser width and a minimum height equal to the live viewport (`100dvh`, with `100svh`/`100vh` fallbacks). Content is vertically aligned within each panel and uses a responsive layout up to 1480 px wide. On desktop viewports at least 900px wide and 700px tall, native CSS scroll snapping aligns one panel at a time without JavaScript intercepting scrolling. Snapping is relaxed for shorter and mobile viewports, reduced-motion preferences, and expanded repository lists, so content never becomes trapped or clipped.

The final footer is included at the bottom of the Simulations panel.

The homepage CSS and JavaScript URLs include a version parameter so browsers such as Safari retrieve the latest layout after deployments instead of rendering previously cached section heights.

## Site structure

The name in the navigation links to the top of the page; the navigation has three main destinations:

- **About:** a short biography with CV, GitHub, LinkedIn and email links.
- **Repositories:** six selected public GitHub repositories shown in compact rows, with an optional control to reveal the entire list.
- **Simulations:** six lightweight previews (four simulation posters and two notebook visualisations) in a slow, seamlessly looping horizontal slideshow. Selecting any card opens its existing simulation page in the separate [Fluid Dynamics gallery](https://costpetrides.github.io/Fluid-Dynamics-Navier-Stokes/). The slideshow pauses on hover or keyboard focus, includes a Pause/Resume control, and becomes a manually scrollable gallery when reduced motion is requested.

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

**Simulation and notebook previews are loaded directly from the Fluid Dynamics repository.** The moving slideshow only animates the cards' position; it does not auto-play GIFs/MP4s. Its second image set is generated client-side for seamless looping, omitted from keyboard navigation and hidden from screen readers.

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

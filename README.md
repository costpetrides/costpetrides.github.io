# Constantinos Petrides — Personal Website

Live website: https://costpetrides.github.io/

A lightweight GitHub Pages portfolio built with plain HTML, CSS and JavaScript.

## Main navigation

- **Home:** short introduction.
- **About Me:** bio, CV, email and LinkedIn.
- **GitHub Repos:** public, non-fork repositories from the GitHub API, with search. If the API is unavailable or rate-limited, a small set of static repository links remains visible.
- **Animations:** lightweight previews linking to individual simulation pages on the existing [Fluid Dynamics website](https://costpetrides.github.io/Fluid-Dynamics-Navier-Stokes/), plus a link to its gallery and source repository.

Research-area categories and Teaching do not appear in the homepage navigation.

## Source files

| File | Responsibility |
| --- | --- |
| \`index.html\` | Homepage markup, metadata, featured repository fallback and animation links |
| \`css/portfolio.css\` | Responsive homepage styling |
| \`js/portfolio.js\` | Mobile navigation, GitHub API listing and repository search |
| \`wallpaper.jpg\` | Existing homepage hero background |
| \`Full_CV.pdf\` | Existing CV |

### Legacy files retained

\`classes.html\`, \`css/styles.css\`, \`js/main.js\`, \`js/site-data.js\` and existing PDFs/media remain unchanged, so old URLs keep working. The main homepage no longer links to Classes. Legacy assets can be reorganized separately later without breaking external links.

## Fluid Dynamics links

The animation preview photos are served directly from
\`https://costpetrides.github.io/Fluid-Dynamics-Navier-Stokes/\`.

The main website does **not** duplicate large GIF or MP4 animations. Each preview links to an existing simulation page in that separate repository.

## Local preview

From the repository root:

\`\`\`bash
python3 -m http.server 8000
\`\`\`

Then open \`http://localhost:8000/\`. The GitHub API requires internet access; the fallback repository cards work offline.

## Deployment

The site is static and published via GitHub Pages from the default repository branch. No build or npm install is required.

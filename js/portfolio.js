/* Home page interactions.
   Classes and the existing Fluid Dynamics website are intentionally independent. */

(() => {
  "use strict";

  const username = "costpetrides";
  const featured = [
    "Fluid-Dynamics-Navier-Stokes",
    "Quantum-Classical-Navier-Stokes",
    "Temperature_Forecasting_MethodComparison",
    "NOx-Ozone-Relationship-Modeling-with-ML"
  ];

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const grid = document.getElementById("repoGrid");
  const search = document.getElementById("repoSearch");
  const status = document.getElementById("repoStatus");
  const empty = document.getElementById("repoEmpty");

  let githubRepositories = null;

  // Preserve bookmarked links from the previous homepage structure.
  const oldSections = {
    "#research": "#about",
    "#projects": "#repositories",
    "#visualizations": "#animations",
    "#contact": "#about"
  };
  const currentHash = window.location.hash.toLowerCase();
  if (oldSections[currentHash]) {
    const destination = oldSections[currentHash];
    window.history.replaceState(null, "", destination);
    window.requestAnimationFrame(() => {
      document.querySelector(destination)?.scrollIntoView();
    });
  }

  function closeMenu() {
    if (!navToggle || !navLinks) return;
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  // A visible highlight follows the section currently being read.
  if ("IntersectionObserver" in window && navLinks) {
    const links = [...navLinks.querySelectorAll('a[href^="#"]')];
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          if (link.getAttribute("href") === "#" + entry.target.id) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }

  function addText(parent, tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = value;
    parent.appendChild(node);
    return node;
  }

  function makeRepositoryCard(repo) {
    const card = document.createElement("article");
    card.className = "repo-card";

    addText(card, "p", "repo-card-label", repo.language || "GitHub repository");

    const heading = document.createElement("h3");
    const link = document.createElement("a");
    // Build the URL from the known account and the GitHub repository name.
    link.href = "https://github.com/" + username + "/" + encodeURIComponent(repo.name);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = repo.name + " ↗";
    heading.appendChild(link);
    card.appendChild(heading);

    addText(card, "p", "", repo.description || "Open-source code and experiments.");

    const meta = document.createElement("div");
    meta.className = "repo-card-meta";
    if (repo.stargazers_count > 0) {
      addText(meta, "span", "", "★ " + repo.stargazers_count);
    }
    if (repo.archived) addText(meta, "span", "", "Archived");
    if (repo.pushed_at) {
      const date = new Date(repo.pushed_at);
      if (!Number.isNaN(date.getTime())) {
        addText(meta, "span", "", "Updated " + date.toLocaleDateString("en-GB", { month: "short", year: "numeric" }));
      }
    }
    if (meta.children.length > 0) card.appendChild(meta);
    return card;
  }

  function getSearchTerm() {
    return search ? search.value.trim().toLocaleLowerCase() : "";
  }

  function renderRepositories() {
    if (!grid || !githubRepositories) return;
    const term = getSearchTerm();

    const matching = githubRepositories.filter((repo) => (
      [repo.name, repo.description, repo.language]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase()
        .includes(term)
    ));

    const fragment = document.createDocumentFragment();
    matching.forEach((repo) => fragment.appendChild(makeRepositoryCard(repo)));
    grid.replaceChildren(fragment);
    if (empty) empty.hidden = matching.length !== 0;
  }

  function filterFallbackCards() {
    if (!grid) return;
    const term = getSearchTerm();
    let visible = 0;
    grid.querySelectorAll(".repo-card").forEach((card) => {
      const matches = card.textContent.toLocaleLowerCase().includes(term);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    if (empty) empty.hidden = visible !== 0;
  }

  if (search) {
    search.addEventListener("input", () => {
      if (githubRepositories) renderRepositories();
      else filterFallbackCards();
    });
  }

  async function loadRepositories() {
    if (!grid) return;
    try {
      const response = await fetch(
        "https://api.github.com/users/" + username + "/repos?sort=pushed&per_page=100&type=owner",
        { headers: { Accept: "application/vnd.github+json" } }
      );
      if (!response.ok) throw new Error("GitHub API status " + response.status);

      const result = await response.json();
      if (!Array.isArray(result)) throw new Error("Unexpected GitHub API response");

      // Do not silently present other users' forks as personal repositories.
      githubRepositories = result.filter((repo) => (
        repo && repo.name && repo.owner &&
        repo.owner.login.toLowerCase() === username &&
        repo.fork === false && repo.private === false
      ));

      // Keep selected projects visible first, then list the rest by activity.
      githubRepositories.sort((a, b) => {
        const aIndex = featured.indexOf(a.name);
        const bIndex = featured.indexOf(b.name);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0);
      });

      renderRepositories();
      if (status) status.textContent =
        githubRepositories.length + " public repositories · fetched from GitHub.";
    } catch (error) {
      // The static cards are preserved on rate limits, offline access and API errors.
      githubRepositories = null;
      filterFallbackCards();
      if (status) status.textContent =
        "Live GitHub list unavailable. Showing selected repositories; the full list is linked above.";
    }
  }

  loadRepositories();
})();

/* Minimal homepage interactions: responsive navigation and GitHub repositories.
   The separate Fluid Dynamics gallery is not modified. */
(() => {
  "use strict";

  const githubUser = "costpetrides";
  const featured = [
    { name: "Fluid-Dynamics-Navier-Stokes", title: "Fluid Dynamics / Navier–Stokes", summary: "Numerical flow simulations and visualisations." },
    { name: "Quantum-Classical-Navier-Stokes", title: "Quantum–Classical Navier–Stokes", summary: "Hybrid quantum-classical methods for fluid dynamics." },
    { name: "FAIRMODE-WG5", title: "FAIRMODE WG5", summary: "Bias correction for air-quality model predictions." },
    { name: "NOx-Ozone-Relationship-Modeling-with-ML", title: "NOx–Ozone Modelling", summary: "Machine learning applied to atmospheric chemistry." },
    { name: "Temperature_Forecasting_MethodComparison", title: "Temperature Forecasting", summary: "Comparison of time-series forecasting methods." },
    { name: "UCASS-Intercomparison", title: "UCASS Intercomparison", summary: "Atmospheric measurement and sensor comparison." },
    { name: "Box_Model", title: "Box Model", summary: "Interactive chemical box-model dashboard for comparing scenarios and species." }
  ];

  const curated = new Map(featured.map((item) => [item.name, item]));
  const menu = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const list = document.getElementById("repoList");
  const showAllButton = document.getElementById("showAllRepos");
  const status = document.getElementById("repoStatus");

  let repositories = null;
  let showAll = false;

  // Keep navigation translucent over the photograph and readable over white content.
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");

  function syncHeaderAppearance() {
    if (!header || !hero) return;
    const heroBottom = hero.getBoundingClientRect().bottom;
    header.classList.toggle("is-scrolled", heroBottom <= header.offsetHeight + 8);
  }

  window.addEventListener("scroll", syncHeaderAppearance, { passive: true });
  window.addEventListener("resize", syncHeaderAppearance, { passive: true });
  syncHeaderAppearance();
  window.requestAnimationFrame(syncHeaderAppearance);


  // Start the entrance when About is almost at its final snapped position.
  // Reset only once it has substantially left the screen, so it replays both ways.
  const aboutSection = document.getElementById("about");
  if (aboutSection) {
    let aboutFramePending = false;

    function updateAboutAnimation() {
      aboutFramePending = false;
      const rect = aboutSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const readyToReveal =
        rect.top <= viewportHeight * 0.12 &&
        rect.bottom >= viewportHeight * 0.88;
      const clearlyExited =
        rect.top >= viewportHeight * 0.75 ||
        rect.bottom <= viewportHeight * 0.25;

      if (readyToReveal) {
        aboutSection.classList.add("about-revealed");
      } else if (clearlyExited) {
        aboutSection.classList.remove("about-revealed");
      }
    }

    function queueAboutAnimationCheck() {
      if (aboutFramePending) return;
      aboutFramePending = true;
      window.requestAnimationFrame(updateAboutAnimation);
    }

    window.addEventListener("scroll", queueAboutAnimationCheck, { passive: true });
    window.addEventListener("resize", queueAboutAnimationCheck, { passive: true });
    queueAboutAnimationCheck();
    // Also check after smooth scrolling or a scroll-snap transition finishes.
    window.addEventListener("scrollend", queueAboutAnimationCheck, { passive: true });
  }

  function closeMenu() {
    if (!menu || !navLinks) return;
    navLinks.classList.remove("is-open");
    menu.setAttribute("aria-expanded", "false");
  }

  if (menu && navLinks) {
    menu.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      menu.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target) && !navLinks.contains(event.target)) closeMenu();
    });
  }

  // Support incoming links/bookmarks created before this redesign.
  const oldAnchors = {
    "#research": "#about",
    "#projects": "#repositories",
    "#visualizations": "#animations",
    "#contact": "#about"
  };
  const oldHash = window.location.hash.toLowerCase();
  if (oldAnchors[oldHash]) {
    const newAnchor = oldAnchors[oldHash];
    window.history.replaceState(null, "", newAnchor);
    window.requestAnimationFrame(() => {
      document.querySelector(newAnchor)?.scrollIntoView();
    });
  }

  if ("IntersectionObserver" in window && navLinks) {
    const navAnchors = [...navLinks.querySelectorAll('a[href^="#"]')];
    const targets = navAnchors
      .map((anchor) => document.querySelector(anchor.getAttribute("href")))
      .filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((anchor) => {
          if (anchor.getAttribute("href") === "#" + entry.target.id) {
            anchor.setAttribute("aria-current", "location");
          } else {
            anchor.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
    targets.forEach((target) => observer.observe(target));
  }

  function repositoryURL(name) {
    return "https://github.com/" + githubUser + "/" + encodeURIComponent(name);
  }

  function createRepositoryRow(repo) {
    const info = curated.get(repo.name);
    const link = document.createElement("a");
    link.className = "repo-item";
    link.href = repositoryURL(repo.name);
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const main = document.createElement("span");
    main.className = "repo-main";
    const title = document.createElement("strong");
    title.textContent = info?.title || repo.name;
    main.appendChild(title);

    // Limit uncurated API descriptions so the expanded list stays compact.
    const rawSummary = info?.summary || repo.description || "";
    const shortSummary = rawSummary.replace(/\s+/g, " ").trim().slice(0, 110);
    if (shortSummary) {
      const description = document.createElement("span");
      description.textContent = shortSummary + (rawSummary.length > 110 ? "…" : "");
      main.appendChild(description);
    }

    const arrow = document.createElement("span");
    arrow.className = "repo-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";

    link.append(main, arrow);
    return link;
  }

  function selectedFirst(items) {
    const byName = new Map(items.map((repo) => [repo.name, repo]));
    const selected = featured.map((item) => byName.get(item.name)).filter(Boolean);
    const selectedNames = new Set(selected.map((repo) => repo.name));
    const rest = items
      .filter((repo) => !selectedNames.has(repo.name))
      .sort((a, b) => new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0));
    return [...selected, ...rest];
  }

  function renderRepositories() {
    if (!list || !repositories) return;

    const visible = showAll ? repositories : repositories.slice(0, featured.length);
    const fragment = document.createDocumentFragment();
    visible.forEach((repo) => fragment.appendChild(createRepositoryRow(repo)));
    list.replaceChildren(fragment);

    if (showAllButton) {
      showAllButton.hidden = repositories.length <= featured.length;
      showAllButton.textContent = showAll
        ? "Show selected repositories ↑"
        : "Show all " + repositories.length + " repositories ↓";
      showAllButton.setAttribute("aria-expanded", String(showAll));
    }
    if (status) {
      status.textContent = showAll
        ? repositories.length + " public repositories"
        : visible.length + " selected · " + repositories.length + " public repositories";
    }
  }

  if (showAllButton) {
    showAllButton.addEventListener("click", () => {
      showAll = !showAll;
      // Expanded lists can be taller than the viewport; disable snapping until collapsed.
      document.documentElement.classList.toggle("expanded-repositories", showAll);
      renderRepositories();
      if (!showAll) {
        document.getElementById("repositories")?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  }

  async function fetchRepositories() {
    if (!list) return;
    try {
      const response = await fetch(
        "https://api.github.com/users/" + githubUser + "/repos?type=owner&sort=pushed&per_page=100",
        { headers: { Accept: "application/vnd.github+json" } }
      );
      if (!response.ok) throw new Error("GitHub request failed");
      const payload = await response.json();
      if (!Array.isArray(payload)) throw new Error("Invalid GitHub response");

      // Display only public repositories owned by this account; exclude forks.
      const owned = payload.filter((repo) =>
        repo && typeof repo.name === "string" &&
        repo.owner?.login?.toLowerCase() === githubUser &&
        repo.private === false && repo.fork === false
      );
      if (!owned.length) throw new Error("Empty GitHub response");
      repositories = selectedFirst(owned);
      renderRepositories();
    } catch {
      // The featured HTML links above are always available as a fallback.
      if (showAllButton) showAllButton.hidden = true;
      if (status) status.textContent = "Selected repositories · More on GitHub";
    }
  }


  // Client-side access prompt for the Numerical-Methods-GFD PDF.
  // This is a convenience gate, NOT PDF encryption or secure authorization.
  const notesDialog = document.getElementById("notesPasswordDialog");
  const notesForm = document.getElementById("notesPasswordForm");
  const notesInput = document.getElementById("notesPasswordInput");
  const notesError = document.getElementById("notesPasswordError");
  const notesCancel = document.getElementById("notesPasswordCancel");
  let notesPDFTarget = null;

  if (notesDialog && notesForm && notesInput) {
    document.querySelectorAll("a.protected-pdf").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        notesPDFTarget = link.href;
        notesForm.reset();
        notesError.hidden = true;
        notesDialog.showModal();
        notesInput.focus();
      });
    });

    notesForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (notesInput.value.trim() !== "421421") {
        notesError.hidden = false;
        notesInput.focus();
        notesInput.select();
        return;
      }
      const destination = notesPDFTarget;
      notesDialog.close();
      notesPDFTarget = null;
      if (destination) window.location.assign(destination);
    });

    notesCancel?.addEventListener("click", () => notesDialog.close());
    notesDialog.addEventListener("close", () => {
      notesPDFTarget = null;
      notesError.hidden = true;
    });
  }

  fetchRepositories();
})();

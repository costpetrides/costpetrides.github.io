(function () {
  "use strict";

  const data = window.SITE_DATA || {};
  const profile = data.profile || {};
  const GITHUB_USER = profile.github || "costpetrides";

  const CATEGORY_LABELS = {
    fluid: "Fluid Dynamics",
    ml: "ML & Forecasting",
    quantum: "Quantum",
    atmospheric: "Atmospheric",
    computational: "Computational",
    particle: "Particle Physics",
  };

  function projectCategoryLabel(category) {
    return CATEGORY_LABELS[category] || "Research";
  }

  function projectBadge(project) {
    const lang = project.language;
    if (lang && lang !== "Jupyter Notebook") return lang;
    return projectCategoryLabel(project.category);
  }

  function projectTags(tags) {
    return (tags || []).filter((tag) => tag !== "Jupyter Notebook");
  }

  /* ── Navigation ──────────────────────────────────────── */
  function initNav() {
    const toggle = document.querySelector(".site-nav__toggle");
    const links = document.querySelector(".site-nav__links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => links.classList.remove("open"));
    });

    const sections = [...document.querySelectorAll("section[id], header[id]")];
    const navAnchors = [...document.querySelectorAll('.site-nav__links a[href^="#"]')];

    if (sections.length && navAnchors.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            navAnchors.forEach((a) => {
              a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
            });
          });
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      sections.forEach((s) => observer.observe(s));
    }
  }

  function initScrollTop() {
    const btn = document.getElementById("scrollTop");
    if (!btn) return;
    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 300);
    });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal:not(.revealed)");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
  }

  /* ── GitHub API ──────────────────────────────────────── */
  async function fetchGitHubProfile() {
    try {
      const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
      if (!res.ok) throw new Error("profile fetch failed");
      return await res.json();
    } catch {
      return null;
    }
  }

  async function fetchGitHubRepos() {
    try {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`
      );
      if (!res.ok) throw new Error("repos fetch failed");
      const repos = await res.json();
      return repos.filter((r) => !r.fork);
    } catch {
      return [];
    }
  }

  async function fetchCommitCount() {
    try {
      const res = await fetch(
        `https://api.github.com/search/commits?q=author:${GITHUB_USER}`,
        { headers: { Accept: "application/vnd.github+json" } }
      );
      if (!res.ok) throw new Error("commits fetch failed");
      const data = await res.json();
      return data.total_count ?? null;
    } catch {
      return null;
    }
  }

  function repoBySlug(repos, slug) {
    return repos.find((r) => r.name === slug || `${r.owner.login}/${r.name}` === slug);
  }

  function mergeProjects(repos) {
    const curated = data.projects || [];
    return curated.map((item) => {
      const repo = item.external
        ? null
        : repoBySlug(repos, item.slug || item.repo);
      const url = item.external
        ? `https://github.com/${item.repo}`
        : repo?.html_url || `https://github.com/${GITHUB_USER}/${item.slug}`;

      return {
        ...item,
        url,
        description: repo?.description || item.summary || "",
        language: repo?.language || "",
        updated: repo?.updated_at || null,
      };
    });
  }

  function renderStats(profileData, commitCount) {
    const container = document.getElementById("statsBar");
    if (!container) return;

    const repoCount = profileData?.public_repos ?? "—";
    const commits = commitCount != null ? commitCount.toLocaleString() : "—";

    const stats = [
      { value: repoCount, label: "Public Repositories" },
      { value: commits, label: "Commits" },
      { value: (data.focusAreas || []).length, label: "Research Areas" },
    ];

    container.innerHTML = stats
      .map(
        (s) => `
      <div class="stat-card reveal">
        <span class="stat-card__value">${s.value}</span>
        <span class="stat-card__label">${s.label}</span>
      </div>`
      )
      .join("");

    initReveal();
  }

  function renderFocusAreas() {
    const container = document.getElementById("focusAreas");
    if (!container) return;

    container.innerHTML = (data.focusAreas || [])
      .map(
        (area) =>
          `<span class="chip"><span class="chip__icon" aria-hidden="true">${area.icon}</span>${area.label}</span>`
      )
      .join("");
  }

  function renderResearch() {
    const container = document.getElementById("researchGrid");
    if (!container) return;

    container.innerHTML = (data.research || [])
      .map(
        (item) => `
      <article class="research-card reveal">
        <div class="research-card__meta">
          <span class="tag">${item.type}</span>
          ${item.year ? `<span class="research-card__year">${item.year}</span>` : ""}
        </div>
        <h3 class="research-card__title">${item.title}</h3>
        <p class="research-card__summary">${item.summary}</p>
        <div class="research-card__tags">
          ${(item.tags || []).map((t) => `<span class="tag tag--soft">${t}</span>`).join("")}
        </div>
        <a class="research-card__link" href="${item.url}" target="_blank" rel="noopener">
          Read more <span aria-hidden="true">→</span>
        </a>
      </article>`
      )
      .join("");
  }

  let allProjects = [];
  let activeFilter = "all";
  let searchQuery = "";

  function renderProjectFilters() {
    const container = document.getElementById("projectFilters");
    if (!container) return;

    container.innerHTML = (data.projectFilters || [])
      .map(
        (f) =>
          `<button type="button" class="filter-btn${f.id === activeFilter ? " active" : ""}" data-filter="${f.id}">${f.label}</button>`
      )
      .join("");

    container.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.dataset.filter;
        container.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderProjectGrid();
      });
    });
  }

  function filteredProjects() {
    return allProjects.filter((p) => {
      const matchesFilter = activeFilter === "all" || p.category === activeFilter;
      const q = searchQuery.toLowerCase();
      const haystack = [
        p.title,
        p.description,
        projectCategoryLabel(p.category),
        ...(p.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !q || haystack.includes(q);
      return matchesFilter && matchesSearch;
    });
  }

  function renderProjectGrid() {
    const container = document.getElementById("projectGrid");
    const empty = document.getElementById("projectEmpty");
    if (!container) return;

    const items = filteredProjects();
    if (empty) empty.hidden = items.length > 0;

    container.innerHTML = items
      .map(
        (p) => `
      <article class="project-card reveal${p.featured ? " project-card--featured" : ""}" data-category="${p.category}">
        <div class="project-card__top">
          <span class="project-card__category">${projectBadge(p)}</span>
        </div>
        <h3 class="project-card__title">
          <a href="${p.url}" target="_blank" rel="noopener">${p.title}</a>
        </h3>
        <p class="project-card__desc">${p.description || "Open-source research project."}</p>
        <div class="project-card__tags">
          ${projectTags(p.tags).map((t) => `<span class="tag tag--soft">${t}</span>`).join("")}
        </div>
      </article>`
      )
      .join("");

    initReveal();
  }

  function initProjectSearch() {
    const input = document.getElementById("projectSearch");
    if (!input) return;
    input.addEventListener("input", () => {
      searchQuery = input.value.trim();
      renderProjectGrid();
    });
  }

  function renderGallery() {
    const track = document.getElementById("galleryTrack");
    if (!track) return;

    const items = data.gallery || [];
    const slides = [...items, ...items];

    track.innerHTML = slides
      .map(
        (item, i) => `
      <button
        type="button"
        class="gallery-slide reveal"
        data-index="${i % items.length}"
        aria-label="Open ${item.caption}"
      >
        <div class="gallery-slide__media">
          <img src="${item.src}" alt="${item.alt}" loading="lazy" decoding="async">
        </div>
        <div class="gallery-slide__footer">
          <span class="gallery-slide__topic">${item.topic || "Simulation"}</span>
          <span class="gallery-slide__caption">${item.caption}</span>
        </div>
      </button>`
      )
      .join("");

    track.querySelectorAll(".gallery-slide").forEach((btn) => {
      btn.addEventListener("click", () => openLightbox(Number(btn.dataset.index)));
    });

    initReveal();
  }

  /* ── Lightbox ────────────────────────────────────────── */
  let lightboxIndex = 0;

  function openLightbox(index) {
    const overlay = document.getElementById("lightbox");
    if (!overlay) return;
    lightboxIndex = index;
    updateLightbox();
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    const overlay = document.getElementById("lightbox");
    if (!overlay) return;
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateLightbox() {
    const items = data.gallery || [];
    const item = items[lightboxIndex];
    if (!item) return;

    const img = document.getElementById("lightboxImage");
    const caption = document.getElementById("lightboxCaption");
    const topic = document.getElementById("lightboxTopic");
    const link = document.getElementById("lightboxLink");
    const counter = document.getElementById("lightboxCounter");
    if (img) {
      img.src = item.src;
      img.alt = item.alt;
    }
    if (caption) caption.textContent = item.caption;
    if (topic) {
      topic.textContent = item.topic || "";
      topic.hidden = !item.topic;
    }
    if (link) link.href = item.url;
    if (counter) counter.textContent = `${lightboxIndex + 1} / ${items.length}`;
  }

  function initLightbox() {
    const overlay = document.getElementById("lightbox");
    if (!overlay) return;

    overlay.querySelector("[data-lightbox-close]")?.addEventListener("click", closeLightbox);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeLightbox();
    });

    document.getElementById("lightboxPrev")?.addEventListener("click", () => {
      const len = (data.gallery || []).length;
      lightboxIndex = (lightboxIndex - 1 + len) % len;
      updateLightbox();
    });

    document.getElementById("lightboxNext")?.addEventListener("click", () => {
      const len = (data.gallery || []).length;
      lightboxIndex = (lightboxIndex + 1) % len;
      updateLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!overlay.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") document.getElementById("lightboxPrev")?.click();
      if (e.key === "ArrowRight") document.getElementById("lightboxNext")?.click();
    });
  }

  /* ── Command palette search ──────────────────────────── */
  function initCommandPalette() {
    const overlay = document.getElementById("commandPalette");
    const input = document.getElementById("commandInput");
    const results = document.getElementById("commandResults");
    if (!overlay || !input || !results) return;

    const pages = [
      { title: "About", url: "#about", type: "Section" },
      { title: "Research", url: "#research", type: "Section" },
      { title: "Projects", url: "#projects", type: "Section" },
      { title: "Contact", url: "#contact", type: "Section" },
      { title: "Gallery", url: "#visualizations", type: "Section" },
      { title: "Course Notes", url: "classes.html", type: "Page" },
      { title: "Download CV", url: profile.cv || "Full_CV.pdf", type: "File" },
      { title: "GitHub Profile", url: `https://github.com/${GITHUB_USER}`, type: "External" },
      { title: "LinkedIn", url: profile.linkedin, type: "External" },
      { title: "Email", url: `mailto:${profile.email}`, type: "Contact" },
    ];

    function openPalette() {
      overlay.classList.add("active");
      overlay.setAttribute("aria-hidden", "false");
      input.value = "";
      renderResults("");
      setTimeout(() => input.focus(), 50);
    }

    function closePalette() {
      overlay.classList.remove("active");
      overlay.setAttribute("aria-hidden", "true");
    }

    function renderResults(query) {
      const q = query.toLowerCase();
      const projectItems = allProjects.map((p) => ({
        title: p.title,
        url: p.url,
        type: "Project",
        meta: projectBadge(p) || p.type,
      }));

      const researchItems = (data.research || []).map((r) => ({
        title: r.title,
        url: r.url,
        type: "Research",
        meta: r.type,
      }));

      const matches = [...pages, ...projectItems, ...researchItems]
        .filter((item) => !q || item.title.toLowerCase().includes(q) || item.type.toLowerCase().includes(q))
        .slice(0, 8);

      results.innerHTML = matches.length
        ? matches
            .map(
              (item, i) => `
          <a class="command-item${i === 0 ? " active" : ""}" href="${item.url}" data-external="${item.type === "External" || item.type === "Project" ? "true" : "false"}">
            <span class="command-item__title">${item.title}</span>
            <span class="command-item__meta">${item.meta || item.type}</span>
          </a>`
            )
            .join("")
        : `<p class="command-empty">No results for "${query}"</p>`;

      results.querySelectorAll(".command-item").forEach((a) => {
        a.addEventListener("click", (e) => {
          if (a.dataset.external === "true") return;
          if (a.getAttribute("href").startsWith("#")) {
            e.preventDefault();
            closePalette();
            document.querySelector(a.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" });
          } else {
            closePalette();
          }
        });
      });
    }

    input.addEventListener("input", () => renderResults(input.value.trim()));

    overlay.querySelector("[data-command-close]")?.addEventListener("click", closePalette);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closePalette();
    });

    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openPalette();
      }
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        openPalette();
      }
      if (e.key === "Escape" && overlay.classList.contains("active")) closePalette();
    });

    document.querySelectorAll("[data-command-open]").forEach((btn) => {
      btn.addEventListener("click", openPalette);
    });
  }

  function initCopyEmail() {
    const btn = document.getElementById("copyEmail");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(profile.email);
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.textContent = "Copy email";
        }, 2000);
      } catch {
        window.location.href = `mailto:${profile.email}`;
      }
    });
  }

  /* ── Boot ────────────────────────────────────────────── */
  async function bootHomePage() {
    if (!document.body.classList.contains("page-home")) return;

    renderFocusAreas();
    renderResearch();
    renderProjectFilters();
    renderGallery();
    initProjectSearch();
    initLightbox();
    initCommandPalette();
    initCopyEmail();

    const [ghProfile, repos, commitCount] = await Promise.all([
      fetchGitHubProfile(),
      fetchGitHubRepos(),
      fetchCommitCount(),
    ]);
    allProjects = mergeProjects(repos);
    renderStats(ghProfile, commitCount);
    renderProjectGrid();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initScrollTop();
    initReveal();
    bootHomePage();
  });
})();

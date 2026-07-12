window.SITE_DATA = {
  profile: {
    name: "Constantinos Petrides",
    title: "Physics Student · National and Kapodistrian University of Athens",
    eyebrow: "Computational & Atmospheric Physics",
    tagline: "A bunch of atoms trying to understand themselves",
    bio:
      "Physics student at the National and Kapodistrian University of Athens, specializing in computational and atmospheric physics with emphasis on fluid dynamics, environmental modeling, and machine learning applications.",
    cv: "Full_CV.pdf",
    email: "costpetrides@icloud.com",
    github: "costpetrides",
    linkedin: "https://www.linkedin.com/in/constantinos-petrides/",
    location: "Cyprus · Athens",
  },

  focusAreas: [
    { label: "Atmospheric Modeling", icon: "☁" },
    { label: "Machine Learning", icon: "◈" },
    { label: "Quantum Computing", icon: "◉" },
  ],

  research: [
    {
      title: "Fairmode WG5: Model bias correction",
      type: "Publication",
      year: "2024",
      summary:
        "Contributed to FAIRMODE working group research on correcting systematic biases in atmospheric chemistry models.",
      url: "https://knowledge4policy.ec.europa.eu/sites/default/files/fairmode/events/5.FAIREMODE_1706_UoA.pdf",
      tags: ["Atmospheric", "Modeling"],
    },
    {
      title: "Air pollution impact during COVID-19 lockdown in Greece",
      type: "Research",
      year: "2023",
      summary:
        "Quantified how nationwide lockdown measures reduced anthropogenic emissions and altered atmospheric pollution levels.",
      url: "https://github.com/costpetrides/Air-pollution-COVID-19-impact",
      tags: ["Atmospheric", "Environmental"],
    },
  ],

  projectFilters: [
    { id: "all", label: "All" },
    { id: "atmospheric", label: "Atmospheric Modeling" },
    { id: "ml", label: "Machine Learning" },
    { id: "quantum", label: "Quantum Computing" },
  ],

  projects: [
    {
      slug: "Quantum-Classical-Navier-Stokes",
      title: "Hybrid Quantum–Classical Navier–Stokes Solver",
      category: "quantum",
      featured: true,
      tags: ["Quantum", "CFD", "Python"],
    },
    {
      slug: "Fluid-Dynamics-Navier-Stokes",
      title: "2D Shallow Water & Navier–Stokes Simulations",
      category: "fluid",
      featured: true,
      tags: ["CFD", "Numerical Methods"],
    },
    {
      slug: "Temperature_Forecasting_MethodComparison",
      title: "Meteorological Time Series Forecasting",
      category: "ml",
      featured: true,
      tags: ["LSTM", "Prophet", "Time Series"],
    },
    {
      slug: "NOx-Ozone-Relationship-Modeling-with-ML",
      title: "NOx–Ozone Relationship Modeling with ML",
      category: "ml",
      featured: true,
      tags: ["Machine Learning", "Atmospheric Chemistry"],
    },
    {
      slug: "Air-pollution-COVID-19-impact",
      title: "COVID-19 Lockdown Air Pollution Impact",
      category: "atmospheric",
      featured: false,
      tags: ["Environmental", "Emissions"],
    },
    {
      slug: "Computational-Physics",
      title: "Computational Physics Course Codes",
      category: "computational",
      featured: false,
      tags: ["NKUA", "Numerical Methods", "Python"],
    },
    {
      slug: "UCASS-Intercomparison",
      title: "UCASS Sensor Intercomparison",
      category: "atmospheric",
      featured: false,
      tags: ["UAV Sensors", "Field Campaign"],
    },
    {
      repo: "theofil/dscout",
      title: "CMS 40 MHz Scouting Data Analysis (2018)",
      category: "particle",
      featured: false,
      tags: ["Particle Physics", "CMS", "C++"],
      external: true,
    },
  ],

  gallery: [
    {
      src: "LSTM.png",
      alt: "LSTM temperature forecasting visualization",
      caption: "Temperature forecasting with deep learning models",
      topic: "Machine Learning",
      url: "https://github.com/costpetrides/Temperature_Forecasting_MethodComparison",
    },
    {
      src: "hta_1.gif",
      alt: "Fluid dynamics simulation animation",
      caption: "Shallow water equation simulation",
      topic: "Fluid Dynamics",
      url: "https://github.com/costpetrides/Fluid-Dynamics-Navier-Stokes/blob/main/Simulations.ipynb",
    },
    {
      src: "classical.png",
      alt: "Classical Navier-Stokes solver output",
      caption: "Classical Navier–Stokes solver",
      topic: "Quantum CFD",
      url: "https://github.com/costpetrides/Quantum-Classical-Navier-Stokes/blob/main/Classical.ipynb",
    },
    {
      src: "velocity.gif",
      alt: "2D flow around cylinder simulation",
      caption: "2D flow around a cylinder",
      topic: "Fluid Dynamics",
      url: "https://github.com/costpetrides/Fluid-Dynamics-Navier-Stokes/blob/main/2D-Flow-Cylinder.ipynb",
    },
    {
      src: "Forcing.gif",
      alt: "Navier-Stokes forcing simulation",
      caption: "Forced Navier–Stokes turbulence",
      topic: "Turbulence",
      url: "https://github.com/costpetrides/Fluid-Dynamics-Navier-Stokes/blob/main/Navier-Stokes-Simulation.ipynb",
    },
    {
      src: "KHI.gif",
      alt: "Kelvin-Helmholtz instability simulation",
      caption: "Kelvin–Helmholtz instability",
      topic: "Instability",
      url: "https://github.com/costpetrides/Fluid-Dynamics-Navier-Stokes/blob/main/Kelvin%E2%80%93Helmholtz-Instability.ipynb",
    },
  ],
};

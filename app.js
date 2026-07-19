/* -----------------------------------------
   PHYSOC IIT KHARAGPUR - APPLICATION CONTROLLER
----------------------------------------- */

// Ensure all features initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initNavigation();
  initTheme();
  initCalendar();
  initAnnouncements();
  initEventCountdown();
  initPuzzle();
  initContactForm();
  initSmoothScrolling();
  initWhatsappAuth();
});

/* =========================================================================
   1. BACKGROUND PARTICLES SYSTEM
   ========================================================================= */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 25000));
  
  class CosmicParticle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 0.5;
      this.color = Math.random() > 0.5 ? "rgba(0, 242, 254, 0.15)" : "rgba(167, 139, 250, 0.12)";
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Generate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new CosmicParticle());
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines if particles are close
    ctx.strokeStyle = document.body.classList.contains("dark-theme")
      ? "rgba(0, 242, 254, 0.03)"
      : "rgba(0, 114, 255, 0.03)";
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  // Handle window resizing
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  animate();
}

/* =========================================================================
   2. TABS & MULTIPAGE NAVIGATION
   ========================================================================= */
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const subNavLinks = document.querySelectorAll(".sub-nav-link");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const resourcesLink = document.querySelector('[data-tab="resources"]');
  const submenuParent = resourcesLink ? resourcesLink.parentElement : null;
  const subtabButtons = document.querySelectorAll(".subtab-btn");
  const subtabPanes = document.querySelectorAll(".subtab-pane");

  window.switchTab = function(tabId) {
    // 1. Update side nav links
    navLinks.forEach(link => {
      if (link.getAttribute("data-tab") === tabId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // 2. Hide all tab panels, show active one
    tabPanels.forEach(panel => {
      if (panel.id === `${tabId}-tab`) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });

    // 3. Special handling for sidebar submenu visual states
    if (tabId === "resources") {
      if (submenuParent) submenuParent.classList.add("open");
    } else {
      if (submenuParent && !Array.from(subNavLinks).some(link => link.classList.contains("active"))) {
        submenuParent.classList.remove("open");
      }
    }
  };

  // Nav link click handler
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const tabId = link.getAttribute("data-tab");
      
      // If it is the resources menu, we also toggle the submenu open state
      if (tabId === "resources") {
        e.preventDefault();
        if (submenuParent) {
          submenuParent.classList.toggle("open");
        }
        switchTab("resources");
      } else {
        switchTab(tabId);
      }
    });
  });

  // Submenu link click handler
  subNavLinks.forEach(subLink => {
    subLink.addEventListener("click", (e) => {
      e.stopPropagation();
      const subtabTarget = subLink.getAttribute("data-subtab");

      // Switch main tab to resources
      switchTab("resources");

      // Switch inner resources tab
      switchSubTab(subtabTarget);
    });
  });

  // Switch resources subtab
  function switchSubTab(subtabId) {
    // Update subtab menu buttons styling
    subtabButtons.forEach(btn => {
      if (btn.getAttribute("data-target") === subtabId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update active sub-nav links visual styling
    subNavLinks.forEach(link => {
      if (link.getAttribute("data-subtab") === subtabId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Update resource panes display
    subtabPanes.forEach(pane => {
      if (pane.id === `pane-${subtabId}`) {
        pane.classList.add("active");
      } else {
        pane.classList.remove("active");
      }
    });
  }

  // Connect subtab buttons inside the resources container
  subtabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const subtabId = btn.getAttribute("data-target");
      switchSubTab(subtabId);
    });
  });

  // Check URL Hash on Load
  const hash = window.location.hash.substring(1);
  if (hash) {
    // Check if it matches a main tab
    const potentialPanel = document.getElementById(`${hash}-tab`);
    if (potentialPanel) {
      switchTab(hash);
    } else {
      // Check if it matches a subtab
      const potentialPane = document.getElementById(`pane-${hash}`);
      if (potentialPane) {
        switchTab("resources");
        switchSubTab(hash);
      }
    }
  }

  // Copy email template helper
  window.copyEmailTemplate = function() {
    const template = document.getElementById("email-template").innerText;
    navigator.clipboard.writeText(template).then(() => {
      const copyBtn = document.querySelector(".copy-btn");
      copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
      setTimeout(() => {
        copyBtn.innerHTML = `<i class="fa-solid fa-copy"></i> Copy`;
      }, 2000);
    });
  };
}

/* =========================================================================
   3. DARK / LIGHT THEME TOGGLE
   ========================================================================= */
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  let currentTheme = "dark";
  try {
    currentTheme = localStorage.getItem("theme") || "dark";
  } catch (e) {}
  
  if (currentTheme === "light") {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
  } else {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
  }

  themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("dark-theme")) {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
      try {
        localStorage.setItem("theme", "light");
      } catch (e) {}
    } else {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
      try {
        localStorage.setItem("theme", "dark");
      } catch (e) {}
    }
  });
}

/* =========================================================================
   4. EVENTS CALENDAR WIDGET
   ========================================================================= */
function initCalendar() {
  const monthYearLabel = document.getElementById("calendar-month-year");
  const daysContainer = document.getElementById("calendar-days-container");
  const eventDisplay = document.getElementById("event-display");
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");

  if (!daysContainer) return;

  // We pin the demo date to July 2026 for consistent events presentation
  let currentMonth = 6; // July (0-indexed)
  let currentYear = 2026;

  // Mock Events Database
  const events = {
    "2026-6-4": {
      title: "PhySoc General Body Meeting",
      time: "July 04, 2026 | 5:30 PM",
      desc: "Welcome session for new members, introduction to the Working Committee, and outlining the year's activity calendar. Tea and samosas provided!"
    },
    "2026-6-12": {
      title: "Guest Session: Concept of Physics",
      time: "July 12, 2026 | 4:00 PM",
      desc: "Interactive lecture on developing physical intuition and conceptual problem-solving, followed by an open Q&A session with invited educators."
    },
    "2026-6-18": {
      title: "Telescope Sky Gazing Night",
      time: "July 18, 2026 | 9:00 PM",
      desc: "Observe Saturn's rings, Jupiter's moons, and deep-sky nebulae using our 8-inch Schmidt-Cassegrain telescope. Location: Roof of Main Building (Department of Physics)."
    },
    "2026-6-25": {
      title: "2nd Year Executive Selections",
      time: "July 25, 2026 | 10:00 AM",
      desc: "Annual selection rounds for inducting sophomore student executives into the PhySoc Working Committee. Location: Physics Department Seminar Room."
    },
    "2026-6-26": {
      title: "PhySoc Physics Quiz Bowl",
      time: "July 26, 2026 | 2:30 PM",
      desc: "Assemble teams of 3 and test your knowledge across Thermodynamics, Special Relativity, Quantum Paradoxes, and historical physics trivia. Cash prizes for winners!"
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function renderCalendar(month, year) {
    daysContainer.innerHTML = "";
    monthYearLabel.innerText = `${months[month]} ${year}`;

    // Get first day of the month
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Get total days in month
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Fill empty spots for alignment
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyDiv = document.createElement("div");
      emptyDiv.classList.add("cal-day", "empty");
      daysContainer.appendChild(emptyDiv);
    }

    // Render month days
    for (let day = 1; day <= totalDays; day++) {
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("cal-day");
      dayDiv.innerText = day;

      const dateKey = `${year}-${month}-${day}`;
      
      // If today matches current date (useful if viewing current real-time today)
      const today = new Date();
      if (today.getDate() === day && today.getMonth() === month && today.getFullYear() === year) {
        dayDiv.classList.add("today");
      }

      // Check for events
      if (events[dateKey]) {
        dayDiv.classList.add("has-event");
        
        dayDiv.addEventListener("click", () => {
          // Clear active event classes
          document.querySelectorAll(".cal-day").forEach(d => d.classList.remove("active-event"));
          dayDiv.classList.add("active-event");
          
          // Display event detail
          const ev = events[dateKey];
          eventDisplay.innerHTML = `
            <span class="event-time"><i class="fa-solid fa-clock"></i> ${ev.time}</span>
            <h5>${ev.title}</h5>
            <p>${ev.desc}</p>
          `;
        });
      } else {
        dayDiv.addEventListener("click", () => {
          document.querySelectorAll(".cal-day").forEach(d => d.classList.remove("active-event"));
          eventDisplay.innerHTML = `<p class="no-event-selected">No events scheduled for this day.</p>`;
        });
      }

      daysContainer.appendChild(dayDiv);
    }
  }

  // Pre-select first event on loading
  function selectDefaultEvent() {
    setTimeout(() => {
      const firstEventDay = document.querySelector(".cal-day.has-event");
      if (firstEventDay) {
        firstEventDay.click();
      }
    }, 100);
  }

  prevBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });

  nextBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });

  renderCalendar(currentMonth, currentYear);
  selectDefaultEvent();
}

/* =========================================================================
   5. ANNOUNCEMENTS DYNAMIC FEED & FILTERING
   ========================================================================= */
function initAnnouncements() {
  const container = document.getElementById("announcements-container");
  const searchInput = document.getElementById("search-input");
  const searchWrapper = document.getElementById("search-wrapper");
  const searchTrigger = document.getElementById("search-trigger");
  const filterBtns = document.querySelectorAll(".filter-btn");

  if (!container) return;

  const list = [
    {
      title: "2nd Year Executive Selections",
      date: "July 25, 2026",
      tag: "events",
      desc: "Selections for 2nd year student executives will be held next to next Saturday (July 25, 2026) in the Physics Department Seminar Room. Prepare a brief statement of purpose regarding your interest in coordinates, tech, or resource roles."
    },
    {
      title: "Course PH Wiki Resources Launched",
      date: "July 12, 2026",
      tag: "academic",
      desc: "Student resource wikis have been updated. We have mapped all semester syllabi, standard textbooks, and lab guides from the kgp-phy24 course database. Check the Handbook tab!"
    },
    {
      title: "UROP Project Opportunities",
      date: "June 28, 2026",
      tag: "research",
      desc: "String theory and quantum condensed matter groups at the department are taking project students for the upcoming term. Use our resource template to contact professors."
    }
  ];

  let currentFilter = "all";
  let searchQuery = "";

  // Dynamic search input display handling
  if (searchTrigger && searchWrapper && searchInput) {
    searchTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      searchWrapper.classList.toggle("active");
      if (searchWrapper.classList.contains("active")) {
        searchInput.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (!searchWrapper.contains(e.target)) {
        searchWrapper.classList.remove("active");
      }
    });

    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderFeed();
    });
  }

  function renderFeed() {
    container.innerHTML = "";
    
    const filtered = list.filter(item => {
      const matchesFilter = currentFilter === "all" || item.tag === currentFilter;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery) || item.desc.toLowerCase().includes(searchQuery);
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="no-event-selected" style="padding: 40px; text-align: center;">No matching announcements found.</div>`;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("announcement-card");
      card.innerHTML = `
        <div class="announcement-meta">
          <span class="a-tag tag-${item.tag}">${item.tag}</span>
          <span class="a-date">${item.date}</span>
        </div>
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
      `;
      container.appendChild(card);
    });
  }

  // Filter click controls
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      renderFeed();
    });
  });

  renderFeed();
}

/* =========================================================================
   6. EVENT COUNTDOWN TIMER
   ========================================================================= */
function initEventCountdown() {
  const dSpan = document.getElementById("timer-days");
  const hSpan = document.getElementById("timer-hours");
  const mSpan = document.getElementById("timer-mins");

  if (!dSpan) return;

  // Calculate next-to-next Saturday programmatically
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
  let daysToTarget = 6 - dayOfWeek;
  if (daysToTarget <= 0) {
    daysToTarget += 7;
  }
  daysToTarget += 7; // Add another week for "next to next" weekend

  const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysToTarget, 10, 0, 0, 0);

  // Update labels on HTML
  const eventTimeLabel = document.getElementById("next-event-time");
  if (eventTimeLabel) {
    const options = { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    eventTimeLabel.innerText = targetDate.toLocaleDateString('en-US', options);
  }

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      dSpan.innerText = "00";
      hSpan.innerText = "00";
      mSpan.innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    dSpan.innerText = days.toString().padStart(2, "0");
    hSpan.innerText = hours.toString().padStart(2, "0");
    mSpan.innerText = minutes.toString().padStart(2, "0");
  }

  setInterval(updateTimer, 1000);
  updateTimer();
}

/* =========================================================================
   7. WEEKLY PUZZLE VALIDATION
   ========================================================================= */
function initPuzzle() {
  const form = document.getElementById("puzzle-form");
  const feedback = document.getElementById("puzzle-feedback");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = form.querySelector('input[name="puzzle-ans"]:checked');

    if (!selected) {
      feedback.className = "puzzle-feedback error";
      feedback.innerText = "Please select an option first.";
      return;
    }

    if (selected.value === "gluon") {
      feedback.className = "puzzle-feedback success";
      feedback.innerText = "Correct! Gluons are the gauge bosons of QCD.";
      
      // Store that it was solved
      try {
        localStorage.setItem("puzzleSolved", "true");
      } catch (e) {}
    } else {
      feedback.className = "puzzle-feedback error";
      feedback.innerText = "Incorrect. Think about color charge interactions.";
    }
  });
}

/* =========================================================================
   8. PHYSICS INTERACTIVE SANDBOX
   ========================================================================= */
function initPhysicsSandbox() {
  const canvas = document.getElementById("sandbox-canvas");
  const controlsToggles = document.querySelectorAll(".sandbox-tab-btn");
  const orbitControls = document.getElementById("orbit-controls");
  const pendulumControls = document.getElementById("double-pendulum-controls");
  const instructions = document.getElementById("sim-instructions");

  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let simType = "orbit"; // "orbit" or "double-pendulum"
  let animationId = null;

  // Toggle Simulations
  controlsToggles.forEach(btn => {
    btn.addEventListener("click", () => {
      controlsToggles.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      simType = btn.getAttribute("data-simulation");

      if (simType === "orbit") {
        orbitControls.style.display = "block";
        pendulumControls.style.display = "none";
        instructions.innerText = "Click on canvas to launch orbits around the central gravity star.";
      } else {
        orbitControls.style.display = "none";
        pendulumControls.style.display = "block";
        instructions.innerText = "Drag the pendulum bobs to set initial positions and press start.";
      }
      
      resetSimulation();
    });
  });

  /* -----------------------------------------
     GRAVITY ORBIT SIMULATION LOGIC
  ----------------------------------------- */
  let G = 0.8;
  let M = 2000;
  let showOrbitTraces = true;
  let planets = [];
  const star = { x: canvas.width / 2, y: canvas.height / 2, radius: 15, mass: M };
  
  // Drag launcher variables
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let dragEnd = { x: 0, y: 0 };

  const massSlider = document.getElementById("orbit-mass");
  const gravitySlider = document.getElementById("orbit-gravity");
  const tracesCheckbox = document.getElementById("show-traces");
  const clearOrbitsBtn = document.getElementById("clear-orbits");
  const resetOrbitsBtn = document.getElementById("reset-orbits");

  // Set control listeners
  if (massSlider) {
    massSlider.addEventListener("input", (e) => {
      star.mass = M = parseFloat(e.target.value);
      star.radius = 8 + M / 250;
      document.getElementById("orbit-mass-val").innerText = M;
    });
  }
  if (gravitySlider) {
    gravitySlider.addEventListener("input", (e) => {
      G = parseFloat(e.target.value);
      document.getElementById("orbit-gravity-val").innerText = G;
    });
  }
  if (tracesCheckbox) {
    tracesCheckbox.addEventListener("change", (e) => {
      showOrbitTraces = e.target.checked;
    });
  }
  if (clearOrbitsBtn) {
    clearOrbitsBtn.addEventListener("click", () => { planets = []; });
  }
  if (resetOrbitsBtn) {
    resetOrbitsBtn.addEventListener("click", () => {
      planets = [];
      star.mass = M = 2000;
      star.radius = 15;
      G = 0.8;
      if (massSlider) massSlider.value = 2000;
      if (gravitySlider) gravitySlider.value = 0.8;
      document.getElementById("orbit-mass-val").innerText = 2000;
      document.getElementById("orbit-gravity-val").innerText = 0.8;
    });
  }

  // Mouse drag handlers for Orbit launch and Double Pendulum bob dragging
  let isDraggingBob = 0; // 0 = none, 1 = Bob 1, 2 = Bob 2

  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (simType === "orbit") {
      dragStart.x = mx;
      dragStart.y = my;
      dragEnd.x = mx;
      dragEnd.y = my;
      isDragging = true;
    } else {
      // Find current position of Bob 1 and Bob 2
      const cx = canvas.width / 2;
      const cy = 120;
      const x1 = cx + r1 * Math.sin(a1);
      const y1 = cy + r1 * Math.cos(a1);
      const x2 = x1 + r2 * Math.sin(a2);
      const y2 = y1 + r2 * Math.cos(a2);

      const d1 = Math.hypot(mx - x1, my - y1);
      const d2 = Math.hypot(mx - x2, my - y2);

      if (d2 < m2 * 1.5) {
        isDraggingBob = 2;
      } else if (d1 < m1 * 1.5) {
        isDraggingBob = 1;
      }
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (simType === "orbit") {
      if (!isDragging) return;
      dragEnd.x = mx;
      dragEnd.y = my;
    } else {
      if (isDraggingBob === 0) return;
      const cx = canvas.width / 2;
      const cy = 120;

      if (isDraggingBob === 1) {
        a1 = Math.atan2(mx - cx, my - cy);
        a1_v = 0;
      } else if (isDraggingBob === 2) {
        const x1 = cx + r1 * Math.sin(a1);
        const y1 = cy + r1 * Math.cos(a1);
        a2 = Math.atan2(mx - x1, my - y1);
        a2_v = 0;
      }
      pendulumTrace = [];
    }
  });

  canvas.addEventListener("mouseup", () => {
    if (simType === "orbit") {
      if (!isDragging) return;
      isDragging = false;
      
      // Launch vector: opposite direction to pull
      const vx = (dragStart.x - dragEnd.x) * 0.08;
      const vy = (dragStart.y - dragEnd.y) * 0.08;

      planets.push({
        x: dragStart.x,
        y: dragStart.y,
        vx: vx,
        vy: vy,
        radius: Math.random() * 4 + 3,
        color: `hsl(${Math.random() * 360}, 90%, 65%)`,
        trace: []
      });
    } else {
      isDraggingBob = 0;
    }
  });

  canvas.addEventListener("mouseleave", () => {
    isDragging = false;
    isDraggingBob = 0;
  });

  function updateOrbits() {
    planets.forEach((planet, index) => {
      const dx = star.x - planet.x;
      const dy = star.y - planet.y;
      const dist = Math.hypot(dx, dy);

      // Collision check with central star
      if (dist < star.radius + planet.radius) {
        planets.splice(index, 1);
        // Little pulse animation trigger helper
        star.radius += 0.5;
        setTimeout(() => { star.radius -= 0.5; }, 150);
        return;
      }

      // Gravitational acceleration calculation
      // Force = G * M1 * M2 / r^2
      // Acceleration a = G * M / r^2
      const forceStrength = (G * M) / (dist * dist);
      const ax = (dx / dist) * forceStrength;
      const ay = (dy / dist) * forceStrength;

      planet.vx += ax;
      planet.vy += ay;
      planet.x += planet.vx;
      planet.y += planet.vy;

      // Track trace lines
      if (showOrbitTraces) {
        planet.trace.push({ x: planet.x, y: planet.y });
        if (planet.trace.length > 100) planet.trace.shift();
      } else {
        planet.trace = [];
      }
    });
  }

  function drawOrbits() {
    // Draw Star
    const grad = ctx.createRadialGradient(star.x, star.y, 2, star.x, star.y, star.radius);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.2, "#ffe259");
    grad.addColorStop(1, "rgba(255, 167, 81, 0)");
    
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffe259";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ffa751";
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow

    // Draw Planets
    planets.forEach(p => {
      // Trace
      if (p.trace.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trace[0].x, p.trace[0].y);
        for (let i = 1; i < p.trace.length; i++) {
          ctx.lineTo(p.trace[i].x, p.trace[i].y);
        }
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      // Planet sphere
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw drag vector line
    if (isDragging) {
      ctx.beginPath();
      ctx.moveTo(dragStart.x, dragStart.y);
      ctx.lineTo(dragEnd.x, dragEnd.y);
      ctx.strokeStyle = "rgba(0, 242, 254, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw projected target direction dot
      const vx = (dragStart.x - dragEnd.x) * 0.08;
      const vy = (dragStart.y - dragEnd.y) * 0.08;
      ctx.beginPath();
      ctx.arc(dragStart.x + vx * 20, dragStart.y + vy * 20, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#00f2fe";
      ctx.fill();
    }
  }


  /* -----------------------------------------
     DOUBLE PENDULUM SIMULATION LOGIC
  ----------------------------------------- */
  // Pendulum variables (using standard Lagrangian double pendulum physics model)
  let r1 = 100;
  let r2 = 100;
  let m1 = 15;
  let m2 = 15;
  let a1 = Math.PI / 2; // initial angle 90 deg
  let a2 = Math.PI / 2; // initial angle 90 deg
  let a1_v = 0; // angular velocity
  let a2_v = 0; // angular velocity
  const g = 0.2; // gravity constant
  let damping = 0.0005;
  let showChaos = true;
  let pendulumTrace = [];

  const lenSlider = document.getElementById("pendulum-len");
  const pMassSlider = document.getElementById("pendulum-mass");
  const dampingSlider = document.getElementById("pendulum-damping");
  const chaosCheckbox = document.getElementById("show-chaos-trace");
  const clearTracesBtn = document.getElementById("clear-traces");
  const resetPendulumBtn = document.getElementById("reset-pendulum");

  if (lenSlider) {
    lenSlider.addEventListener("input", (e) => {
      r1 = r2 = parseFloat(e.target.value);
      document.getElementById("pendulum-len-val").innerText = `${r1}px`;
    });
  }
  if (pMassSlider) {
    pMassSlider.addEventListener("input", (e) => {
      m1 = m2 = parseFloat(e.target.value);
      document.getElementById("pendulum-mass-val").innerText = `${m1}kg`;
    });
  }
  if (dampingSlider) {
    dampingSlider.addEventListener("input", (e) => {
      damping = parseFloat(e.target.value);
      document.getElementById("pendulum-damping-val").innerText = damping;
    });
  }
  if (chaosCheckbox) {
    chaosCheckbox.addEventListener("change", (e) => {
      showChaos = e.target.checked;
    });
  }
  if (clearTracesBtn) {
    clearTracesBtn.addEventListener("click", () => { pendulumTrace = []; });
  }
  if (resetPendulumBtn) {
    resetPendulumBtn.addEventListener("click", () => {
      a1 = Math.PI / 2 + (Math.random() - 0.5) * 0.2;
      a2 = Math.PI / 2 + (Math.random() - 0.5) * 0.2;
      a1_v = 0;
      a2_v = 0;
      pendulumTrace = [];
    });
  }

  function updatePendulum() {
    // Lagrangian acceleration formulas for double pendulum
    // Equation 1:
    const num1 = -g * (2 * m1 + m2) * Math.sin(a1) - m2 * g * Math.sin(a1 - 2 * a2) - 2 * Math.sin(a1 - a2) * m2 * (a2_v * a2_v * r2 + a1_v * a1_v * r1 * Math.cos(a1 - a2));
    const den1 = r1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    const a1_a = num1 / den1; // Angular Acceleration 1

    // Equation 2:
    const num2 = 2 * Math.sin(a1 - a2) * (a1_v * a1_v * r1 * (m1 + m2) + g * (m1 + m2) * Math.cos(a1) + a2_v * a2_v * r2 * m2 * Math.cos(a1 - a2));
    const den2 = r2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    const a2_a = num2 / den2; // Angular Acceleration 2

    // Update speeds & positions
    a1_v += a1_a;
    a2_v += a2_a;
    a1 += a1_v;
    a2 += a2_v;

    // Apply damping
    a1_v *= (1 - damping);
    a2_v *= (1 - damping);
  }

  function drawPendulum() {
    const cx = canvas.width / 2;
    const cy = 120; // Pivot point

    // Position of bob 1
    const x1 = cx + r1 * Math.sin(a1);
    const y1 = cy + r1 * Math.cos(a1);

    // Position of bob 2
    const x2 = x1 + r2 * Math.sin(a2);
    const y2 = y1 + r2 * Math.cos(a2);

    // Track chaos paths
    if (showChaos) {
      pendulumTrace.push({ x: x2, y: y2 });
      if (pendulumTrace.length > 250) pendulumTrace.shift();
    } else {
      pendulumTrace = [];
    }

    // Draw trace path
    if (pendulumTrace.length > 1) {
      ctx.beginPath();
      ctx.moveTo(pendulumTrace[0].x, pendulumTrace[0].y);
      for (let i = 1; i < pendulumTrace.length; i++) {
        ctx.lineTo(pendulumTrace[i].x, pendulumTrace[i].y);
      }
      ctx.strokeStyle = "rgba(167, 139, 250, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Rod 1
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = document.body.classList.contains("dark-theme") ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Rod 2
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Pivot center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#94a3b8";
    ctx.fill();

    // Bob 1
    ctx.beginPath();
    ctx.arc(x1, y1, m1 * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = "var(--color-secondary)";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "var(--color-secondary)";
    ctx.fill();
    ctx.shadowBlur = 0;

    // Bob 2
    ctx.beginPath();
    ctx.arc(x2, y2, m2 * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = "var(--color-accent)";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "var(--color-accent)";
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  /* -----------------------------------------
     SIMULATION ENGINE SETUP
  ----------------------------------------- */
  function resetSimulation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    planets = [];
    pendulumTrace = [];
    
    // Set default angles for pendulum reset
    a1 = Math.PI / 2;
    a2 = Math.PI / 2;
    a1_v = 0;
    a2_v = 0;
  }

  function loop() {
    // Clear canvas
    ctx.fillStyle = "#03050a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply gridlines to background of sandbox for laboratory scientific feel
    ctx.strokeStyle = "rgba(255,255,255,0.02)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    if (simType === "orbit") {
      updateOrbits();
      drawOrbits();
    } else {
      if (isDraggingBob === 0) {
        updatePendulum();
      }
      drawPendulum();
    }

    animationId = requestAnimationFrame(loop);
  }

  // Set canvas scale relative to rect coordinates to avoid scaling blur
  function adjustCanvasScale() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    star.x = canvas.width / 2;
    star.y = canvas.height / 2;
  }

  window.addEventListener("resize", adjustCanvasScale);
  adjustCanvasScale();
  
  // Start simulation loop
  loop();
}

/* =========================================================================
   9. CONTACT FORM INTERACTIVITY & MODALS
   ========================================================================= */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const modal = document.getElementById("success-modal");
  
  if (!form || !modal) return;

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const msgInput = document.getElementById("contact-msg");

  // Validate IIT KGP email domain
  function validateEmail(email) {
    // Basic email test
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return false;
    
    // Checks if the email belongs to KGP domain (optional check, but good for IIT KGP specific context)
    return email.endsWith("iitkgp.ac.in") || email.endsWith("kgpian.iitkgp.ac.in");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;

    // Reset validations
    nameInput.classList.remove("invalid");
    emailInput.classList.remove("invalid");
    msgInput.classList.remove("invalid");

    // Validate Name
    if (!nameInput.value.trim()) {
      nameInput.classList.add("invalid");
      isValid = false;
    }

    // Validate Email
    if (!validateEmail(emailInput.value.trim())) {
      emailInput.classList.add("invalid");
      isValid = false;
    }

    // Validate Message
    if (!msgInput.value.trim()) {
      msgInput.classList.add("invalid");
      isValid = false;
    }

    if (!isValid) return;

    // Simulate sending progress
    const submitBtn = document.getElementById("form-submit");
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending... <i class="fa-solid fa-spinner fa-spin"></i>`;

    setTimeout(() => {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // Show success modal
      modal.classList.add("active");
      form.reset();
    }, 1500);
  });

  window.closeModal = function() {
    modal.classList.remove("active");
  };
}

/* =========================================================================
   9. SMOOTH SCROLLING & PARALLAX
   ========================================================================= */
function initSmoothScrolling() {
  // Check if Lenis and GSAP are loaded
  if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') return;

  // Initialize Lenis
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Parallax Effect for Background Image
  const parallaxBg = document.getElementById('parallax-bg');
  if (parallaxBg) {
    // We move the background image upwards slowly as we scroll down
    gsap.to(parallaxBg, {
      yPercent: -15, // Moves up by 15% of its height
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });

    // Fade in after load
    setTimeout(() => {
      parallaxBg.style.opacity = '0.65';
    }, 500);
  }
}

make change here
</#USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-07-19T22:42:00+05:30.
</ADDITIONAL_METADATA>

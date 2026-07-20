/* ========================================================
   PHYSOC IIT KHARAGPUR — SHARED JAVASCRIPT v2.0
   Powered by Anime.js | Premium micro-animations
   ======================================================== */
'use strict';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* -------------------------------------------------------
   THEME TOGGLE
   ------------------------------------------------------- */
function initTheme() {
  const btn = $('#theme-toggle');
  if (!btn) return;

  const saved = localStorage.getItem('physoc-theme') || 'dark';
  document.body.className = saved + '-theme';

  btn.addEventListener('click', () => {
    const next = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
    document.body.className = next + '-theme';
    localStorage.setItem('physoc-theme', next);

    if (window.anime) {
      anime({ targets: btn, rotate: [0, 360], duration: 380, easing: 'easeOutCubic' });
    }
  });
}

/* -------------------------------------------------------
   MOBILE DRAWER
   ------------------------------------------------------- */
function initDrawer() {
  const btn = $('#hamburger-btn');
  const drawer = $('#mobile-drawer');
  const overlay = $('#mobile-overlay');
  const closeBtn = $('#drawer-close');
  if (!btn || !drawer) return;

  const open = () => {
    overlay.style.display = 'block';
    btn.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (window.anime) {
      anime({ targets: overlay, opacity: [0, 1], duration: 280, easing: 'easeOutCubic' });
      anime({ targets: drawer, translateX: ['-100%', '0%'], duration: 340, easing: 'easeOutCubic' });
      anime({
        targets: '#mobile-drawer .drawer-link',
        translateX: [-18, 0],
        opacity: [0, 1],
        delay: anime.stagger(45, { start: 140 }),
        duration: 280,
        easing: 'easeOutCubic'
      });
    } else {
      drawer.style.transform = 'translateX(0)';
    }
  };

  const close = () => {
    btn.classList.remove('open');
    document.body.style.overflow = '';

    if (window.anime) {
      anime({ targets: overlay, opacity: [1, 0], duration: 220, easing: 'easeInCubic', complete: () => { overlay.style.display = 'none'; } });
      anime({ targets: drawer, translateX: ['0%', '-100%'], duration: 280, easing: 'easeInCubic' });
    } else {
      drawer.style.transform = 'translateX(-100%)';
      overlay.style.display = 'none';
    }
  };

  btn.addEventListener('click', open);
  overlay.addEventListener('click', close);
  closeBtn?.addEventListener('click', close);
  $$('#mobile-drawer .drawer-link').forEach(l => l.addEventListener('click', close));
}

/* -------------------------------------------------------
   ACTIVE NAV  — folder-based URL detection
   ------------------------------------------------------- */
function initNav() {
  const parts = window.location.pathname.split('/').filter(p => p && p !== 'index.html');
  // current section: last non-empty, non-index.html segment
  const section = parts[parts.length - 1] || 'root';

  $$('.desktop-nav a, #mobile-drawer .drawer-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    // Normalise: remove leading ../, trailing /, index.html
    const hparts = href.replace(/\/index\.html$/, '').replace(/\/$/, '').split('/').filter(p => p && p !== '..');
    const hsection = hparts[hparts.length - 1] || 'root';
    if (section === hsection) link.classList.add('active');
  });
}

/* -------------------------------------------------------
   PARTICLE CANVAS
   ------------------------------------------------------- */
function initParticles() {
  const canvas = $('#particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const n = Math.min(45, Math.floor((W * H) / 32000));
    particles = Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r: Math.random() * 1.8 + 0.4,
      hue: Math.random() > 0.5 ? '0, 242, 254' : '167, 139, 250'
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.body.classList.contains('dark-theme');
    const lineAlpha = isDark ? 0.028 : 0.04;

    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue}, ${isDark ? 0.18 : 0.12})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const d = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (d < 100) {
          ctx.globalAlpha = (1 - d / 100) * lineAlpha * 8;
          ctx.strokeStyle = `rgb(${p.hue})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    });
    requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize);
  draw();
}

/* -------------------------------------------------------
   PAGE ENTRANCE ANIMATIONS
   ------------------------------------------------------- */
function initPageAnim() {
  if (!window.anime) return;

  // Hero stagger
  const heroEls = $$('.hero-card .section-label, .hero-card h1, .hero-card p, .hero-card .hero-actions');
  if (heroEls.length) {
    anime({
      targets: heroEls,
      translateY: [28, 0],
      opacity: [0, 1],
      delay: anime.stagger(85, { start: 120 }),
      duration: 580,
      easing: 'easeOutCubic'
    });
  }

  // Cards stagger
  const cards = $$('.card');
  if (cards.length) {
    anime({
      targets: cards,
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(65, { start: 180 }),
      duration: 460,
      easing: 'easeOutCubic'
    });
  }

  // Header brand
  anime({
    targets: '.header-brand',
    translateX: [-16, 0],
    opacity: [0, 1],
    duration: 480,
    easing: 'easeOutCubic',
    delay: 60
  });

  // Desktop nav links
  anime({
    targets: '.desktop-nav a',
    translateY: [-8, 0],
    opacity: [0, 1],
    delay: anime.stagger(40, { start: 100 }),
    duration: 300,
    easing: 'easeOutCubic'
  });
}

/* -------------------------------------------------------
   SCROLL-TRIGGERED ANIMATIONS
   ------------------------------------------------------- */
function initScrollAnim() {
  if (!window.anime) return;

  const targets = $$('.ann-card, .officer-card, .game-card, .fellowship-card, .step-card, .anim-fade-up');
  if (!targets.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      anime({
        targets: entry.target,
        translateY: [18, 0],
        opacity: [0, 1],
        duration: 440,
        easing: 'easeOutCubic'
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(el => { el.style.opacity = '0'; obs.observe(el); });

  // Stagger groups
  const groups = {};
  $$('[data-stagger]').forEach(el => {
    const k = el.dataset.stagger;
    if (!groups[k]) groups[k] = [];
    groups[k].push(el);
  });

  Object.values(groups).forEach(group => {
    group.forEach(el => { el.style.opacity = '0'; });
    const go = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        anime({ targets: group, translateY: [18, 0], opacity: [0, 1], delay: anime.stagger(75), duration: 420, easing: 'easeOutCubic' });
        group.forEach(el => go.unobserve(el));
      });
    }, { threshold: 0.1 });
    go.observe(group[0]);
  });
}

/* -------------------------------------------------------
   STAT COUNTERS
   ------------------------------------------------------- */
function initCounters() {
  if (!window.anime) return;
  const nums = $$('.stat-num[data-target]');
  if (!nums.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      anime({
        targets: { val: 0 },
        val: target,
        duration: 1400,
        easing: 'easeOutExpo',
        update(anim) {
          el.innerText = Math.round(anim.animations[0].currentValue) + suffix;
        }
      });
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(el => obs.observe(el));
}

/* -------------------------------------------------------
   COUNTDOWN TIMER
   ------------------------------------------------------- */
function initCountdown() {
  const dEl = $('#timer-days');
  const hEl = $('#timer-hours');
  const mEl = $('#timer-mins');
  if (!dEl) return;

  const now = new Date();
  const nextEvent = new Date(2026, 6, 25, 10, 0, 0);

  const timeEl = $('#next-event-time');
  if (timeEl) {
    timeEl.innerText = nextEvent.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ', 10 AM';
  }

  const tick = () => {
    const diff = nextEvent - Date.now();
    if (diff <= 0) { dEl.innerText = hEl.innerText = mEl.innerText = '00'; return; }
    dEl.innerText = String(Math.floor(diff / 86400000)).padStart(2, '0');
    hEl.innerText = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    mEl.innerText = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  };

  setInterval(tick, 60000);
  tick();
}

/* -------------------------------------------------------
   WEEKLY PHYSICS PUZZLE
   ------------------------------------------------------- */
function initPuzzle() {
  const form = $('#puzzle-form');
  const fb = $('#puzzle-feedback');
  if (!form) return;

  let currentPuzzle = null;
  
  if (typeof supabaseClient !== 'undefined' && supabaseClient) {
    supabaseClient
      .from('physoc-weekly_puzzles')
      .select('*')
      .eq('active', true)
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (data) {
          currentPuzzle = data;
          $('#puzzle-widget').style.display = 'block';
          $('#puzzle-tag').innerText = data.week_label;
          $('#puzzle-question').innerText = data.question;
          
          let optionsHtml = '';
          data.options.forEach((opt, idx) => {
            optionsHtml += `<label class="option-label"><input type="radio" name="puzzle-ans" value="${idx}" /> ${opt}</label>`;
          });
          $('#puzzle-options').innerHTML = optionsHtml;
        }
      });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!currentPuzzle) return;
    
    const sel = form.querySelector('input[name="puzzle-ans"]:checked');

    if (!sel) {
      fb.className = 'puzzle-feedback error';
      fb.innerText = 'Please select an answer first.';
      if (window.anime) anime({ targets: fb, translateX: [0, -5, 5, -3, 3, 0], duration: 280, easing: 'linear' });
      return;
    }

    const selectedIdx = parseInt(sel.value, 10);
    let isCorrect = (selectedIdx === currentPuzzle.correct_answer_index);

    if (isCorrect) {
      fb.className = 'puzzle-feedback success';
      fb.innerText = '✓ Correct! Awesome job.';
    } else {
      fb.className = 'puzzle-feedback error';
      fb.innerText = '✗ Not quite. Keep trying!';
    }
    
    $('#puzzle-submit').disabled = true;

    if (window.anime) {
      anime({ targets: fb, scale: [0.92, 1], opacity: [0, 1], duration: 280, easing: 'easeOutBack' });
    }
    
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
      const fieldToUpdate = isCorrect ? 'correct_count' : 'wrong_count';
      const newValue = isCorrect ? (currentPuzzle.correct_count || 0) + 1 : (currentPuzzle.wrong_count || 0) + 1;
      
      const updateData = {};
      updateData[fieldToUpdate] = newValue;
      
      await supabaseClient
        .from('physoc-weekly_puzzles')
        .update(updateData)
        .eq('id', currentPuzzle.id);
    }
  });
}

/* -------------------------------------------------------
   CALENDAR WIDGET
   ------------------------------------------------------- */
function initCalendar() {
  const monthEl = $('#cal-month-year');
  const daysEl = $('#cal-days');
  const prevBtn = $('#cal-prev');
  const nextBtn = $('#cal-next');
  const eventEl = $('#event-display');
  if (!monthEl) return;

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const EVENTS = {
    '2026-07-25': { title: '2nd Year Executive Selections', desc: 'Physics Dept. Seminar Room · 10 AM' },
    '2026-08-15': { title: 'Independence Day Physics Seminar', desc: 'Open to all · Main Auditorium' },
    '2026-09-06': { title: 'Autumn Fest Science Exhibition', desc: 'Physics stall open · Science Day' }
  };

  let year = new Date().getFullYear();
  let month = new Date().getMonth();

  const render = () => {
    monthEl.innerText = `${MONTHS[month]} ${year}`;
    daysEl.innerHTML = '';
    const first = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < first; i++) {
      const blank = document.createElement('div');
      blank.className = 'cal-day';
      daysEl.appendChild(blank);
    }

    for (let d = 1; d <= total; d++) {
      const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const div = document.createElement('div');
      div.className = 'cal-day';
      div.innerText = d;
      if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) div.classList.add('today');
      if (EVENTS[ds]) {
        div.classList.add('has-event');
        div.addEventListener('click', () => {
          eventEl.innerHTML = `<strong style="color:var(--cyan);display:block;margin-bottom:3px">${EVENTS[ds].title}</strong><span>${EVENTS[ds].desc}</span>`;
          if (window.anime) anime({ targets: eventEl, opacity: [0, 1], translateY: [4, 0], duration: 240, easing: 'easeOutCubic' });
        });
      }
      daysEl.appendChild(div);
    }
  };

  prevBtn?.addEventListener('click', () => { month--; if (month < 0) { month = 11; year--; } render(); });
  nextBtn?.addEventListener('click', () => { month++; if (month > 11) { month = 0; year++; } render(); });
  render();
}

/* -------------------------------------------------------
   SEARCH TOGGLE & FUNCTIONALITY
   ------------------------------------------------------- */
function initSearch() {
  const trigger = $('#search-trigger');
  const wrapper = $('#search-wrapper');
  const input = $('#search-input');
  const resultsEl = $('#search-results');
  if (!trigger || !wrapper || !input || !resultsEl) return;

  const cssLink = document.querySelector('link[href*="shared.css"]');
  const base = cssLink ? cssLink.getAttribute('href').replace('shared.css', '') : './';

  const SEARCH_INDEX = [
    { title: 'Home', url: '', type: 'Page' },
    { title: 'About Us', url: 'about/', type: 'Page' },
    { title: 'Announcements', url: 'announcements/', type: 'Page' },
    { title: 'Resources', url: 'resources/', type: 'Page' },
    { title: 'Officers', url: 'officers/', type: 'Page' },
    { title: 'Sandbox', url: 'sandbox/', type: 'Page' },
    { title: 'Contact Us', url: 'contact/', type: 'Page' },
    { title: 'Bhoomik Modi - President', url: 'officers/', type: 'Officer' },
    { title: 'Wasim - Academic Chair', url: 'officers/', type: 'Chair' },
    { title: 'Neeraj Laikara - Social Chair', url: 'officers/', type: 'Chair' },
    { title: 'Debdut Adhikari - Outreach Chair', url: 'officers/', type: 'Chair' },
    { title: 'Neelabh Priyam Jha - Technical Chair', url: 'officers/', type: 'Chair' },
    { title: 'Sayak Moulic - Technical & Growth Chair', url: 'officers/', type: 'Chair' },
    { title: 'Lab Visit', url: 'announcements/', type: 'Event' }
  ];

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    wrapper.classList.toggle('active');
    if (wrapper.classList.contains('active')) input.focus();
    else { resultsEl.classList.remove('active'); input.value = ''; }
  });

  input.addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      resultsEl.classList.remove('active');
      return;
    }
    const matches = SEARCH_INDEX.filter(item => item.title.toLowerCase().includes(q) || item.type.toLowerCase().includes(q));
    
    if (matches.length > 0) {
      resultsEl.innerHTML = matches.map(m => `
        <a href="${base}${m.url}" class="search-result-item">
          <span class="search-result-type">${m.type}</span>
          ${m.title}
        </a>
      `).join('');
    } else {
      resultsEl.innerHTML = `<div class="search-result-item" style="color:var(--text-muted)">No results found.</div>`;
    }
    resultsEl.classList.add('active');
  });

  document.addEventListener('click', e => {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove('active');
      resultsEl.classList.remove('active');
      input.value = '';
    }
  });
}

/* -------------------------------------------------------
   ANNOUNCEMENTS FEED
   ------------------------------------------------------- */
function initAnnouncements() {
  const container = $('#announcements-container');
  const filterBtns = $$('.filter-btn');
  const searchEl = $('#ann-search');
  if (!container) return;

  // Load admin-published announcements from localStorage
  const adminAnns = JSON.parse(localStorage.getItem('physoc_announcements') || '[]');
  const DATA = adminAnns.map(a => ({
    title: a.title, date: a.event_date || a.date, tag: a.category, desc: a.body || ''
  }));

  let activeFilter = 'all';
  let searchQ = '';

  const render = () => {
    const list = DATA.filter(d => {
      const matchF = activeFilter === 'all' || d.tag === activeFilter;
      const matchS = d.title.toLowerCase().includes(searchQ) || d.desc.toLowerCase().includes(searchQ);
      return matchF && matchS;
    });

    container.innerHTML = list.length === 0
      ? '<p style="color:var(--text-muted);padding:30px;text-align:center;font-size:14px">No announcements posted yet. Check back soon!</p>'
      : '';

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'ann-card';
      card.style.cssText = 'opacity:0';
      card.innerHTML = `
        <div class="ann-meta">
          <span class="tag tag-${item.tag}">${item.tag}</span>
          <span class="ann-date">${item.date}</span>
        </div>
        <h4>${item.title}</h4>
        <p>${item.desc}</p>`;
      container.appendChild(card);
    });

    if (window.anime && list.length) {
      anime({ targets: '.ann-card', translateX: [-14, 0], opacity: [0, 1], delay: anime.stagger(65), duration: 380, easing: 'easeOutCubic' });
    }
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      render();
    });
  });

  searchEl?.addEventListener('input', e => { searchQ = e.target.value.toLowerCase().trim(); render(); });

  render();
}

/* -------------------------------------------------------
   RESOURCES SUBTABS
   ------------------------------------------------------- */
function initResTabs() {
  const tabs = $$('.res-tab');
  const panes = $$('.res-pane');
  if (!tabs.length) return;

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const pane = $(`#pane-${btn.dataset.target}`);
      if (pane) {
        pane.classList.add('active');
        if (window.anime) anime({ targets: pane, opacity: [0, 1], translateY: [8, 0], duration: 280, easing: 'easeOutCubic' });
      }
    });
  });
}

/* -------------------------------------------------------
   DYNAMIC RESOURCES & INTERNSHIPS FROM ADMIN
   ------------------------------------------------------- */
function initDynamicResources() {
  const booksContainer = $('#books-container');
  const coursesContainer = $('#courses-tbody');
  const internshipsContainer = $('#internships-container');

  // Load Custom Admin Resources
  const res = JSON.parse(localStorage.getItem('physoc_resources') || '[]');
  
  if (booksContainer && booksContainer.children.length === 0) {
    const books = res.filter(r => r.category === 'books');
    if (books.length === 0) {
      booksContainer.innerHTML = '<p style="color:var(--text-muted);font-size:13px;grid-column:1/-1;padding:15px;text-align:center">No textbooks uploaded yet. Admin can publish resources anytime.</p>';
    }
  }

  if (coursesContainer && coursesContainer.children.length === 0) {
    const courses = res.filter(r => r.category === 'courses');
    if (courses.length === 0) {
      coursesContainer.innerHTML = '<tr><td colspan="4" style="color:var(--text-muted);font-size:13px;padding:20px;text-align:center">No course notes uploaded yet.</td></tr>';
    }
  }

  res.forEach(r => {
    if (r.category === 'books' && booksContainer) {
      const div = document.createElement('div');
      div.style.cssText = 'background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px;display:flex;gap:16px';
      div.innerHTML = `
        <div style="font-size:32px;flex-shrink:0;opacity:0.8">📑</div>
        <div>
          <h4 style="font-family:var(--font-heading);color:var(--text-bright);margin-bottom:4px;font-size:15px">${r.title}</h4>
          <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px">${r.description || ''}</p>
          <div style="display:flex;gap:8px">
            <a href="${r.link_url}" target="_blank" class="btn btn-primary" style="padding:6px 10px;font-size:11px"><i class="fa-solid fa-link"></i> Open</a>
            ${r.code ? `<span class="tag tag-events" style="font-size:11px">${r.code}</span>` : ''}
            ${r.sem ? `<span class="tag tag-academic" style="font-size:11px">${r.sem}</span>` : ''}
          </div>
        </div>`;
      booksContainer.prepend(div);
    } 
    else if (r.category === 'courses' && coursesContainer) {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
      tr.innerHTML = `
        <td style="padding:12px 16px;color:var(--text-bright);font-weight:600">${r.title}</td>
        <td style="padding:12px 16px;font-family:var(--font-code);font-size:12px;color:var(--cyan)">${r.code || '—'}</td>
        <td style="padding:12px 16px"><span class="tag tag-academic" style="font-size:11px">${r.sem || 'All Semesters'}</span></td>
        <td style="padding:12px 16px"><a href="${r.link_url}" target="_blank" style="color:var(--cyan)"><i class="fa-solid fa-download"></i> Download</a></td>`;
      coursesContainer.prepend(tr);
    }
  });

  // Render Internships & Research Fellowships from Admin
  if (internshipsContainer) {
    const customInternships = JSON.parse(localStorage.getItem('physoc_internships') || '[]');

    if (customInternships.length === 0) {
      internshipsContainer.innerHTML = '<p style="color:var(--text-muted);font-size:13px;grid-column:1/-1;padding:20px;text-align:center">No internships posted yet. New opportunities will appear here once published by officers.</p>';
    } else {
      internshipsContainer.innerHTML = '';
      customInternships.forEach(item => {
        const card = document.createElement('div');
        card.style.cssText = 'background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:12px';
        card.innerHTML = `
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">
            <div>
              <span class="tag tag-research" style="margin-bottom:6px;display:inline-block">Fellowship / Project</span>
              <h4 style="font-family:var(--font-heading);font-size:16px;color:var(--text-bright);margin-bottom:4px;line-height:1.3">${item.title}</h4>
              <span style="font-size:12px;color:var(--cyan);font-weight:500"><i class="fa-solid fa-building-columns"></i> ${item.org}</span>
            </div>
            ${item.deadline ? `<span class="badge" style="background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.25);padding:3px 8px;font-size:10px;border-radius:6px;white-space:nowrap">Deadline: ${item.deadline}</span>` : ''}
          </div>
          <p style="font-size:12px;color:var(--text-muted);line-height:1.6;margin:0">${item.desc || ''}</p>
          <div style="display:flex;flex-wrap:wrap;gap:12px;font-size:12px;color:var(--text-muted);background:rgba(0,0,0,0.2);padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.04)">
            <div><strong>Stipend:</strong> ${item.stipend || 'Specified upon selection'}</div>
            <div><strong>Eligibility:</strong> ${item.eligibility || 'Physics Undergraduates'}</div>
          </div>
          <div style="margin-top:4px">
            <a href="${item.link_url}" target="_blank" class="btn btn-primary" style="padding:7px 14px;font-size:12px;display:inline-flex;align-items:center;gap:6px">
              <i class="fa-solid fa-paper-plane"></i> Apply / Learn More
            </a>
          </div>`;
        internshipsContainer.appendChild(card);
      });
    }
  }
}

/* -------------------------------------------------------
   COPY EMAIL TEMPLATE
   ------------------------------------------------------- */
function initCopyBtn() {
  const btns = document.querySelectorAll('.copy-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      navigator.clipboard.writeText(targetEl.innerText).then(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        btn.style.background = 'var(--success)';
        btn.style.color = '#fff';
        setTimeout(() => { 
          btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy'; 
          btn.style.background = 'var(--surface)'; 
          btn.style.color = ''; 
        }, 2200);
      });
    });
  });
}

/* -------------------------------------------------------
   CONTACT FORM
   ------------------------------------------------------- */
function initContact() {
  const form = $('#contact-form');
  const modal = $('#success-modal');
  if (!form) return;

  const nameIn = $('#contact-name');
  const emailIn = $('#contact-email');
  const msgIn = $('#contact-msg');

  const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) &&
    (v.endsWith('iitkgp.ac.in') || v.endsWith('kgpian.iitkgp.ac.in'));

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    [nameIn, emailIn, msgIn].forEach(el => el.classList.remove('invalid'));

    if (!nameIn.value.trim()) { nameIn.classList.add('invalid'); ok = false; }
    if (!isValidEmail(emailIn.value.trim())) { emailIn.classList.add('invalid'); ok = false; }
    if (!msgIn.value.trim()) { msgIn.classList.add('invalid'); ok = false; }

    if (!ok) {
      if (window.anime) {
        anime({ targets: '.form-group input.invalid, .form-group textarea.invalid', translateX: [0, -5, 5, -3, 3, 0], duration: 280, easing: 'linear' });
      }
      return;
    }

    // ── SAVE to localStorage (admin panel reads this) ──────────
    const submission = {
      name:    nameIn.value.trim(),
      email:   emailIn.value.trim(),
      year:    $('#contact-year')?.value.trim() || '',
      subject: $('#contact-subject')?.value.trim() || '',
      message: msgIn.value.trim(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    const existing = JSON.parse(localStorage.getItem('physoc_contact_submissions') || '[]');
    existing.push(submission);
    localStorage.setItem('physoc_contact_submissions', JSON.stringify(existing));
    // ── END SAVE ───────────────────────────────────────────────

    const submitBtn = $('#form-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending… <i class="fa-solid fa-spinner fa-spin"></i>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
      form.reset();
      if (modal) {
        modal.classList.add('active');
        if (window.anime) anime({ targets: '.modal-card', scale: [0.88, 1], opacity: [0, 1], duration: 380, easing: 'easeOutBack' });
      }
    }, 1600);
  });

  window.closeModal = () => modal?.classList.remove('active');
}

/* -------------------------------------------------------
   SAND BOX MINI CANVAS PREVIEWS
   ------------------------------------------------------- */
function initSandboxPreviews() {
  // Orbit preview mini-canvas
  const orbitCanvas = $('#mini-orbit');
  if (orbitCanvas) {
    const ctx = orbitCanvas.getContext('2d');
    let t = 0;
    orbitCanvas.width = orbitCanvas.offsetWidth;
    orbitCanvas.height = orbitCanvas.offsetHeight;
    const W = orbitCanvas.width, H = orbitCanvas.height;
    const cx = W / 2, cy = H / 2;
    const trail = [];

    const drawOrbit = () => {
      ctx.fillStyle = 'rgba(3, 8, 17, 0.3)';
      ctx.fillRect(0, 0, W, H);

      // Central star
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      const sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 12);
      sg.addColorStop(0, '#ffe259');
      sg.addColorStop(1, 'rgba(255,226,89,0)');
      ctx.fillStyle = sg;
      ctx.fill();

      // Planet
      const rx = 60, ry = 35;
      const px = cx + rx * Math.cos(t);
      const py = cy + ry * Math.sin(t);
      trail.push({ x: px, y: py });
      if (trail.length > 60) trail.shift();

      // Trail
      trail.forEach((pt, i) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 254, ${i / trail.length * 0.35})`;
        ctx.fill();
      });

      // Planet dot
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      const pg = ctx.createRadialGradient(px, py, 0, px, py, 8);
      pg.addColorStop(0, '#00f2fe');
      pg.addColorStop(1, 'rgba(0,242,254,0)');
      ctx.fillStyle = pg;
      ctx.fill();

      t += 0.022;
      requestAnimationFrame(drawOrbit);
    };
    drawOrbit();
  }

  // Pendulum preview mini-canvas
  const pendCanvas = $('#mini-pendulum');
  if (pendCanvas) {
    const ctx = pendCanvas.getContext('2d');
    pendCanvas.width = pendCanvas.offsetWidth;
    pendCanvas.height = pendCanvas.offsetHeight;
    const W = pendCanvas.width, H = pendCanvas.height;

    let a1 = Math.PI / 2.2, a2 = Math.PI / 1.9;
    let v1 = 0, v2 = 0;
    const m1 = 10, m2 = 10, L1 = 55, L2 = 45, g = 9.8;
    const trail = [];

    const drawPend = () => {
      ctx.fillStyle = 'rgba(3, 8, 17, 0.3)';
      ctx.fillRect(0, 0, W, H);

      const dt = 0.045;
      const num1 = -g * (2 * m1 + m2) * Math.sin(a1) - m2 * g * Math.sin(a1 - 2 * a2) - 2 * Math.sin(a1 - a2) * m2 * (v2 * v2 * L2 + v1 * v1 * L1 * Math.cos(a1 - a2));
      const den1 = L1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
      const num2 = 2 * Math.sin(a1 - a2) * (v1 * v1 * L1 * (m1 + m2) + g * (m1 + m2) * Math.cos(a1) + v2 * v2 * L2 * m2 * Math.cos(a1 - a2));
      const den2 = L2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));

      v1 += dt * num1 / den1;
      v2 += dt * num2 / den2;
      a1 += v1; a2 += v2;

      const ox = W / 2, oy = H / 2 - 20;
      const x1 = ox + L1 * Math.sin(a1);
      const y1 = oy + L1 * Math.cos(a1);
      const x2 = x1 + L2 * Math.sin(a2);
      const y2 = y1 + L2 * Math.cos(a2);

      trail.push({ x: x2, y: y2 });
      if (trail.length > 80) trail.shift();

      trail.forEach((pt, i) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${i / trail.length * 0.5})`;
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();

      [{ x: x1, y: y1, c: '#00f2fe' }, { x: x2, y: y2, c: '#a78bfa' }].forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = b.c;
        ctx.fill();
      });

      requestAnimationFrame(drawPend);
    };
    drawPend();
  }
}

/* -------------------------------------------------------
   INIT ALL
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDrawer();
  initNav();
  initParticles();
  initPageAnim();
  initScrollAnim();
  initCounters();
  initCountdown();
  initPuzzle();
  initCalendar();
  initSearch();
  initAnnouncements();
  initResTabs();
  initDynamicResources();
  initCopyBtn();
  initContact();
  initSandboxPreviews();
  initSmoothScrolling();
  initWhatsappAuth();
});

/* -------------------------------------------------------
   WHATSAPP ACCESS IDENTITY VERIFICATION & NETWORK AUTH
   ------------------------------------------------------- */
function initWhatsappAuth() {
  const modal = document.getElementById("whatsapp-modal");
  if (!modal) return;

  const stepDetecting = document.getElementById("wa-step-detecting");
  const stepSuccess = document.getElementById("wa-step-success");
  const stepManual = document.getElementById("wa-step-manual");
  const networkNameLabel = document.getElementById("wa-network-name");
  const progressBar = document.getElementById("wa-progress-bar");
  
  const authForm = document.getElementById("whatsapp-auth-form");
  const instSelect = document.getElementById("wa-institute");
  const rollInput = document.getElementById("wa-roll");
  const emailInput = document.getElementById("wa-email");
  const rollError = document.getElementById("wa-roll-error");
  const emailError = document.getElementById("wa-email-error");

  const WHATSAPP_URL = "https://wa.me/919887078617?text=Hi%20Neeraj%2C%20I%27m%20very%20interested%20to%20join%20PhySoc.%20I%20got%20your%20number%20from%20the%20website.";

  // Recognized Department Codes per Institute
  const KGP_DEPTS = ["AE","AG","AR","AT","BT","CD","CE","CH","CL","CS","CY","EC","EE","ET","EX","GG","HS","IE","IM","IP","IT","MA","ME","MF","MI","MN","MT","NA","NT","OE","PH","QD","RE","RT","RX","TS","WM"];
  const MADRAS_DEPTS = ["AE","AM","BT","CH","CE","CS","CY","ED","EE","HS","MA","ME","MM","OE","PH"];
  const DELHI_DEPTS = ["AM","BB","CE","CH","CS","CY","EE","ES","HS","MA","ME","MS","PH","TT","TX","MT"];

  const schemas = {
    kgp: {
      name: "IIT Kharagpur",
      rollPlaceholder: "e.g. 24PH10029",
      emailPlaceholder: "e.g. rollnumber@kgpian.iitkgp.ac.in",
      validateRoll: (roll) => {
        roll = roll.trim().toUpperCase();
        if (!/^\d{2}[A-Z]{2}\d{5}$/.test(roll)) {
          return "Format must be 2-digit year + 2-letter Dept + 5-digit Roll (e.g. 24PH10029)";
        }
        const yr = parseInt(roll.substring(0, 2), 10);
        if (yr < 14 || yr > 26) {
          return `Entry year '${yr}' is invalid. Must be between 14 (2014) and 26 (2026).`;
        }
        const dept = roll.substring(2, 4);
        if (!KGP_DEPTS.includes(dept)) {
          return `'${dept}' is not a valid department code at IIT Kharagpur.`;
        }
        return null;
      },
      emailCheck: (email, roll) => {
        if (!email.endsWith("@kgpian.iitkgp.ac.in") && !email.endsWith("@iitkgp.ac.in")) {
          return "Email must end with @kgpian.iitkgp.ac.in or @iitkgp.ac.in";
        }
        const prefix = email.split("@")[0].toUpperCase();
        if (prefix.length === 9 && /^\d{2}[A-Z]{2}\d{5}$/.test(prefix) && prefix !== roll.toUpperCase()) {
          return `Email prefix '${prefix}' does not match entered Roll Number '${roll}'.`;
        }
        return null;
      }
    },
    bombay: {
      name: "IIT Bombay",
      rollPlaceholder: "e.g. 240050012",
      emailPlaceholder: "e.g. rollnumber@iitb.ac.in",
      validateRoll: (roll) => {
        roll = roll.trim().toUpperCase();
        if (!/^\d{9,10}$/.test(roll) && !/^\d{2}[A-Z0-9]{2}\d{5,6}$/.test(roll)) {
          return "Must be a 9 or 10-character code starting with year (e.g. 240050012)";
        }
        const yr = parseInt(roll.substring(0, 2), 10);
        if (yr < 14 || yr > 26) {
          return `Entry year '${yr}' is invalid. Must be between 14 (2014) and 26 (2026).`;
        }
        return null;
      },
      emailCheck: (email) => email.endsWith("@iitb.ac.in") ? null : "Email must end with @iitb.ac.in"
    },
    kanpur: {
      name: "IIT Kanpur",
      rollPlaceholder: "e.g. 240123",
      emailPlaceholder: "e.g. username@iitk.ac.in",
      validateRoll: (roll) => {
        roll = roll.trim();
        if (!/^\d{6,8}$/.test(roll)) {
          return "IIT Kanpur roll number must be 6 or 8 digits (e.g. 240123)";
        }
        const yr = parseInt(roll.substring(0, 2), 10);
        if (yr < 14 || yr > 26) {
          return `Entry year '${yr}' is invalid. Must be between 14 (2014) and 26 (2026).`;
        }
        return null;
      },
      emailCheck: (email) => email.endsWith("@iitk.ac.in") ? null : "Email must end with @iitk.ac.in"
    },
    madras: {
      name: "IIT Madras",
      rollPlaceholder: "e.g. EE19D016",
      emailPlaceholder: "e.g. rollnumber@smail.iitm.ac.in",
      validateRoll: (roll) => {
        roll = roll.trim().toUpperCase();
        const match = roll.match(/^([A-Z]{2})(\d{2})([BDMSP])(\d{3})$/);
        if (!match) {
          return "Must be in format: Dept + Year + Program + Serial (e.g. EE19D016)";
        }
        const dept = match[1];
        const yr = parseInt(match[2], 10);
        if (!MADRAS_DEPTS.includes(dept)) {
          return `'${dept}' is not a valid department code at IIT Madras.`;
        }
        if (yr < 14 || yr > 26) {
          return `Entry year '${yr}' is invalid. Must be between 14 (2014) and 26 (2026).`;
        }
        return null;
      },
      emailCheck: (email) => (email.endsWith("@smail.iitm.ac.in") || email.endsWith("@iitm.ac.in")) ? null : "Email must end with @smail.iitm.ac.in or @iitm.ac.in"
    },
    delhi: {
      name: "IIT Delhi",
      rollPlaceholder: "e.g. 2024PH10123",
      emailPlaceholder: "e.g. username@iitd.ac.in",
      validateRoll: (roll) => {
        roll = roll.trim().toUpperCase();
        let yr, dept;
        if (/^\d{4}[A-Z]{2}\d{5}$/.test(roll)) {
          yr = parseInt(roll.substring(0, 4), 10);
          dept = roll.substring(4, 6);
        } else if (/^\d{2}[A-Z]{2}\d{5}$/.test(roll)) {
          yr = 2000 + parseInt(roll.substring(0, 2), 10);
          dept = roll.substring(2, 4);
        } else {
          return "Must be 9 or 11 characters starting with entry year (e.g. 2024PH10123)";
        }
        if (yr < 2014 || yr > 2026) {
          return `Entry year '${yr}' is invalid. Must be between 2014 and 2026.`;
        }
        if (!DELHI_DEPTS.includes(dept)) {
          return `'${dept}' is not a valid department code at IIT Delhi.`;
        }
        return null;
      },
      emailCheck: (email) => (email.endsWith("@iitd.ac.in") || (email.includes("@") && email.split("@")[1].endsWith("iitd.ac.in"))) ? null : "Email must end with @iitd.ac.in"
    },
    roorkee: {
      name: "IIT Roorkee",
      rollPlaceholder: "e.g. 24112023",
      emailPlaceholder: "e.g. username@iitr.ac.in",
      validateRoll: (roll) => {
        roll = roll.trim();
        if (!/^\d{8}$/.test(roll)) {
          return "IIT Roorkee enrollment number must be 8 digits (e.g. 24112023)";
        }
        const yr = parseInt(roll.substring(0, 2), 10);
        if (yr < 14 || yr > 26) {
          return `Entry year '${yr}' is invalid. Must be between 14 (2014) and 26 (2026).`;
        }
        return null;
      },
      emailCheck: (email) => email.endsWith("@iitr.ac.in") ? null : "Email must end with @iitr.ac.in"
    },
    guwahati: {
      name: "IIT Guwahati",
      rollPlaceholder: "e.g. 240101012",
      emailPlaceholder: "e.g. username@iitg.ac.in",
      validateRoll: (roll) => {
        roll = roll.trim();
        if (!/^\d{9}$/.test(roll)) {
          return "IIT Guwahati roll number must be 9 digits (e.g. 240101012)";
        }
        const yr = parseInt(roll.substring(0, 2), 10);
        if (yr < 14 || yr > 26) {
          return `Entry year '${yr}' is invalid. Must be between 14 (2014) and 26 (2026).`;
        }
        return null;
      },
      emailCheck: (email) => email.endsWith("@iitg.ac.in") ? null : "Email must end with @iitg.ac.in"
    },
    shibpur: {
      name: "IIEST Shibpur",
      rollPlaceholder: "e.g. 2024PHB012",
      emailPlaceholder: "e.g. username@iiests.ac.in",
      validateRoll: (roll) => {
        roll = roll.trim().toUpperCase();
        if (!/^[A-Z0-9]{9,10}$/.test(roll)) {
          return "IIEST Shibpur roll number must be 9 or 10 characters (e.g. 2024PHB012)";
        }
        let yr = parseInt(roll.substring(0, 2), 10);
        if (roll.length === 10 && !isNaN(parseInt(roll.substring(0, 4), 10))) {
          yr = parseInt(roll.substring(0, 4), 10) - 2000;
        }
        if (yr < 14 || yr > 26) {
          return `Entry year is invalid. Must be between 2014 and 2026.`;
        }
        return null;
      },
      emailCheck: (email) => email.endsWith("@iiests.ac.in") ? null : "Email must end with @iiests.ac.in"
    }
  };

  function updatePlaceholder() {
    if (!instSelect) return;
    const inst = instSelect.value;
    const schema = schemas[inst];
    if (schema) {
      if (rollInput) {
        rollInput.placeholder = schema.rollPlaceholder;
        rollInput.classList.remove("invalid");
      }
      if (emailInput) {
        emailInput.placeholder = schema.emailPlaceholder;
        emailInput.classList.remove("invalid");
      }
      if (rollError) rollError.style.display = "none";
      if (emailError) emailError.style.display = "none";
    }
  }

  if (instSelect) {
    instSelect.addEventListener("change", updatePlaceholder);
    updatePlaceholder();
  }

  function showStep(step) {
    if (stepDetecting) stepDetecting.style.display = step === "detecting" ? "flex" : "none";
    if (stepSuccess) stepSuccess.style.display = step === "success" ? "flex" : "none";
    if (stepManual) stepManual.style.display = step === "manual" ? "block" : "none";
  }

  window.openWhatsappModal = function() {
    modal.classList.add("active");
    showStep("detecting");
    
    if (rollInput) rollInput.value = "";
    if (emailInput) emailInput.value = "";
    if (rollInput) rollInput.classList.remove("invalid");
    if (emailInput) emailInput.classList.remove("invalid");
    if (rollError) rollError.style.display = "none";
    if (emailError) emailError.style.display = "none";
    if (progressBar) progressBar.style.width = "0%";

    setTimeout(async () => {
      const detectedInst = await checkCampusNetwork();
      if (detectedInst) {
        if (networkNameLabel) networkNameLabel.innerText = `Access Granted via ${detectedInst}`;
        showStep("success");
        setTimeout(() => {
          if (progressBar) progressBar.style.width = "100%";
        }, 50);
        
        setTimeout(() => {
          window.open(WHATSAPP_URL, "_blank");
          closeWhatsappModal();
        }, 1600);
      } else {
        showStep("manual");
      }
    }, 1200);
  };

  window.closeWhatsappModal = function() {
    modal.classList.remove("active");
  };

  async function checkCampusNetwork() {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3500);

      const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(id);
      
      if (!response.ok) return null;
      const data = await response.json();
      
      const org = (data.org || '').toLowerCase();
      const isp = (data.isp || '').toLowerCase();
      
      if (org.includes('kharagpur') || isp.includes('kharagpur') || org.includes('iit kgp') || isp.includes('iit kgp')) return "IIT Kharagpur WiFi";
      if (org.includes('bombay') || isp.includes('bombay') || org.includes('iitb') || isp.includes('iitb')) return "IIT Bombay WiFi";
      if (org.includes('kanpur') || isp.includes('kanpur') || org.includes('iitk') || isp.includes('iitk')) return "IIT Kanpur WiFi";
      if (org.includes('madras') || isp.includes('madras') || org.includes('iitm') || isp.includes('iitm')) return "IIT Madras WiFi";
      if (org.includes('delhi') || isp.includes('delhi') || org.includes('iitd') || isp.includes('iitd')) return "IIT Delhi WiFi";
      if (org.includes('roorkee') || isp.includes('roorkee') || org.includes('iitr') || isp.includes('iitr')) return "IIT Roorkee WiFi";
      if (org.includes('guwahati') || isp.includes('guwahati') || org.includes('iitg') || isp.includes('iitg')) return "IIT Guwahati WiFi";
      if (org.includes('shibpur') || isp.includes('shibpur') || org.includes('iiest') || isp.includes('iiest')) return "IIEST Shibpur WiFi";
      if (org.includes('national knowledge network') || isp.includes('national knowledge network') || org.includes('nkn') || isp.includes('nkn') || org.includes('ernet') || isp.includes('ernet')) return "NKN (Campus Network)";
      
      return null;
    } catch (err) {
      console.warn("Campus network check fallback to manual validation.", err);
      return null;
    }
  }

  // Document event delegation for all WhatsApp triggers across the site
  document.addEventListener("click", (e) => {
    const target = e.target.closest(".whatsapp-auth-btn, #whatsapp-chair-btn, a[href*='wa.me'], a[data-obfuscated-wa]");
    if (target) {
      e.preventDefault();
      openWhatsappModal();
    }
  });

  // Handle Form Submission Validation
  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const inst = instSelect.value;
      const schema = schemas[inst];
      if (!schema) return;

      const rollVal = rollInput ? rollInput.value.trim() : "";
      const emailVal = emailInput ? emailInput.value.trim() : "";

      if (rollInput) rollInput.classList.remove("invalid");
      if (emailInput) emailInput.classList.remove("invalid");
      if (rollError) rollError.style.display = "none";
      if (emailError) emailError.style.display = "none";

      // 1. Strict Roll Number Validation
      const rollErrReason = schema.validateRoll(rollVal);
      if (rollErrReason) {
        if (rollInput) rollInput.classList.add("invalid");
        if (rollError) {
          rollError.innerText = rollErrReason;
          rollError.style.display = "block";
        }
        return;
      }

      // 2. Strict Email Validation & Roll-Email Alignment Check
      const emailErrReason = schema.emailCheck(emailVal, rollVal);
      if (emailErrReason) {
        if (emailInput) emailInput.classList.add("invalid");
        if (emailError) {
          emailError.innerText = emailErrReason;
          emailError.style.display = "block";
        }
        return;
      }

      // Successful Verification
      window.open(WHATSAPP_URL, "_blank");
      closeWhatsappModal();
    });
  }
}


function initSmoothScrolling() {
  document.documentElement.style.scrollBehavior = 'smooth';
  const parallaxBg = document.getElementById('parallax-bg');
  if (parallaxBg) {
    parallaxBg.style.willChange = 'transform';
    parallaxBg.style.opacity = '0.65';
  }
}

function initCursor() {
  const blob = document.createElement('div');
  blob.className = 'cursor-blob';
  document.body.appendChild(blob);
  
  const trails = [];
  const numTrails = 8;
  for (let i = 0; i < numTrails; i++) {
    const t = document.createElement('div');
    t.className = 'cursor-trail';
    document.body.appendChild(t);
    trails.push({ el: t, x: window.innerWidth/2, y: window.innerHeight/2 });
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let blobX = mouseX;
  let blobY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    blobX += (mouseX - blobX) * 0.4;
    blobY += (mouseY - blobY) * 0.4;
    blob.style.left = blobX + 'px';
    blob.style.top = blobY + 'px';

    let tx = blobX;
    let ty = blobY;
    trails.forEach((trail, i) => {
      trail.x += (tx - trail.x) * 0.3;
      trail.y += (ty - trail.y) * 0.3;
      trail.el.style.left = trail.x + 'px';
      trail.el.style.top = trail.y + 'px';
      const scale = 1 - (i / numTrails);
      trail.el.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
      tx = trail.x;
      ty = trail.y;
    });

    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

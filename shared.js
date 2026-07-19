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
    const n = Math.min(18, Math.floor((W * H) / 80000));
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

  // Merge admin-published announcements from localStorage (most recent first)
  const adminAnns = JSON.parse(localStorage.getItem('physoc_announcements') || '[]');
  const adminFormatted = adminAnns.map(a => ({
    title: a.title, date: a.date, tag: a.category, desc: a.body || ''
  }));

  const DATA = [
    ...adminFormatted,
    {
      title: '2nd Year Executive Selections — July 25, 2026',
      date: 'July 18, 2026',
      tag: 'events',
      desc: 'Selections for 2nd year student executives will be held on July 25, 2026 in the Physics Department Seminar Room. Interested students should prepare a brief Statement of Purpose.'
    },
    {
      title: 'PhySoc Official Website Launch',
      date: 'July 18, 2026',
      tag: 'events',
      desc: 'Welcome to the official digital home of Physics Society, IIT Kharagpur! Explore our events, resources, and meet the team.'
    }
  ];

  let activeFilter = 'all';
  let searchQ = '';

  const render = () => {
    const list = DATA.filter(d => {
      const matchF = activeFilter === 'all' || d.tag === activeFilter;
      const matchS = d.title.toLowerCase().includes(searchQ) || d.desc.toLowerCase().includes(searchQ);
      return matchF && matchS;
    });

    container.innerHTML = list.length === 0
      ? '<p style="color:var(--text-muted);padding:30px;text-align:center;font-size:14px">No announcements found.</p>'
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
   DYNAMIC RESOURCES FROM ADMIN
   ------------------------------------------------------- */
function initDynamicResources() {
  const booksContainer = $('#books-container');
  const coursesContainer = $('#courses-tbody');
  if (!booksContainer && !coursesContainer) return;

  const res = JSON.parse(localStorage.getItem('physoc_resources') || '[]');
  
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
            <span class="tag tag-academic">Admin Added</span>
          </div>
        </div>`;
      booksContainer.prepend(div);
    } 
    else if (r.category === 'courses' && coursesContainer) {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
      tr.innerHTML = `
        <td style="padding:12px 16px;color:var(--text-bright)">${r.title}</td>
        <td style="padding:12px 16px;font-family:var(--font-code);font-size:12px">${r.course_code || '—'}</td>
        <td style="padding:12px 16px">${r.semester || '—'}</td>
        <td style="padding:12px 16px"><a href="${r.link_url}" target="_blank" style="color:var(--cyan)"><i class="fa-solid fa-download"></i> Download</a></td>`;
      coursesContainer.prepend(tr);
    }
  });
}

/* -------------------------------------------------------
   DYNAMIC INTERNSHIPS FROM ADMIN
   ------------------------------------------------------- */
function initDynamicInternships() {
  const container = $('#internships-tbody');
  if (!container) return;

  const internships = JSON.parse(localStorage.getItem('physoc_internships') || '[]');
  
  if (internships.length === 0) {
    container.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:32px">No internship opportunities listed at the moment.</td></tr>';
    return;
  }

  container.innerHTML = '';
  internships.forEach(item => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    tr.innerHTML = `
      <td style="padding:12px 16px;color:var(--text-bright);font-weight:600">${item.company}</td>
      <td style="padding:12px 16px;color:var(--text-muted)">${item.opportunity}</td>
      <td style="padding:12px 16px;color:var(--text-muted)">${item.eligibility}</td>
      <td style="padding:12px 16px;color:var(--text-muted);line-height:1.4">
        <div><strong>Deadline:</strong> ${item.deadline || '—'}</div>
        <div style="font-size:11px;margin-top:2px"><strong>Interviews:</strong> ${item.interview_dates || '—'}</div>
      </td>`;
    container.appendChild(tr);
  });
}

/* -------------------------------------------------------
   CONTACT OBFUSCATION & DECRYPTION (Anti-Scraping)
   ------------------------------------------------------- */
function initObfuscatedContacts() {
  // Decrypt emails
  document.querySelectorAll('[data-obfuscated-email]').forEach(el => {
    const encoded = el.getAttribute('data-obfuscated-email');
    if (!encoded) return;
    const email = atob(encoded);
    el.href = 'mailto:' + email;
    const trimmedText = el.textContent.trim();
    if (trimmedText === '[email protected]' || trimmedText === 'phyiitkharagpur@gmail.com') {
      el.textContent = email;
    }
  });

  // Decrypt WhatsApp/Phone links
  document.querySelectorAll('[data-obfuscated-wa]').forEach(el => {
    const encodedPhone = el.getAttribute('data-obfuscated-wa');
    if (!encodedPhone) return;
    const phone = atob(encodedPhone);
    const text = el.getAttribute('data-wa-text') || '';
    el.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    if (el.getAttribute('data-show-phone') === 'true') {
      el.innerHTML = `<i class="fa-brands fa-whatsapp"></i> +91 ${phone.substring(2, 7)} ${phone.substring(7)} (Chairs)`;
    }
  });
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
  // initSmoothScrolling();
  // initCursor();
  initDynamicInternships();
  initObfuscatedContacts();
});


function initSmoothScrolling() {
  if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
    wheelMultiplier: 1.2
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  const parallaxBg = document.getElementById('parallax-bg');
  if (parallaxBg) {
    gsap.to(parallaxBg, {
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });
    setTimeout(() => { parallaxBg.style.opacity = '0.65'; }, 500);
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

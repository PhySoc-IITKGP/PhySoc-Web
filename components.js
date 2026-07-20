/**
 * PHYSOC — components.js
 * Injects shared header + footer into every page.
 * Auto-detects base path from the <link href="shared.css"> tag.
 * Works at any folder depth: root, /about/, /sandbox/orbit/, etc.
 */
(function () {
  'use strict';

  /* --------------------------------------------------
     BASE PATH DETECTION
     Reads the href of the shared.css link so this file
     works at any folder depth without configuration.
  -------------------------------------------------- */
  const cssLink = document.querySelector('link[href*="shared.css"]');
  const base = cssLink
    ? cssLink.getAttribute('href').replace('shared.css', '')
    : './';

  /* --------------------------------------------------
     NAV LINKS — single source of truth
  -------------------------------------------------- */
  const NAV = [
    { href: '',            icon: 'fa-house-chimney',    label: 'Home' },
    { href: 'about/',      icon: 'fa-circle-info',      label: 'About' },
    { href: 'department/', icon: 'fa-building-columns', label: 'Department' },
    { href: 'announcements/', icon: 'fa-bullhorn',      label: 'Announcements' },
    { href: 'resources/',  icon: 'fa-book-open-reader', label: 'Resources' },
    { href: 'officers/',   icon: 'fa-user-group',       label: 'Team' },
    { href: 'sandbox/',    icon: 'fa-atom',             label: 'Sandbox' },
    { href: 'contact/',    icon: 'fa-envelope',         label: 'Contact' },
  ];

  const desktopLinks = NAV.map(n =>
    `<a href="${base}${n.href}"><i class="fa-solid ${n.icon}"></i> ${n.label}</a>`
  ).join('\n      ');

  const drawerLinks = NAV.map(n =>
    `<a href="${base}${n.href}" class="drawer-link"><i class="fa-solid ${n.icon}"></i> ${n.label}</a>`
  ).join('\n    ');

  const footerLinks = NAV.map(n =>
    `<a href="${base}${n.href}">${n.label}</a>`
  ).join('');

  /* --------------------------------------------------
     HEADER HTML
  -------------------------------------------------- */
  const headerHTML = `
    <div class="mobile-overlay" id="mobile-overlay"></div>
    <nav class="mobile-drawer" id="mobile-drawer" aria-label="Mobile navigation">
      <div class="mobile-drawer-header">
        <div class="drawer-brand">
          <img src="${base}logo.svg" alt="PhySoc Logo" />
          <span>PhySoc</span>
        </div>
        <button class="drawer-close" id="drawer-close" aria-label="Close menu">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      ${drawerLinks}
      <div class="drawer-sep"></div>
      <div class="drawer-footer">
        Physics Society &middot; IIT Kharagpur<br>
        <a href="mailto:phyiitkharagpur@gmail.com">phyiitkharagpur@gmail.com</a>
      </div>
    </nav>

    <header class="main-header" role="banner">
      <a href="${base}" class="header-brand" aria-label="PhySoc Home">
        <div class="logo-wrap">
          <img src="${base}logo.svg" alt="PhySoc Logo" />
        </div>
        <div class="brand-text">
          <span class="brand-title">PhySoc</span>
          <span class="sub">IIT Kharagpur</span>
        </div>
      </a>

      <nav class="desktop-nav" aria-label="Primary navigation">
        ${desktopLinks}
      </nav>

      <div class="header-right">
        <div class="search-container" id="search-wrapper">
          <input type="text" id="search-input" placeholder="Search PhySoc…" aria-label="Search" />
          <button class="icon-btn" id="search-trigger" aria-label="Search">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
          <div id="search-results" class="search-results"></div>
        </div>
        <button class="icon-btn" id="theme-toggle" aria-label="Toggle theme">
          <i class="fa-solid fa-moon moon-icon"></i>
          <i class="fa-solid fa-sun sun-icon"></i>
        </button>
        <a href="#" class="btn btn-primary whatsapp-auth-btn" style="padding:7px 12px;font-size:12px;display:flex;align-items:center;gap:6px" aria-label="Join Us">
          <i class="fa-brands fa-whatsapp" style="font-size:14px"></i> <span style="font-weight:600">Join Us</span>
        </a>
        <button class="hamburger-btn" id="hamburger-btn" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>`;

  /* --------------------------------------------------
     FOOTER HTML
  -------------------------------------------------- */
  const footerHTML = `
    <footer class="main-footer" role="contentinfo">
      <div class="footer-inner">
        <div class="footer-brand">
          <img src="${base}logo.svg" alt="PhySoc Logo" class="footer-logo" />
          <div>
            <strong>Physics Society (PhySoc)</strong>
            <span>IIT Kharagpur, WB&nbsp;721302</span>
          </div>
        </div>
        <nav class="footer-links" aria-label="Footer navigation">
          ${footerLinks}
        </nav>
      </div>
      <div class="footer-bottom">
        &copy; 2026 Physics Society, IIT Kharagpur &mdash; Built with passion for science.
      </div>
    </footer>`;

  /* --------------------------------------------------
     WHATSAPP IDENTITY VERIFICATION MODAL HTML
  -------------------------------------------------- */
  const whatsappModalHTML = `
  <div class="modal-overlay" id="whatsapp-modal" role="dialog" aria-modal="true">
    <div class="modal-card whatsapp-modal-card" style="max-width: 450px; text-align: left; padding: 30px;">
      <!-- Step 1: Loading Network Auto-detection -->
      <div id="wa-step-detecting" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px 0;">
        <i class="fa-solid fa-wifi fa-spin-pulse" style="font-size: 48px; color: var(--cyan, #00f2fe); margin-bottom: 20px; --fa-animation-duration: 2s;"></i>
        <h3 style="margin-bottom: 10px;">Checking Campus Network</h3>
        <p style="font-size: 13px; color: var(--text-muted); max-width: 320px; text-align: center;">Scanning for authorized institutional Wi-Fi networks (IITs or IIEST Shibpur)...</p>
      </div>

      <!-- Step 2: Auto-detection Success -->
      <div id="wa-step-success" style="display: none; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px 0;">
        <i class="fa-solid fa-circle-check" style="font-size: 56px; color: #10b981; margin-bottom: 20px; filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.3));"></i>
        <h3 style="margin-bottom: 10px;">Network Verified!</h3>
        <p id="wa-network-name" style="font-size: 14px; color: var(--text-bright); font-weight: 500; margin-bottom: 5px; text-align: center;">Access Granted via Campus Wifi</p>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 20px; text-align: center;">Redirecting you to the Chairs' WhatsApp contact...</p>
        <div class="loader-bar" style="width: 100%; height: 4px; background: var(--border-color); border-radius: 2px; overflow: hidden; position: relative;">
          <div class="loader-progress" id="wa-progress-bar" style="width: 0%; height: 100%; background: var(--cyan, #00f2fe); transition: width 1.5s linear;"></div>
        </div>
      </div>

      <!-- Step 3: Manual Verification Form -->
      <div id="wa-step-manual" style="display: none;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
          <div style="background: rgba(0, 242, 254, 0.1); width: 42px; height: 42px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--cyan, #00f2fe); flex-shrink: 0;">
            <i class="fa-solid fa-shield-halved" style="font-size: 20px;"></i>
          </div>
          <div>
            <h3 style="margin: 0; font-size: 18px; line-height: 1.2;">Verify Identity</h3>
            <p style="margin: 3px 0 0 0; font-size: 11px; color: var(--text-muted);">Please verify your student credentials to message the Chairs.</p>
          </div>
        </div>

        <form id="whatsapp-auth-form" style="display: flex; flex-direction: column; gap: 14px;">
          <div class="form-group" style="display: flex; flex-direction: column; gap: 5px;">
            <label for="wa-institute" style="font-size: 12px; color: var(--text-bright); font-weight: 500;">Select Institute *</label>
            <select id="wa-institute" required style="padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-bright); outline: none; font-size: 13px; cursor: pointer; width: 100%;">
              <option value="kgp">IIT Kharagpur</option>
              <option value="bombay">IIT Bombay</option>
              <option value="kanpur">IIT Kanpur</option>
              <option value="madras">IIT Madras</option>
              <option value="delhi">IIT Delhi</option>
              <option value="roorkee">IIT Roorkee</option>
              <option value="guwahati">IIT Guwahati</option>
              <option value="shibpur">IIEST Shibpur</option>
            </select>
          </div>

          <div class="form-group" style="display: flex; flex-direction: column; gap: 5px;">
            <label for="wa-roll" id="wa-roll-label" style="font-size: 12px; color: var(--text-bright); font-weight: 500;">Roll Number *</label>
            <input type="text" id="wa-roll" placeholder="e.g. 24PH10029" required style="padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: rgba(255, 255, 255, 0.03); color: var(--text-bright); outline: none; font-size: 13px; font-family: 'Fira Code', monospace; width: 100%;">
            <span class="error-msg" id="wa-roll-error" style="display: none; color: var(--danger, #ff5252); font-size: 11px; margin-top: 3px;"></span>
          </div>

          <div class="form-group" style="display: flex; flex-direction: column; gap: 5px;">
            <label for="wa-email" id="wa-email-label" style="font-size: 12px; color: var(--text-bright); font-weight: 500;">Institute Email *</label>
            <input type="email" id="wa-email" placeholder="e.g. rollnumber@kgpian.iitkgp.ac.in" required style="padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: rgba(255, 255, 255, 0.03); color: var(--text-bright); outline: none; font-size: 13px; width: 100%;">
            <span class="error-msg" id="wa-email-error" style="display: none; color: var(--danger, #ff5252); font-size: 11px; margin-top: 3px;"></span>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 10px; width: 100%;">
            <button type="button" class="btn btn-ghost" onclick="closeWhatsappModal()" style="flex: 1; padding: 10px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; justify-content: center;">Cancel</button>
            <button type="submit" class="btn btn-primary" style="flex: 2; padding: 10px; border-radius: 6px; font-size: 13px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;">
              Verify & Text <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>`;

  /* --------------------------------------------------
     INJECT
  -------------------------------------------------- */
  const headerEl = document.getElementById('physoc-header');
  if (headerEl) headerEl.outerHTML = headerHTML;

  const footerEl = document.getElementById('physoc-footer');
  if (footerEl) footerEl.outerHTML = footerHTML;

  if (!document.getElementById('whatsapp-modal')) {
    document.body.insertAdjacentHTML('beforeend', whatsappModalHTML);
  }

})();

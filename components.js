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
    { href: 'announcements/', icon: 'fa-bullhorn',      label: 'Announcements' },
    { href: 'resources/',  icon: 'fa-book-open-reader', label: 'Resources' },
    { href: 'officers/',   icon: 'fa-user-group',       label: 'Officers' },
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
        <a href="#" data-obfuscated-email="cGh5aWl0a2hhcmFncHVyQGdtYWlsLmNvbQ==">[email protected]</a>
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
        <a href="#" data-obfuscated-wa="OTE5ODg3MDc4NjE3" data-wa-text="Hi Neeraj, I'm very interested to join PhySoc. I got your number from the website." target="_blank" rel="noopener" class="btn btn-primary" style="padding:7px 12px;font-size:12px;display:flex;align-items:center;gap:6px" aria-label="Join Us">
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
     INJECT
  -------------------------------------------------- */
  const headerEl = document.getElementById('physoc-header');
  if (headerEl) headerEl.outerHTML = headerHTML;

  const footerEl = document.getElementById('physoc-footer');
  if (footerEl) footerEl.outerHTML = footerHTML;

})();

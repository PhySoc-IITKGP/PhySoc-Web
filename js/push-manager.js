// PhySoc IIT Kharagpur - PWA Service Worker, Push Notifications & Auto Event Sync Engine
(function() {
  window.deferredPWAInstallPrompt = null;

  // 1. Listen for Chrome/Android/Edge beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    window.deferredPWAInstallPrompt = e;
    console.log('PWA beforeinstallprompt event captured');
    showInstallPromptUI();
  });

  // 2. Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function(reg) {
          console.log('PhySoc Service Worker registered successfully:', reg.scope);
        })
        .catch(function(err) {
          console.log('Service Worker registration failed:', err);
        });
    });
  }

  // 3. Trigger PWA App Installation
  window.triggerPWAInstall = function() {
    if (window.deferredPWAInstallPrompt) {
      window.deferredPWAInstallPrompt.prompt();
      window.deferredPWAInstallPrompt.userChoice.then(function(choiceResult) {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted PWA installation');
        }
        window.deferredPWAInstallPrompt = null;
      });
    } else {
      alert("To install PhySoc App on your device:\n\n1. Tap your browser menu (⋮ or share icon)\n2. Select 'Add to Home Screen' or 'Install App'");
    }
  };

  // 4. Helper to Dispatch Native Web Push Notification
  window.sendPhySocNotification = function(title, body, url) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(function(reg) {
          reg.showNotification(title || 'PhySoc IIT Kharagpur', {
            body: body || 'New physics event updated! Check calendar for details.',
            icon: '/images/icon-192.png',
            badge: '/images/icon-192.png',
            vibrate: [100, 50, 100],
            data: { url: url || '/events/index.html' }
          });
        });
      } else {
        new Notification(title || 'PhySoc IIT Kharagpur', {
          body: body || 'New physics event updated! Check calendar for details.',
          icon: '/images/icon-192.png'
        });
      }
    }
  };

  // 5. Automatic Live Event Sync & Notification Dispatcher
  async function syncCalendarAndNotify() {
    try {
      const res = await fetch('/api/calendar-events');
      if (!res.ok) return;
      const data = await res.json();
      if (!data.events || data.events.length === 0) return;

      const latestEvent = data.events[0];
      const lastSeenUid = localStorage.getItem('physoc_last_seen_event_uid');

      if (lastSeenUid && lastSeenUid !== latestEvent.uid) {
        // New event detected!
        sendPhySocNotification(
          '📅 New Event: ' + latestEvent.title,
          latestEvent.description ? latestEvent.description.slice(0, 120) + '...' : 'A new event has been added to the PhySoc calendar!',
          '/events/index.html'
        );
      }

      // Save latest event UID
      localStorage.setItem('physoc_last_seen_event_uid', latestEvent.uid);
    } catch (e) {
      console.log('Calendar sync error:', e);
    }
  }

  // 6. Show PWA Install Prompt Banner UI
  function showInstallPromptUI() {
    let banner = document.getElementById('physoc-pwa-install-card');
    if (banner) return;

    try {
      if (localStorage.getItem('physoc_pwa_install_dismissed')) return;
    } catch(e){}

    banner = document.createElement('div');
    banner.id = 'physoc-pwa-install-card';
    banner.className = 'fixed bottom-4 left-4 z-50 max-w-sm bg-white dark:bg-darkmode-theme-light p-5 rounded-2xl shadow-2xl border border-border/40 dark:border-darkmode-border/40 transition-all duration-300 transform translate-y-0';
    banner.innerHTML = `
      <div class="flex items-start gap-3">
        <img src="/images/icon-192.png" alt="PhySoc" class="w-12 h-12 rounded-xl shadow-sm object-cover" />
        <div class="flex-1">
          <h4 class="font-bold text-base text-text-dark dark:text-white mb-1">Install PhySoc App</h4>
          <p class="text-xs text-text-dark/80 dark:text-white/80 leading-relaxed mb-4">Install the Physics Society app on your home screen for fast access &amp; instant event alerts!</p>
          <div class="flex items-center gap-2">
            <button onclick="triggerPWAInstall(); document.getElementById('physoc-pwa-install-card').remove();" class="px-4 py-2 rounded-xl bg-[#3E7B9D] text-white text-xs font-semibold shadow hover:opacity-90 transition-opacity flex items-center gap-1.5">
              <span>📲</span>
              <span>Install App</span>
            </button>
            <button onclick="document.getElementById('physoc-pwa-install-card').remove(); try{localStorage.setItem('physoc_pwa_install_dismissed', 'true');}catch(e){}" class="px-3 py-2 rounded-xl border border-border/40 text-text-dark/70 dark:text-white/70 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              Later
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
  }

  // 7. Notification Permission Banner UI
  function initNotificationUI() {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'default') {
      // If already granted, run live calendar sync check
      syncCalendarAndNotify();
      return;
    }

    try {
      if (localStorage.getItem('physoc_notif_dismissed')) return;
    } catch(e){}

    const banner = document.createElement('div');
    banner.id = 'physoc-push-banner';
    banner.className = 'fixed bottom-4 right-4 z-50 max-w-sm bg-white dark:bg-darkmode-theme-light p-5 rounded-2xl shadow-2xl border border-border/40 dark:border-darkmode-border/40 transition-all duration-300 transform translate-y-0';
    banner.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="text-3xl select-none">🔔</div>
        <div class="flex-1">
          <h4 class="font-bold text-base text-text-dark dark:text-white mb-1">Get PhySoc Event Alerts</h4>
          <p class="text-xs text-text-dark/80 dark:text-white/80 leading-relaxed mb-4">Enable notifications to receive instant updates for Physics Competitions, Telescope Observation Nights, Workshops &amp; Announcements!</p>
          <div class="flex items-center gap-2">
            <button id="enable-notif-btn" class="px-4 py-2 rounded-xl bg-[#3E7B9D] text-white text-xs font-semibold shadow hover:opacity-90 transition-opacity">
              Enable Alerts
            </button>
            <button id="dismiss-notif-btn" class="px-3 py-2 rounded-xl border border-border/40 text-text-dark/70 dark:text-white/70 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              Later
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('enable-notif-btn').addEventListener('click', function() {
      Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
          banner.remove();
          sendPhySocNotification(
            '🔔 PhySoc Notifications Enabled!',
            'You will now receive instant updates on your phone & desktop whenever new physics events or announcements are posted.',
            '/events/index.html'
          );
          syncCalendarAndNotify();
        } else {
          banner.remove();
        }
      });
    });

    document.getElementById('dismiss-notif-btn').addEventListener('click', function() {
      banner.remove();
      try {
        localStorage.setItem('physoc_notif_dismissed', 'true');
      } catch(e){}
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initNotificationUI, 1500);
  });
})();

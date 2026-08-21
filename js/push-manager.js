// PhySoc IIT Kharagpur - Push Notification Manager Engine
(function() {
  // Register PWA Service Worker
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

  // Helper to show Push Notification
  window.sendPhySocNotification = function(title, body, url) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(function(reg) {
          reg.showNotification(title || 'PhySoc IIT Kharagpur', {
            body: body || 'New physics event updated! Check calendar for details.',
            icon: '/images/logo2_hu_20f6f98a0862d010.png',
            badge: '/images/logo2_hu_20f6f98a0862d010.png',
            vibrate: [100, 50, 100],
            data: { url: url || '/events/index.html' }
          });
        });
      } else {
        new Notification(title || 'PhySoc IIT Kharagpur', {
          body: body || 'New physics event updated! Check calendar for details.',
          icon: '/images/logo2_hu_20f6f98a0862d010.png'
        });
      }
    }
  };

  // Notification Subscription Banner UI
  function initNotificationUI() {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'default') return;

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
    setTimeout(initNotificationUI, 2000);
  });
})();

// PhySoc IIT Kharagpur - PWA Service Worker & Real-Time Event Push Notification Engine
(function() {
  // 1. Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function(reg) {
          console.log('PhySoc Service Worker registered:', reg.scope);
          if ('periodicSync' in reg) {
            try {
              reg.periodicSync.register('physoc-calendar-sync', {
                minInterval: 15 * 60 * 1000
              }).then(function() {
                console.log('Periodic Background Sync registered successfully!');
              }).catch(function(e) {
                console.log('Periodic sync registration:', e);
              });
            } catch(e){}
          }
        })
        .catch(function(err) {
          console.log('Service Worker registration failed:', err);
        });
    });
  }

  // 2. Dispatch Push Notification via Service Worker or Web Notification API
  window.sendPhySocNotification = function(title, body, url) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      const notifOptions = {
        body: body || 'New physics event update on PhySoc Calendar!',
        icon: '/images/icon-192.png',
        badge: '/images/icon-192.png',
        vibrate: [200, 100, 200],
        tag: 'physoc-event-' + Date.now(),
        renotify: true,
        data: { url: url || '/events/index.html' }
      };

      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(function(reg) {
          reg.showNotification(title || 'PhySoc IIT Kharagpur', notifOptions);
        });
      } else {
        new Notification(title || 'PhySoc IIT Kharagpur', notifOptions);
      }
    }
  };

  // 3. Client-Side iCal Parser Fallback (for static environments)
  function parseIcalFallback(rawText) {
    try {
      const unfolded = rawText.replace(/\r?\n[ \t]/g, '');
      const blocks = unfolded.split('BEGIN:VEVENT');
      const events = [];
      for (let i = 1; i < blocks.length; i++) {
        const b = blocks[i].split('END:VEVENT')[0];
        const getVal = function(key) {
          const m = b.match(new RegExp('^' + key + '[:;](.*?)$', 'm'));
          if (!m) return '';
          let val = m[1];
          if (val.indexOf(';') !== -1 && val.indexOf(':') !== -1) {
            val = val.split(':').slice(1).join(':');
          }
          return val.replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\n/g, ' ').trim();
        };
        const summary = getVal('SUMMARY');
        if (summary) {
          events.push({
            uid: getVal('UID') || String(i),
            title: summary,
            start: getVal('DTSTART'),
            description: getVal('DESCRIPTION'),
            location: getVal('LOCATION'),
            lastModified: getVal('LAST-MODIFIED') || getVal('DTSTAMP')
          });
        }
      }
      return events;
    } catch(e) {
      return [];
    }
  }

  // 4. Format iCal Date
  function formatIcalDate(dt) {
    if (!dt) return '';
    try {
      // Format: YYYYMMDDTHHMMSSZ or VALUE=DATE:YYYYMMDD or YYYYMMDD
      const clean = dt.replace(/^.*:/, '');
      if (clean.length >= 8) {
        const y = clean.substring(0, 4);
        const m = clean.substring(4, 6);
        const d = clean.substring(6, 8);
        return d + '/' + m + '/' + y;
      }
    } catch(e){}
    return '';
  }

  // 5. Automated Real-Time Calendar Sync & Event Detection
  async function syncCalendarAndNotify() {
    let events = [];

    // Try Vercel API endpoint first
    try {
      const res = await fetch('/api/calendar-events');
      if (res.ok) {
        const data = await res.json();
        if (data.events && data.events.length > 0) {
          events = data.events;
        }
      }
    } catch(e) {}

    // Fallback if API was unavailable
    if (events.length === 0) {
      try {
        const icalUrl = 'https://calendar.google.com/calendar/ical/409587cb401864dd7f1f5d6dfd125ad3c3b4bf13018a20940bd4d6809d12ff13%40group.calendar.google.com/public/basic.ics';
        const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(icalUrl);
        const res = await fetch(proxyUrl);
        if (res.ok) {
          const raw = await res.text();
          events = parseIcalFallback(raw);
        }
      } catch(e) {}
    }

    if (events.length === 0) return;

    // Build event fingerprint dictionary: { [uid]: { title, lastModified, desc } }
    const currentFingerprint = {};
    events.forEach(function(ev) {
      currentFingerprint[ev.uid] = {
        title: ev.title,
        lastModified: ev.lastModified || '',
        start: ev.start || '',
        desc: ev.description || ''
      };
    });

    const cachedRaw = localStorage.getItem('physoc_events_cache_v3');

    if (!cachedRaw) {
      // First time user with permissions enabled: notify about the nearest upcoming event
      const upcoming = events[0];
      if (upcoming) {
        const dateStr = formatIcalDate(upcoming.start);
        sendPhySocNotification(
          '📅 PhySoc Event: ' + upcoming.title,
          (dateStr ? 'Date: ' + dateStr + ' • ' : '') + (upcoming.description ? upcoming.description.slice(0, 100) : 'Check website calendar for details!'),
          '/events/index.html'
        );
      }
    } else {
      // Compare against cached fingerprint to detect NEW or MODIFIED events
      try {
        const cached = JSON.parse(cachedRaw);
        let notifiedCount = 0;

        for (let i = 0; i < events.length; i++) {
          const ev = events[i];
          const prev = cached[ev.uid];

          if (!prev) {
            // New event added!
            const dateStr = formatIcalDate(ev.start);
            sendPhySocNotification(
              '🎉 New Event Added: ' + ev.title,
              (dateStr ? 'Date: ' + dateStr + ' • ' : '') + (ev.description ? ev.description.slice(0, 100) : 'New event on PhySoc calendar!'),
              '/events/index.html'
            );
            notifiedCount++;
            break; // Notify 1 at a time to avoid spamming
          } else if (prev.lastModified !== ev.lastModified || prev.title !== ev.title || prev.desc !== ev.description) {
            // Event was updated/modified!
            const dateStr = formatIcalDate(ev.start);
            sendPhySocNotification(
              '🔔 Event Updated: ' + ev.title,
              (dateStr ? 'Date: ' + dateStr + ' • ' : '') + (ev.description ? ev.description.slice(0, 100) : 'Event details updated on calendar!'),
              '/events/index.html'
            );
            notifiedCount++;
            break;
          }
        }
      } catch(e) {}
    }

    // Save latest state
    localStorage.setItem('physoc_events_cache_v3', JSON.stringify(currentFingerprint));
  }

  // 6. Seamless Automatic Permission Request & Real-Time Sync (No annoying popups/tabs!)
  function initLiveNotifications() {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      // Permission already granted: sync events immediately
      syncCalendarAndNotify();
      // Periodically check for event updates every 30 seconds while user is browsing
      setInterval(syncCalendarAndNotify, 30000);
    } else if (Notification.permission === 'default') {
      // Automatically request permission on first user interaction or page load
      const requestSilentPermission = function() {
        Notification.requestPermission().then(function(perm) {
          if (perm === 'granted') {
            syncCalendarAndNotify();
            setInterval(syncCalendarAndNotify, 30000);
          }
        });
        document.removeEventListener('click', requestSilentPermission);
      };
      document.addEventListener('click', requestSilentPermission, { once: true });
      // Also try calling it after 2 seconds
      setTimeout(function() {
        if (Notification.permission === 'default') {
          Notification.requestPermission().then(function(perm) {
            if (perm === 'granted') {
              syncCalendarAndNotify();
              setInterval(syncCalendarAndNotify, 30000);
            }
          }).catch(function(){});
        }
      }, 2000);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    initLiveNotifications();
  });
})();

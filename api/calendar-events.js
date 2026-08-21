// Vercel Serverless Function to fetch and parse Google Calendar iCal feed
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');

  const icalUrl = 'https://calendar.google.com/calendar/ical/409587cb401864dd7f1f5d6dfd125ad3c3b4bf13018a20940bd4d6809d12ff13%40group.calendar.google.com/public/basic.ics';

  try {
    const response = await fetch(icalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/calendar,text/plain,*/*'
      }
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch calendar feed', status: response.status });
    }

    const raw = await response.text();

    // RFC 5545 line unfolding
    const unfolded = raw.replace(/\r?\n[ \t]/g, '');
    const blocks = unfolded.split('BEGIN:VEVENT');
    const events = [];

    for (let i = 1; i < blocks.length; i++) {
      const eventStr = blocks[i].split('END:VEVENT')[0];

      const getVal = (key) => {
        const regex = new RegExp(`^${key}[:;](.*?)$`, 'm');
        const match = eventStr.match(regex);
        if (!match) return '';
        let val = match[1];
        if (val.includes(';') && val.includes(':')) {
          val = val.split(':').slice(1).join(':');
        }
        return val.replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\n/g, ' ').trim();
      };

      const summary = getVal('SUMMARY');
      const dtstart = getVal('DTSTART');
      const dtend = getVal('DTEND');
      const description = getVal('DESCRIPTION');
      const location = getVal('LOCATION');
      const uid = getVal('UID');
      const lastMod = getVal('LAST-MODIFIED') || getVal('DTSTAMP');

      if (summary) {
        events.push({
          uid: uid || String(i),
          title: summary,
          start: dtstart,
          end: dtend,
          description: description,
          location: location,
          lastModified: lastMod
        });
      }
    }

    // Sort events by start date
    events.sort((a, b) => (a.start > b.start ? 1 : -1));

    res.status(200).json({
      success: true,
      count: events.length,
      fetchedAt: new Date().toISOString(),
      events
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

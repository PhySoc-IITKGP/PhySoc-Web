// Vercel Serverless Function to fetch and parse Google Calendar iCal feed
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

  const icalUrl = 'https://calendar.google.com/calendar/ical/409587cb401864dd7f1f5d6dfd125ad3c3b4bf13018a20940bd4d6809d12ff13%40group.calendar.google.com/public/basic.ics';

  try {
    const response = await fetch(icalUrl);
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch calendar feed' });
    }
    const text = await response.text();

    // Simple VEVENT parser
    const events = [];
    const eventBlocks = text.split('BEGIN:VEVENT');
    
    for (let i = 1; i < eventBlocks.length; i++) {
      const block = eventBlocks[i].split('END:VEVENT')[0];
      
      const getField = (prefix) => {
        const regex = new RegExp(^[;:](.*)$, 'm');
        const match = block.match(regex);
        if (!match) return '';
        return match[1].replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\n/g, ' ').trim();
      };

      const summary = getField('SUMMARY');
      const dtstart = getField('DTSTART');
      const description = getField('DESCRIPTION');
      const location = getField('LOCATION');
      const uid = getField('UID');
      const dtstamp = getField('DTSTAMP');

      if (summary) {
        events.push({
          uid,
          title: summary,
          start: dtstart,
          description: description || '',
          location: location || '',
          timestamp: dtstamp || ''
        });
      }
    }

    res.status(200).json({ success: true, count: events.length, events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

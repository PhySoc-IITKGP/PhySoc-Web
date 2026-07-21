// test-supabase-sync.js — Test Supabase connection & schema accessibility
const SUPABASE_URL = 'https://qbgubcicjqkgowxgrmmp.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiZ3ViY2ljanFrZ293eGdybW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNDQzMTksImV4cCI6MjA5ODkyMDMxOX0.U8ILE_4Y89k9K3AQkOgNqDpYunwzDm4jBMWv1yPlE24';

async function testSupabase() {
  console.log("=== Testing Supabase Cloud Connectivity & Table Sync ===");
  console.log("URL:", SUPABASE_URL);

  const tables = ['physoc-resources', 'physoc-announcements', 'physoc-internships', 'physoc-weekly_puzzles'];

  for (const table of tables) {
    try {
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, {
        headers: {
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${SUPABASE_ANON}`
        }
      });

      if (resp.ok) {
        const data = await resp.json();
        console.log(`[PASS] Table "${table}": OK (Status ${resp.status}) - ${data.length} sample records retrieved.`);
      } else {
        const errorText = await resp.text();
        console.log(`[FAIL] Table "${table}": Status ${resp.status} - ${errorText}`);
      }
    } catch (err) {
      console.log(`[ERROR] Table "${table}":`, err.message);
    }
  }
}

testSupabase();

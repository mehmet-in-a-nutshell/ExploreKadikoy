const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data: venues } = await supabase.from('venues').select('id').limit(1);
  const { data: events } = await supabase.from('events').select('id').limit(1);
  const { data: user } = await supabase.auth.admin?.listUsers() || { data: { users: [{ id: 'fc1b9f69-fcf6-4dcd-98b7-60e0aebd678c' }] } };
  
  if (!venues || !events) return console.log('No venue/event data');
  
  const userId = user?.users?.[0]?.id || 'fc1b9f69-fcf6-4dcd-98b7-60e0aebd678c';
  
  // insert ignoring dupes
  await supabase.from('user_favorite_events').upsert({ user_id: userId, event_id: events[0].id });
  
  const { data, error } = await supabase
    .from('user_favorite_events')
    .select(`
        event_id,
        events (
            id, title, slug, date, time, is_free, cover_image,
            venues:venue_id (name),
            categories:category_id (name)
        )
    `)
    .limit(1);
    
  console.log('Events Data:', JSON.stringify(data, null, 2));
}

test();

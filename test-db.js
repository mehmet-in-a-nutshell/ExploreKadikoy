require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data } = await supabase.from('guides').select('slug, content').order('created_at', {ascending: false}).limit(1);
  console.log("Slug:", data[0].slug);
  console.log("Raw Content:", JSON.stringify(data[0].content));
}
check();

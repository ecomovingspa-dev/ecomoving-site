
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLimit() {
    const { data } = await supabase.storage.from('imagenes-marketing').list('catalog', { limit: 100, offset: 10 });
    console.log(`Found ${data?.length} files with offset 10 and limit 100.`);
}

testLimit();

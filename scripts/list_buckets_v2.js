
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listBuckets() {
    console.log('Listing buckets...');
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Buckets:', data.map(b => b.name));
    }
}

listBuckets();

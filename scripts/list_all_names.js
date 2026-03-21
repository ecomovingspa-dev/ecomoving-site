
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllNames() {
    console.log('List of all 100 files in imagenes-marketing/catalog:');
    const { data: files, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalog', { limit: 1000 });

    if (error) {
        console.error('Error:', error);
    } else {
        files.forEach((f, i) => console.log(`${i + 1}. ${f.name}`));
    }
}

listAllNames();

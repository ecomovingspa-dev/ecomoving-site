
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function searchExact() {
    const filename = '0.5520614481899453-1770606002617.webp';
    console.log(`Searching for ${filename} in root...`);
    const { data } = await supabase.storage.from('imagenes-marketing').list('', { search: filename });
    console.log('Results in root:', data);

    console.log(`Searching for ${filename} in catalog...`);
    const { data: data2 } = await supabase.storage.from('imagenes-marketing').list('catalog', { search: filename });
    console.log('Results in catalog:', data2);
}

searchExact();


const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSpecificFile() {
    const filename = '0.5520614481899453-1770606002617.webp';
    console.log(`Checking if ${filename} exists in catalog folder...`);
    const { data, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalog', { limit: 1, offset: 0, search: filename });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Found:', data.length > 0 ? 'YES' : 'NO');
        if (data.length > 0) console.log(data[0]);
    }
}

checkSpecificFile();

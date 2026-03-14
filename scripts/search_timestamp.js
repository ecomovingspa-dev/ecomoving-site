
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function searchAllCatalog() {
    console.log('Searching for "1770606002617" in catalog folder...');
    const { data: files, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalog', { limit: 1000 });

    if (error) {
        console.error('Error:', error);
    } else {
        const found = files.filter(f => f.name.includes('1770606002617'));
        console.log(`Found: ${found.length}`);
        found.forEach(f => console.log(`- ${f.name}`));
    }
}

searchAllCatalog();

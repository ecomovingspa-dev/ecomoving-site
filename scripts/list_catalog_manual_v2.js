
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listCatalogManual() {
    console.log('Listing files in imagenes-marketing/catalog-manual...');
    const { data: files, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalog-manual', { limit: 1000 });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(`Total files in catalog-manual: ${files.length}`);
        const targets = [
            '0.5520614481899453-1770606002617.webp',
            '0.5971665099596954-1770606008310.webp',
            '0.7423854191392683-1770606013661.webp'
        ];
        files.forEach(f => {
            if (targets.includes(f.name)) {
                console.log(`FOUND TARGET: ${f.name} in catalog-manual`);
            }
        });

        // Sample some files to see the prefix
        console.log('First 5 files:');
        files.slice(0, 5).forEach(f => console.log(`- ${f.name}`));
    }
}

listCatalogManual();

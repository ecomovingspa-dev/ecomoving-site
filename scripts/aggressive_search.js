
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findYamaInCatalog() {
    console.log('Fetching ALL files from imagenes-marketing/catalog...');
    const { data: files, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalog', { limit: 1000 });

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Total files in catalog: ${files.length}`);
    const targets = [
        '0.5520614481899453-1770606002617.webp',
        '0.5971665099596954-1770606008310.webp',
        '0.7423854191392683-1770606013661.webp'
    ];

    files.forEach(f => {
        if (targets.includes(f.name)) {
            console.log(`FOUND TARGET: ${f.name}`);
        }
    });

    // If not found, maybe they are in 'catalogo'? 
    // The user said "catalogo folder"
    console.log('Fetching ALL files from imagenes-marketing/catalogo...');
    const { data: files2 } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalogo', { limit: 1000 });

    if (files2) {
        console.log(`Total files in catalogo: ${files2.length}`);
        files2.forEach(f => {
            if (targets.includes(f.name)) {
                console.log(`FOUND TARGET in catalogo: ${f.name}`);
            }
        });
    }
}

findYamaInCatalog();

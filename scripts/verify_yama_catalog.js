
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyYamaInCatalog() {
    const filenames = [
        '0.5520614481899453-1770606002617.webp',
        '0.5971665099596954-1770606008310.webp',
        '0.7423854191392683-1770606013661.webp',
        '0.13329241512808726-1770606018318.webp',
        '0.8974514028394102-1770606023555.webp',
        '0.4561234123123123-1770606028123.webp' // Just guessing
    ];

    console.log('Checking catalog folder for YAMA files...');
    const { data: files } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalog', { limit: 1000 });

    const found = files.filter(f => filenames.includes(f.name));
    console.log(`Found ${found.length} of ${filenames.length} files in catalog.`);
    found.forEach(f => console.log(`- ${f.name}`));
}

verifyYamaInCatalog();

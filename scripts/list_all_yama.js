
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllFiles() {
    console.log('Listing ALL files in imagenes-marketing/catalog...');
    const { data: files, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalog', { limit: 1000 });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(`Found ${files.length} files in catalog`);
        const yamaLikely = files.filter(f => f.name.includes('YAMA'));
        if (yamaLikely.length > 0) {
            console.log('Likely YAMA files in catalog:');
            yamaLikely.forEach(f => console.log(`- ${f.name}`));
        } else {
            console.log('No YAMA in filenames.');
        }
    }

    console.log('Listing ALL files in imagenes-marketing/catalogo (with O)...');
    const { data: files2, error: error2 } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalogo', { limit: 1000 });

    if (error2) {
        console.error('Error:', error2);
    } else {
        console.log(`Found ${files2.length} files in catalogo`);
        const yamaLikely2 = files2.filter(f => f.name.includes('YAMA'));
        if (yamaLikely2.length > 0) {
            console.log('Likely YAMA files in catalogo:');
            yamaLikely2.forEach(f => console.log(`- ${f.name}`));
        }
    }
}

listAllFiles();

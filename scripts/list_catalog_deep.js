
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listCatalogDeep() {
    console.log('Recursive list of catalog folder in imagenes-marketing...');
    const { data: files, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalog', { limit: 1000, recursive: true });

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Total files found recursively: ${files.length}`);
    const targets = ['0.5520', '0.5971', '0.7423'];
    files.forEach(f => {
        targets.forEach(t => {
            if (f.name.includes(t)) console.log(`FOUND! ${f.name}`);
        });
    });
}

listCatalogDeep();

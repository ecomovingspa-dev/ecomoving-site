
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportCatalogFiles() {
    const { data: files, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalog', { limit: 1000 });

    if (error) {
        console.error('Error:', error);
        return;
    }

    fs.writeFileSync('catalog_files.json', JSON.stringify(files.map(f => f.name), null, 2));
    console.log(`Exported ${files.length} filenames to catalog_files.json`);
}

exportCatalogFiles();

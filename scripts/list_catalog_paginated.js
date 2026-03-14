
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllCatalog() {
    let allFiles = [];
    let offset = 0;
    const limit = 100;

    console.log('Starting paginated list of "catalog"...');

    while (true) {
        const { data, error } = await supabase.storage
            .from('imagenes-marketing')
            .list('catalog', { limit, offset });

        if (error) {
            console.error('Error:', error);
            break;
        }

        if (data.length === 0) break;

        allFiles = allFiles.concat(data);
        console.log(`Fetched ${data.length} files (total: ${allFiles.length})`);

        if (data.length < limit) break;
        offset += limit;
    }

    fs.writeFileSync('catalog_files_full.json', JSON.stringify(allFiles.map(f => f.name), null, 2));
    console.log(`Exported ${allFiles.length} filenames to catalog_files_full.json`);
}

listAllCatalog();


const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getAllCatalogFiles() {
    let allFiles = [];
    let offset = 0;
    const limit = 100;

    console.log('Fetching ALL files from "catalog" folder...');

    while (true) {
        const { data, error } = await supabase.storage
            .from('imagenes-marketing')
            .list('catalog', { limit, offset });

        if (error) {
            console.error('Error:', error);
            break;
        }

        if (!data || data.length === 0) break;

        allFiles = allFiles.concat(data);
        console.log(`Fetched ${data.length} items (Total: ${allFiles.length})`);

        if (data.length < limit) break;
        offset += limit;
    }

    console.log(`Done. Total unique files in "catalog": ${allFiles.length}`);
    fs.writeFileSync('catalog_full_list.json', JSON.stringify(allFiles.map(f => f.name), null, 2));
}

getAllCatalogFiles();

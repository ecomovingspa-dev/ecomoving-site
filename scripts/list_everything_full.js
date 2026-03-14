
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listEverythingFull() {
    let allItems = [];
    let offset = 0;
    const limit = 100;

    console.log('Fetching EVERY SINGLE item from "imagenes-marketing" recursively...');

    while (true) {
        const { data, error } = await supabase.storage
            .from('imagenes-marketing')
            .list('', { limit, offset, recursive: true });

        if (error) {
            console.error('Error:', error);
            break;
        }

        if (!data || data.length === 0) break;

        allItems = allItems.concat(data);
        console.log(`Fetched ${data.length} items (Total: ${allItems.length})`);

        if (data.length < limit) break;
        offset += limit;
    }

    console.log(`Done. Total items: ${allItems.length}`);
    fs.writeFileSync('every_single_storage_item.json', JSON.stringify(allItems.map(f => f.name), null, 2));
}

listEverythingFull();

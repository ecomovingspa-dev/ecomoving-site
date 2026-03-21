
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function deepScan() {
    const buckets = ['catalog-manual', 'catalog-live', 'stocksur', 'catalogo-manual', 'catalogo-live'];
    for (const b of buckets) {
        console.log(`\nChecking bucket: ${b}`);
        const { data, error } = await supabase.storage.from(b).list('', { recursive: true, limit: 100 });
        if (error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.log(`Found ${data.length} files.`);
            if (data.length > 0) {
                console.log('Sample:', data[0].name);
                const yama = data.find(f => f.name.includes('0.5520'));
                if (yama) console.log(`!!! YAMA FOUND IN ${b}/${yama.name} !!!`);
            }
        }
    }
}

deepScan();

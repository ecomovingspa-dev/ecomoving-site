
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function bruteForceBuckets() {
    const guesses = [
        'marketing', 'catalog', 'catalogo', 'products', 'productos', 'assets', 'images', 'imagenes',
        'public', 'storage', 'web', 'site', 'ecomoving', 'zecat', 'stocksur', 'premium',
        'backup', 'buffer', 'temp', 'uploads', 'manual', 'live', 'prod', 'production',
        'catalog-manual', 'catalog-live', 'catalogo-manual', 'catalogo-live',
        'marketing-assets', 'web-assets', 'product-images'
    ];

    console.log(`Brute forcing ${guesses.length} bucket names...`);

    for (const b of guesses) {
        const { data, error } = await supabase.storage.from(b).list('', { limit: 1 });
        if (!error) {
            console.log(`[FOUND] Bucket: ${b}`);
            const { data: files } = await supabase.storage.from(b).list('', { recursive: true, limit: 100 });
            console.log(`  Items: ${files?.length || 0}`);
            if (files && files.length > 0) {
                console.log(`  Sample: ${files[0].name}`);
                if (JSON.stringify(files).includes('0.5520')) console.log(`  !!! YAMA FOUND IN ${b} !!!`);
            }
        }
    }
}

bruteForceBuckets();


const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function guessBuckets() {
    const bucketGuesses = ['catalogo', 'catalog', 'productos', 'assets', 'public', 'web', 'imagenes'];
    for (const b of bucketGuesses) {
        console.log(`Checking bucket: ${b}...`);
        const { data, error } = await supabase.storage.from(b).list('', { limit: 1 });
        if (error) {
            // console.log(`- Bucket ${b} not found or inaccessible.`);
        } else {
            console.log(`- Bucket ${b} FOUND!`);
            const { data: allFiles } = await supabase.storage.from(b).list('', { recursive: true });
            console.log(`  Contains ${allFiles?.length || 0} items.`);
        }
    }
}

guessBuckets();

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteCatalog() {
    let hasMore = true;
    let iterations = 0;
    while (hasMore) {
        iterations++;
        console.log(`[Iteración ${iterations}] Fetching files in imagenes-marketing/catalog...`);
        const { data: files, error } = await supabase.storage
            .from('imagenes-marketing')
            .list('catalog', { limit: 1000 });

        if (error) {
            console.error('Error fetching:', error);
            hasMore = false;
            return;
        }

        if (files && files.length > 0) {
            const filePaths = files.map(f => `catalog/${f.name}`);
            console.log(`Deleting ${filePaths.length} files...`);
            const { error: delError } = await supabase.storage.from('imagenes-marketing').remove(filePaths);
            if (delError) {
                console.error('Error deleting files:', delError);
                hasMore = false;
            } else {
                console.log(`Deleted ${filePaths.length} items from catalog folder.`);
            }
        } else {
            console.log('catalog folder is empty or not found');
            hasMore = false;
        }
    }
}

deleteCatalog();

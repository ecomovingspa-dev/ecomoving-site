
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function deepList() {
    console.log('Deep listing folders in imagenes-marketing...');
    await listRecursive('');
}

async function listRecursive(folder) {
    const { data: items, error } = await supabase.storage
        .from('imagenes-marketing')
        .list(folder, { limit: 1000 });

    if (error) return;

    for (const item of items) {
        if (!item.id) { // Folder
            const path = folder ? `${folder}/${item.name}` : item.name;
            console.log(`[FOLDER] ${path}`);
            await listRecursive(path);
        }
    }
}

deepList();

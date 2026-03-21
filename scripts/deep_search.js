
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findFileEverywhere(filename) {
    console.log(`Searching for ${filename} in all folders of imagenes-marketing...`);
    await searchRecursive('', filename);
}

async function searchRecursive(folder, filename) {
    const { data, error } = await supabase.storage.from('imagenes-marketing').list(folder, { limit: 100 });
    if (error) return;

    for (const item of data) {
        if (item.id) { // File
            if (item.name === filename) {
                console.log(`FOUND! Path: imagenes-marketing/${folder}${item.name}`);
            }
        } else { // Folder
            await searchRecursive(`${folder}${item.name}/`, filename);
        }
    }
}

// Search for YAMA main image
findFileEverywhere('0.5520614481899453-1770606002617.webp');

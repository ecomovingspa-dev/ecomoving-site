
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSpecificFile() {
    const filename = '0.5520614481899453-1770606002617.webp';
    console.log(`Checking if ${filename} exists in catalog folder...`);
    const { data: files, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalog', { limit: 1000 });

    if (error) {
        console.error('Error:', error);
        return;
    }

    const found = files.find(f => f.name === filename);
    if (found) {
        console.log('FOUND! in catalog folder.');
    } else {
        console.log('NOT FOUND in catalog folder.');
        // Try other folders just in case
        console.log('Checking other folders...');
        const folders = ['grilla', 'hero', 'marketing'];
        for (const folder of folders) {
            const { data } = await supabase.storage.from('imagenes-marketing').list(folder);
            if (data && data.find(f => f.name === filename)) {
                console.log(`FOUND! in ${folder} folder.`);
            }
        }
    }
}

checkSpecificFile();

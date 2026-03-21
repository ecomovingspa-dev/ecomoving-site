
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findSKUFiles() {
    console.log('Searching for "T763" in all folders...');
    const folders = ['catalog', 'grilla', 'hero', 'marketing', ''];
    for (const folder of folders) {
        const { data, error } = await supabase.storage.from('imagenes-marketing').list(folder, { limit: 1000 });
        if (data) {
            const found = data.filter(f => f.name.includes('T763'));
            if (found.length > 0) {
                console.log(`Found in [${folder}]:`);
                found.forEach(f => console.log(`- ${f.name}`));
            }
        }
    }
}

findSKUFiles();

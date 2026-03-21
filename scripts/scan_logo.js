
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function scanLogo() {
    console.log('Scanning ALL folders in logotipo_ecomoving recursively...');
    const result = [];
    await scanFolder('', result);
    console.log(`Total files found: ${result.length}`);
    result.forEach(f => console.log(`- ${f}`));
}

async function scanFolder(path, result) {
    const { data, error } = await supabase.storage.from('logotipo_ecomoving').list(path, { limit: 1000 });
    if (error) return;

    for (const item of data) {
        const fullPath = path ? `${path}/${item.name}` : item.name;
        if (item.id) { // File
            result.push(fullPath);
        } else { // Folder
            await scanFolder(fullPath, result);
        }
    }
}

scanLogo();

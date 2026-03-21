
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function scanEverything() {
    console.log('Scanning ALL folders in imagenes-marketing recursively...');
    const result = [];
    await scanFolder('', result);
    console.log(`Total files found: ${result.length}`);
    const yama = result.filter(f => f.toLowerCase().includes('yama'));
    if (yama.length > 0) {
        console.log('YAMA FILES FOUND:');
        yama.forEach(f => console.log(`- ${f}`));
    } else {
        console.log('No YAMA files in storage paths.');
    }

    // List some random files to see typical names
    console.log('Sample files:');
    result.slice(0, 10).forEach(f => console.log(`- ${f}`));
}

async function scanFolder(path, result) {
    const { data, error } = await supabase.storage.from('imagenes-marketing').list(path, { limit: 1000 });
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

scanEverything();

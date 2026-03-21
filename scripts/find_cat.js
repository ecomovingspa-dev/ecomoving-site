
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findCatFolders() {
    console.log('Searching for folders starting with "cat" in imagenes-marketing...');
    const { data, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('', { limit: 100 });

    if (error) {
        console.error('Error:', error);
        return;
    }

    const catFolders = data.filter(item => !item.id && item.name.toLowerCase().startsWith('cat'));
    console.log('Found folders:', catFolders.map(f => f.name));

    for (const folder of catFolders) {
        console.log(`Listing ${folder.name}...`);
        const { data: files } = await supabase.storage
            .from('imagenes-marketing')
            .list(folder.name, { limit: 10 });
        console.log(`- ${folder.name} has ${files.length} items.`);
        files.forEach(f => console.log(`  - ${f.name}`));
    }
}

findCatFolders();

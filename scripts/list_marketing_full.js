
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listFolders() {
    console.log('Listing ALL items in root of imagenes-marketing (no limit)...');
    const { data: items, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('', { limit: 1000 });

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Folders found:');
    items.filter(i => !i.id).forEach(f => console.log(`- [FOLDER] ${f.name}`));

    console.log('Files found:');
    items.filter(i => i.id).forEach(f => console.log(`- [FILE] ${f.name}`));
}

listFolders();

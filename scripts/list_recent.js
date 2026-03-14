
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listMostRecent() {
    console.log('Listing 20 most recent files in imagenes-marketing/catalog...');
    const { data: files, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalog', { limit: 20, sortBy: { column: 'created_at', order: 'desc' } });

    if (error) {
        console.error('Error:', error);
    } else {
        files.forEach(f => console.log(`- ${f.name} (${f.created_at})`));
    }

    console.log('\nListing root of imagenes-marketing (recent)...');
    const { data: rootFiles } = await supabase.storage
        .from('imagenes-marketing')
        .list('', { limit: 20, sortBy: { column: 'created_at', order: 'desc' } });
    rootFiles.forEach(f => console.log(`- ${f.name} (${f.created_at})`));
}

listMostRecent();


const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listByName() {
    console.log('Listing all files in "catalog" sorted by name...');
    const { data: files, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalog', {
            limit: 1000,
            sortBy: { column: 'name', order: 'asc' }
        });

    if (error) {
        console.error('Error:', error);
        return;
    }

    files.forEach(f => {
        if (f.name.startsWith('0.5')) console.log(`- ${f.name}`);
    });
    console.log('Finished listing files starting with 0.5');
}

listByName();

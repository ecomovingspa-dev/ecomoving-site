
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listRecentCatalog2() {
    console.log('Listing files 51-100 in "catalog" folder...');
    const { data: files, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalog', {
            limit: 50,
            offset: 50,
            sortBy: { column: 'created_at', order: 'desc' }
        });

    if (error) {
        console.error('Error:', error);
        return;
    }

    files.forEach(f => {
        console.log(`- ${f.name} (${f.created_at})`);
    });
}

listRecentCatalog2();

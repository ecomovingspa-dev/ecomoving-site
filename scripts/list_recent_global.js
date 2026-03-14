
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listRecentGlobal() {
    console.log('Listing 50 most recent files in imagenes-marketing (global)...');
    const { data: files, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('', {
            limit: 50,
            sortBy: { column: 'created_at', order: 'desc' },
            recursive: true
        });

    if (error) {
        console.error('Error:', error);
        return;
    }

    files.forEach(f => {
        console.log(`- ${f.name} (${f.created_at})`);
    });
}

listRecentGlobal();

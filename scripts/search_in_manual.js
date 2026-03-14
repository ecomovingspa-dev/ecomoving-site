
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function searchInManual() {
    console.log('Searching for 0.0135 in catalog-manual...');
    const { data, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalog-manual', { search: '0.0135' });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Results:', data);
    }
}

searchInManual();

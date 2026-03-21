
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listReal() {
    console.log('Listing files in imagenes-marketing/catalogo (no accent)...');
    const { data, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalogo', { limit: 100 });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Files in imagenes-marketing/catalogo:', data.length);
        data.forEach(f => console.log(`- ${f.name}`));
    }
}

listReal();

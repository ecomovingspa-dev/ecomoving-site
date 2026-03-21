
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listCatalogo() {
    console.log('Listing files in marketing/catalogo...');
    const { data, error } = await supabase.storage
        .from('marketing')
        .list('catalogo', { limit: 100 });

    if (error) {
        console.error('Error listing marketing/catalogo:', error);
    } else {
        console.log('Files in marketing/catalogo:', data.length);
        data.slice(0, 10).forEach(f => console.log(`- ${f.name}`));
    }

    // Try another likely bucket
    console.log('Listing files in logotipo_ecomoving/catalogo...');
    const { data: data2, error: error2 } = await supabase.storage
        .from('logotipo_ecomoving')
        .list('catalogo', { limit: 100 });

    if (error2) {
        console.error('Error listing logotipo_ecomoving/catalogo:', error2);
    } else {
        console.log('Files in logotipo_ecomoving/catalogo:', data2.length);
        data2.slice(0, 10).forEach(f => console.log(`- ${f.name}`));
    }
}

listCatalogo();

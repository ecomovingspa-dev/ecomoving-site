
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCatalogo() {
    console.log('Checking folder "catalogo" (with o)...');
    const { data, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalogo', { limit: 1000 });

    if (error) {
        console.log('Error or not found:', error.message);
    } else {
        console.log(`Found ${data.length} items in "catalogo".`);
        data.forEach(f => console.log(`- ${f.name}`));
    }
}

checkCatalogo();

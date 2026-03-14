
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function scanLogoBucket() {
    console.log('Listing root of logotipo_ecomoving...');
    const { data, error } = await supabase.storage.from('logotipo_ecomoving').list('', { limit: 1000 });
    if (error) {
        console.error('Error:', error);
    } else {
        console.log(`Found ${data.length} items.`);
        data.forEach(i => console.log(`- ${i.name} (${i.id ? 'file' : 'folder'})`));
    }
}

scanLogoBucket();

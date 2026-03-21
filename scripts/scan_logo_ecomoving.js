
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function scanLogoEcomoving() {
    console.log('Listing root of logo_ecomoving bucket...');
    const { data, error } = await supabase.storage.from('logo_ecomoving').list('', { limit: 1000 });
    if (error) {
        console.log('Error:', error.message);
    } else {
        console.log(`Found ${data.length} items.`);
        data.forEach(i => console.log(`- ${i.name} (${i.id ? 'file' : 'folder'})`));
    }
}

scanLogoEcomoving();


const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listManualBucket() {
    console.log('Listing files in bucket "catalog-manual"...');
    const { data: files, error } = await supabase.storage
        .from('catalog-manual')
        .list('', { limit: 1000 });

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log(`Found ${files.length} items in bucket root.`);
    files.forEach(f => console.log(`- ${f.name}`));
}

listManualBucket();

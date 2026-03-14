
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAccentBucket() {
    const b = 'imágenes-marketing';
    console.log(`Checking bucket: ${b}...`);
    const { data, error } = await supabase.storage.from(b).list('', { limit: 10 });
    if (error) {
        console.log(`- Bucket ${b} not found: ${error.message}`);
    } else {
        console.log(`- Bucket ${b} FOUND!`);
        console.log(data);
    }
}

checkAccentBucket();

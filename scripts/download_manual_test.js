
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function downloadManual() {
    const bucket = 'imagenes-marketing';
    const path = 'catalog-manual/0.4451400015735475-1770483818862.webp';

    console.log(`Attempting to download ${path} from ${bucket}...`);
    const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('SUCCESS! Size:', data.size);
    }
}

downloadManual();

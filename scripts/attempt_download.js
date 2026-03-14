
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function attemptDownload() {
    const filename = 'catalog-manual/0.5520614481899453-1770606002617.webp';
    console.log(`Attempting to download ${filename} from imagenes-marketing...`);
    const { data, error } = await supabase.storage
        .from('imagenes-marketing')
        .download(filename);

    if (error) {
        console.error('Download Error:', error.message);
    } else {
        console.log('DOWNLOAD SUCCESS! Size:', data.size);
    }
}

attemptDownload();

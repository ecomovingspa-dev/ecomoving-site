
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function searchPartial() {
    console.log('Searching for YAMA fragments in ALL catalog files...');
    const { data: files, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('catalog', { limit: 1000 });

    if (error) {
        console.error('Error:', error);
        return;
    }

    const fragments = ['0.5520', '0.5971', '0.7423'];
    files.forEach(f => {
        fragments.forEach(frag => {
            if (f.name.includes(frag)) {
                console.log(`FOUND! ${frag} -> catalog/${f.name}`);
            }
        });
    });

    console.log(`Finished searching 100 files.`);
}

searchPartial();

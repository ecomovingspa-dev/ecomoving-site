
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function searchID() {
    console.log('Searching for ID 0.5520 in web_contenido...');
    const { data, error } = await supabase
        .from('web_contenido')
        .select('*');

    if (error) {
        console.error('Error:', error);
        return;
    }

    data.forEach(row => {
        if (JSON.stringify(row).includes('0.5520')) {
            console.log(`Found in section: ${row.section}`);
            console.log(JSON.stringify(row.content, null, 2).slice(0, 1000));
        }
    });
}

searchID();

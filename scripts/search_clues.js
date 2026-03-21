
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function searchWebContenido() {
    console.log('Searching web_contenido for "YAMA" or "backup"...');
    const { data, error } = await supabase
        .from('web_contenido')
        .select('*');

    if (error) {
        console.error('Error:', error);
        return;
    }

    const found = data.filter(row => JSON.stringify(row).includes('YAMA') || JSON.stringify(row).includes('catalogo'));
    console.log(`Found ${found.length} rows.`);
    found.forEach(row => {
        console.log(`- Section: ${row.section}`);
        // console.log(JSON.stringify(row.content, null, 2).slice(0, 500));
    });
}

searchWebContenido();

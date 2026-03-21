
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWebContenido() {
    const { data, error } = await supabase
        .from('web_contenido')
        .select('*');

    if (error) {
        console.error('Error:', error);
        return;
    }

    data.forEach(row => {
        const str = JSON.stringify(row);
        if (str.includes('YAMA')) {
            console.log(`Found YAMA in section: ${row.section}`);
            console.log(JSON.stringify(row.content, null, 2));
        }
    });
}

checkWebContenido();

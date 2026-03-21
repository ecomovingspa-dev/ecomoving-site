
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMarketingTable() {
    console.log('Checking marketing table for YAMA...');
    const { data, error } = await supabase
        .from('marketing')
        .select('*')
        .ilike('asunto', '%YAMA%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${data.length} records.`);
    data.forEach(r => {
        console.log(`- Asunto: ${r.asunto}`);
        console.log(`  Imagen: ${r.imagen_url}`);
    });
}

checkMarketingTable();

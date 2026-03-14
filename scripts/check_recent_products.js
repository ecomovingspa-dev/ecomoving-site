
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRecentProducts() {
    console.log('Checking recently created products...');
    const { data, error } = await supabase
        .from('productos')
        .select('nombre, imagen_principal, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error:', error);
    } else {
        data.forEach(p => console.log(`- ${p.nombre} (${p.created_at}): ${p.imagen_principal}`));
    }
}

checkRecentProducts();

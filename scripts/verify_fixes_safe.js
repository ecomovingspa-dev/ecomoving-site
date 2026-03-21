
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyFixesSafe() {
    console.log('Verifying fixed products (safe search)...');
    const { data, error } = await supabase
        .from('productos')
        .select('nombre, imagen_principal')
        .or('nombre.ilike.%CHALTEN%,nombre.ilike.%LEGACY%,nombre.ilike.%KANSAS%,nombre.ilike.%MICHIGAN%,nombre.ilike.%PAMPA%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    data.forEach(p => {
        console.log(`- ${p.nombre}: ${p.imagen_principal}`);
    });
}

verifyFixesSafe();

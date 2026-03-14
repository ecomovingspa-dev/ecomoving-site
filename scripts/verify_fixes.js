
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyFixes() {
    const names = [
        'Jarro térmico "CHALTEN" 400ml',
        'Set de asado 3 piezas "LEGACY"',
        'Set de asado 4 piezas "KANSAS"',
        'Jarro térmico "MICHIGAN"',
        'Set BBQ 5 elementos',
        'Set de asado "PAMPA"'
    ];

    console.log('Verifying fixed products...');
    const { data, error } = await supabase
        .from('productos')
        .select('nombre, imagen_principal')
        .in('nombre', names);

    if (error) {
        console.error('Error:', error);
        return;
    }

    data.forEach(p => {
        console.log(`- ${p.nombre}: ${p.imagen_principal}`);
    });
}

verifyFixes();

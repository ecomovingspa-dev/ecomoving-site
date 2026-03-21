
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findYama() {
    console.log('Searching for "YAMA"...');
    const { data: products, error } = await supabase
        .from('productos')
        .select('*')
        .ilike('nombre', '%YAMA%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (products && products.length > 0) {
        products.forEach(p => {
            console.log(`- ${p.nombre} (SKU: ${p.sku})`);
            console.log(`  Imagen principal: ${p.imagen_principal}`);
            console.log(`  Assets galeria:`, JSON.stringify(p.assets_galeria, null, 2));
        });
    } else {
        console.log('YAMA not found.');
    }
}

findYama();


const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkYamaGaleria() {
    const { data: product, error } = await supabase
        .from('productos')
        .select('*')
        .ilike('nombre', '%YAMA%')
        .single();

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Product: ${product.nombre}`);
    console.log(`Imagen Principal: ${product.imagen_principal}`);
    console.log(`Galeria:`, JSON.stringify(product.imagenes_galeria, null, 2));
}

checkYamaGaleria();

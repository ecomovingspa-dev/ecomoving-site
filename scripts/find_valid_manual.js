
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findValidManual() {
    console.log('Searching for valid catalog-manual products...');
    const { data: prods, error } = await supabase
        .from('productos')
        .select('nombre, imagen_principal')
        .ilike('imagen_principal', '%catalog-manual/%')
        .limit(10);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${prods.length} products.`);
    prods.forEach(p => {
        console.log(`- ${p.nombre}: ${p.imagen_principal}`);
    });
}

findValidManual();

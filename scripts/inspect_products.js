
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Go up one level to find .env.local from scripts/
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. check .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectProducts() {
    console.log('Fetching products...');
    const { data: products, error } = await supabase
        .from('productos')
        .select('*')
        .limit(10);

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    if (products && products.length > 0) {
        console.log('Sample product columns:', Object.keys(products[0]));
        products.forEach(p => {
            console.log(`- ${p.nombre} (SKU: ${p.sku})`);
            console.log(`  Imagen principal: ${p.imagen_principal || 'N/A'}`);
            console.log(`  Assets galeria:`, p.assets_galeria);
        });
    } else {
        console.log('No products found.');
    }
}

inspectProducts();

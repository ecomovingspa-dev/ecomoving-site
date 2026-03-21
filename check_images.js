require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findImages() {
    const { data: productos } = await supabase.from('productos').select('nombre, imagen_principal');

    let manual = 0;
    let live = 0;
    let others = 0;

    console.log("TOTAL PRODUCTOS: " + productos.length);

    productos.forEach(p => {
        const img = p.imagen_principal || '';
        if (img.includes('catalog-manual')) manual++;
        else if (img.includes('catalog-live')) live++;
        else others++;

        if (manual + live + others <= 40) {
            console.log(`- ${p.nombre}: ${img}`);
        }
    });

    console.log("\nRESUMEN:");
    console.log("Catalog-Manual: " + manual);
    console.log("Catalog-Live: " + live);
    console.log("Otros: " + others);
}

findImages();

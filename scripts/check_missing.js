
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkMissingImages() {
    const { data, error } = await supabase
        .from('productos')
        .select('id, nombre, sku_externo, imagen_principal')
        .ilike('imagen_principal', '%placeholder%'); // Often placeholders or null

    if (error) {
        console.error('Error:', error);
        return;
    }

    // Also check null/empty
    const { data: dataNull } = await supabase
        .from('productos')
        .select('id, nombre, sku_externo, imagen_principal')
        .or('imagen_principal.is.null,imagen_principal.eq.""');

    const all = [...(data || []), ...(dataNull || [])];
    console.log(`Found ${all.length} products with missing/placeholder images.`);
    console.log(JSON.stringify(all.slice(0, 10), null, 2));
}

checkMissingImages();

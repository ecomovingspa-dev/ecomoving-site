
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const FIXABLE_MAP = {
    "c9d4cc39-282c-4601-974e-d91249b45bd1": "0.11923705459178058-1770447294806.webp", // CAPSUL
    "b1a104e4-192f-466e-820f-decbbce5b95b": "0.09770259721258667-1770583231063.webp", // SASHA
    "d2b34119-fe61-45a3-95c1-db56d17446ea": "0.13055207215637343-1770446612357.webp", // DIANA
    "84fb7eca-66a5-4df9-a105-f882ed7dbb3b": "0.010301406522819412-1770605827277.webp", // SUZU
    "e3fb4e59-4b0c-4e96-b97c-bb76d524a14b": "0.07322804492521162-1770473949027.webp", // MEGA 1
    "8688009c-f925-4866-ba52-91363203b1dc": "0.013597663831533602-1770478198014.webp"  // NORI
};

async function fixFixable() {
    console.log('Repairing 6 products with verified storage paths...');

    for (const [id, filename] of Object.entries(FIXABLE_MAP)) {
        const newUrl = `${supabaseUrl}/storage/v1/object/public/imagenes-marketing/catalog/${filename}`;

        console.log(`Updating product ${id} with image ${filename}...`);

        const { error } = await supabase
            .from('productos')
            .update({ imagen_principal: newUrl })
            .eq('id', id);

        if (error) {
            console.error(`Error updating ${id}:`, error.message);
        } else {
            console.log(`Success!`);
        }
    }
}

fixFixable();

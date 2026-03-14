
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findCorrupted() {
    console.log('Searching for corrupted paths...');
    const { data, error } = await supabase
        .from('productos')
        .select('id, nombre, imagen_principal, features')
        .or('imagen_principal.ilike.%catalog-manual%,features.cs.{"age/v1/object/public/imagenes-marketing/catalog-manual/"}')
        .limit(20);

    if (error) {
        // Fallback search since 'cs' for array contains might be tricky with partial strings
        const { data: allData, error: allErr } = await supabase
            .from('productos')
            .select('id, nombre, imagen_principal, features');

        if (allErr) {
            console.error('Error:', allErr);
            return;
        }

        const corrupted = allData.filter(p =>
            (p.imagen_principal && p.imagen_principal.includes('catalog-m')) ||
            (p.features && p.features.some(f => f && f.includes('catalog-m')))
        );

        console.log(`Found ${corrupted.length} potentially corrupted products.`);
        corrupted.forEach(p => console.log(`- ${p.nombre} (${p.id})`));
    } else {
        console.log(`Found ${data.length} corrupted products via direct query.`);
        data.forEach(p => console.log(`- ${p.nombre} (${p.id})`));
    }
}

findCorrupted();

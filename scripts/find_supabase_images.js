
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findSupabaseImages() {
    console.log('Searching for products with Supabase images...');
    const { data, error } = await supabase
        .from('productos')
        .select('nombre, imagen_principal')
        .filter('imagen_principal', 'ilike', '%supabase%')
        .limit(10);

    if (error) {
        console.error('Error:', error);
    } else {
        data.forEach(p => console.log(`- ${p.nombre}: ${p.imagen_principal}`));
    }
}

findSupabaseImages();

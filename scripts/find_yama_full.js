
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findYamaFull() {
    console.log('Searching for "YAMA" including gallery...');
    const { data, error } = await supabase
        .from('productos')
        .select('id, nombre, imagen_principal, imagenes_galeria, features')
        .ilike('nombre', '%YAMA%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(JSON.stringify(data, null, 2));
}

findYamaFull();


const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkYamaGaleria() {
    console.log('Checking YAMA gallery...');
    const { data, error } = await supabase
        .from('productos')
        .select('id, nombre, imagen_principal, imagenes_galeria')
        .ilike('nombre', '%YAMA%')
        .single();

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('ID:', data.id);
    console.log('Nombre:', data.nombre);
    console.log('Principal:', data.imagen_principal);
    console.log('Galeria:', data.imagenes_galeria);
}

checkYamaGaleria();

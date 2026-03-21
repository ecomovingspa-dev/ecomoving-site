
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Cargar .env.local manualmente
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetToInfiniteGrid() {
    console.log('--- INICIANDO RESET A LIENZO INFINITO (CLEAN SLATE) ---');

    // 1. Estructura vacía para el Lienzo Infinito
    const cleanSlateSections = [
        {
            id: 'infinite_grid',
            order: 1,
            title1: 'LIENZO INFINITO',
            paragraph1: 'Grid maestra de 24 columnas.',
            bgColor: '#0a0a0a',
            blocks: [] // ARRAY VACÍO: Cero contenido, cero ejemplos.
        }
    ];

    // 2. Actualizar la fila correspondiente a 'sections' en 'web_contenido'
    console.log("Buscando fila con section = 'sections'...");

    const { data: currentData, error: fetchError } = await supabase
        .from('web_contenido')
        .select('id')
        .eq('section', 'sections') // Clave correcta para identificar el bloque de secciones
        .single();

    if (fetchError || !currentData) {
        console.error('Error buscando fila "sections":', fetchError);
        // Si no existe, podríamos crearla, pero asumiremos que existe
        return;
    }

    const targetId = currentData.id;
    console.log(`Objetivo encontrado: ID ${targetId}`);

    // 3. Sobrescribir la columna 'content' con el array de secciones limpio
    const { error: updateError } = await supabase
        .from('web_contenido')
        .update({
            content: cleanSlateSections, // La columna es 'content', no 'sections'
            updated_at: new Date().toISOString()
        })
        .eq('id', targetId);

    if (updateError) {
        console.error('Error al resetear:', updateError);
    } else {
        console.log('¡ÉXITO! El lienzo ha sido blanqueado. Estructura infinite_grid creada.');
    }
}

resetToInfiniteGrid();

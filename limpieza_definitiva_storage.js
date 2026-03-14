require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function eliminacionDefinitiva() {
    console.log("--- INICIANDO ELIMINACIÓN DEFINITIVA DE CARPETAS DE LEGADO ---");

    const folders = ['catalog-live', 'catalog-manual'];

    for (const folder of folders) {
        console.log(`\nProcesando carpeta: ${folder}...`);

        // 1. Listar archivos
        const { data: files, error: errList } = await supabase.storage
            .from('imagenes-marketing')
            .list(folder, { limit: 1000 });

        if (errList) {
            console.error(`  - Error al listar ${folder}:`, errList.message);
            continue;
        }

        if (files && files.length > 0) {
            const pathsToRm = files.map(f => `${folder}/${f.name}`);
            console.log(`  - Se encontraron ${pathsToRm.length} archivos para eliminar.`);

            // 2. Eliminar en bloques (Supabase tiene un límite por cada llamada a remove)
            const { error: errRm } = await supabase.storage
                .from('imagenes-marketing')
                .remove(pathsToRm);

            if (errRm) {
                console.error(`  - Error al eliminar archivos de ${folder}:`, errRm.message);
            } else {
                console.log(`  ✓ Carpeta '${folder}' vaciada con éxito.`);
            }
        } else {
            console.log(`  - La carpeta '${folder}' ya está vacía.`);
        }
    }

    console.log("\n--- VERIFICACIÓN FINAL ---");
    const { data: finalCheck } = await supabase.storage.from('imagenes-marketing').list('');
    console.log("Estructura de directorios actual en imagenes-marketing:");
    finalCheck.filter(f => !f.name.includes('.')).forEach(f => console.log(`  [FOLDER] ${f.name}`));

    console.log("\nLimpieza completada. El ecosistema está purificado.");
}

eliminacionDefinitiva();

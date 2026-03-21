require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function limpiezaProfunda() {
    console.log("--- INICIANDO LIMPIEZA PROFUNDA (ELIMINACIÓN ZECAT & API) ---");

    // 1. Respaldar antes de borrar (Seguridad ante todo)
    console.log("1. Creando respaldo de seguridad...");
    const { data: zecatProducts, error: errFetch } = await supabase
        .from('productos')
        .filter('wholesaler', 'ilike', '%zecat%');

    if (zecatProducts && zecatProducts.length > 0) {
        fs.writeFileSync('respaldo_zecat_eliminados.json', JSON.stringify(zecatProducts, null, 2));
        console.log(`- Respaldo creado: ${zecatProducts.length} productos guardados en 'respaldo_zecat_eliminados.json'`);
    }

    // 2. Eliminar de la tabla productos
    console.log("\n2. Eliminando registros de la base de datos...");
    const { data: delData, error: errDel } = await supabase
        .from('productos')
        .delete()
        .filter('wholesaler', 'ilike', '%zecat%');

    if (errDel) {
        console.error("Error al eliminar productos:", errDel);
    } else {
        console.log("- Registros de Zecat eliminados exitosamente de la tabla 'productos'.");
    }

    // 3. Limpiar Carpeta catalog-live (Sala de Espera de la API)
    console.log("\n3. Vaciando carpeta 'catalog-live' en Storage (Sala de Espera API)...");
    const { data: filesInLive, error: errList } = await supabase.storage.from('imagenes-marketing').list('catalog-live');

    if (filesInLive && filesInLive.length > 0) {
        const pathsToDelete = filesInLive.map(f => `catalog-live/${f.name}`);
        const { error: errStorage } = await supabase.storage.from('imagenes-marketing').remove(pathsToDelete);

        if (errStorage) {
            console.error("Error al vaciar Storage catalog-live:", errStorage);
        } else {
            console.log(`- ${pathsToDelete.length} archivos de la API eliminados de 'catalog-live'.`);
        }
    } else {
        console.log("- La carpeta 'catalog-live' ya estaba vacía o no contenía archivos.");
    }

    // 4. Verificación final
    const { count, error: errCount } = await supabase
        .from('productos')
        .select('*', { count: 'exact', head: true });

    console.log(`\n--- LIMPIEZA COMPLETADA ---`);
    console.log(`Productos restantes en catálogo: ${count}`);
}

limpiezaProfunda();

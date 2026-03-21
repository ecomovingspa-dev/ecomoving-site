require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function limpiezaProfunda() {
    console.log("--- INICIANDO LIMPIEZA PROFUNDA (ELIMINACIÓN ZECAT & API) ---");

    try {
        // 1. Respaldar antes de borrar
        console.log("1. Creando respaldo de seguridad...");
        const { data: zecatProducts, error: errFetch } = await supabase
            .from('productos')
            .select('*')
            .ilike('wholesaler', '%zecat%');

        if (errFetch) throw errFetch;

        if (zecatProducts && zecatProducts.length > 0) {
            fs.writeFileSync('respaldo_zecat_eliminados.json', JSON.stringify(zecatProducts, null, 2));
            console.log(`- Respaldo creado: ${zecatProducts.length} productos guardados.`);

            // 2. Eliminar de la tabla productos usando los IDs para ser precisos
            console.log("\n2. Eliminando registros de la base de datos...");
            const idsToDelete = zecatProducts.map(p => p.id);

            // Supabase delete with in filter
            const { error: errDel } = await supabase
                .from('productos')
                .delete()
                .in('id', idsToDelete);

            if (errDel) throw errDel;
            console.log(`- ${idsToDelete.length} registros de Zecat eliminados exitosamente.`);
        } else {
            console.log("- No se encontraron productos de Zecat para eliminar.");
        }

        // 3. Limpiar Carpeta catalog-live
        console.log("\n3. Vaciando carpeta 'catalog-live' en Storage...");
        const { data: filesInLive, error: errList } = await supabase.storage.from('imagenes-marketing').list('catalog-live');

        if (errList) console.log("- Nota: No se pudo listar catalog-live (puede no existir o estar vacía)");
        else if (filesInLive && filesInLive.length > 0) {
            const pathsToDelete = filesInLive.map(f => `catalog-live/${f.name}`).filter(p => !p.endsWith('.emptyKeepFile'));
            if (pathsToDelete.length > 0) {
                const { error: errStorage } = await supabase.storage.from('imagenes-marketing').remove(pathsToDelete);
                if (errStorage) console.error("Error Storage:", errStorage);
                else console.log(`- ${pathsToDelete.length} archivos eliminados de 'catalog-live'.`);
            }
        }

        // 4. Verificación final
        const { count, error: errCount } = await supabase
            .from('productos')
            .select('*', { count: 'exact', head: true });

        console.log(`\n--- LIMPIEZA COMPLETADA ---`);
        console.log(`Productos restantes en catálogo: ${count}`);

    } catch (e) {
        console.error("\nFallo en la limpieza:", e.message || e);
    }
}

limpiezaProfunda();

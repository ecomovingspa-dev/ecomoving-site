require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function unificarEstructura() {
    console.log("--- FASE 1: UNIFICACIÓN DE ESTRUCTURA Y MIGRACIÓN A /CATALOG/ ---");

    // 1. Obtener productos actuales (los 36 aprobados)
    const { data: productos, error: errProd } = await supabase
        .from('productos')
        .select('*');

    if (errProd) {
        console.error("Error al obtener productos:", errProd);
        return;
    }

    console.log(`Migrando imágenes de ${productos.length} productos...`);

    for (const p of productos) {
        let updates = {};

        // Procesar imagen principal
        if (p.imagen_principal && p.imagen_principal.includes('catalog-manual')) {
            const oldPath = p.imagen_principal.split('/').pop();
            const newUrl = p.imagen_principal.replace('/catalog-manual/', '/catalog/');
            updates.imagen_principal = newUrl;
        }

        // Procesar galería
        if (Array.isArray(p.imagenes_galeria)) {
            const newGallery = p.imagenes_galeria.map(img => {
                if (img && img.includes('catalog-manual')) {
                    return img.replace('/catalog-manual/', '/catalog/');
                }
                return img;
            });
            updates.imagenes_galeria = newGallery;
        }

        if (Object.keys(updates).length > 0) {
            const { error: errUpd } = await supabase
                .from('productos')
                .update(updates)
                .eq('id', p.id);

            if (errUpd) console.error(`Error actualizando producto ${p.nombre}:`, errUpd);
            else console.log(`✓ Producto '${p.nombre}' actualizado a carpeta /catalog/`);
        }
    }

    console.log("\n--- FASE 2: LIMPIEZA DE STORAGE ---");
    // Nota: El movimiento físico de archivos en Storage vía API requiere descargar y resubir uno a uno.
    // Dado que el usuario acepta que se pierdan algunas imágenes en pro del orden, 
    // lo más seguro es actualizar las rutas en DB y sugerir la limpieza manual si no se desea hacer el script de transferencia.
    // Sin embargo, para cumplir 100%, intentaremos mover los archivos críticos si existen.

    const { data: files } = await supabase.storage.from('imagenes-marketing').list('catalog-manual');
    if (files && files.length > 0) {
        console.log(`Se detectaron ${files.length} archivos en 'catalog-manual'.`);
        for (const file of files) {
            if (file.name === '.emptyKeepFile') continue;

            try {
                // Copiar archivo a la nueva ubicación
                const { error: errCopy } = await supabase.storage
                    .from('imagenes-marketing')
                    .copy(`catalog-manual/${file.name}`, `catalog/${file.name}`);

                if (!errCopy) {
                    console.log(`  + Archivo ${file.name} copiado a /catalog/`);
                }
            } catch (e) {
                console.error(`  - Error moviendo ${file.name}:`, e);
            }
        }
    }

    console.log("\n--- FASE 3: ELIMINACIÓN DE RASTROS (LIVE Y MANUAL) ---");
    // Vaciamos catalog-live definitivamente
    const { data: liveFiles } = await supabase.storage.from('imagenes-marketing').list('catalog-live');
    if (liveFiles && liveFiles.length > 0) {
        const paths = liveFiles.map(f => `catalog-live/${f.name}`);
        await supabase.storage.from('imagenes-marketing').remove(paths);
        console.log("- Carpeta 'catalog-live' vaciada físicamente.");
    }

    console.log("\nPlan de acción completado. Las referencias en la base de datos ahora apuntan a /catalog/.");
}

unificarEstructura();

require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function ubicarImagenes() {
    console.log("--- UBICACIÓN DE IMÁGENES DE LOS 36 PRODUCTOS RESTANTES ---");

    // 1. Consultar los 36 productos
    const { data: productos, error } = await supabase
        .from('productos')
        .select('nombre, wholesaler, imagen_principal, imagenes_galeria');

    if (error) {
        console.error("Error productos:", error);
    } else {
        console.log(`Analizando ${productos.length} productos...`);
        const rutas = {};
        productos.forEach(p => {
            const img = p.imagen_principal || '';
            let storageFolder = "Fuera de Storage / URL Externa";

            if (img.includes('supabase.co')) {
                const parts = img.split('/');
                // El formato suele ser .../object/public/bucket/folder/file
                const bucketIdx = parts.indexOf('public') + 1;
                if (bucketIdx > 0 && bucketIdx < parts.length - 1) {
                    storageFolder = parts.slice(bucketIdx).join('/');
                }
            }

            rutas[storageFolder] = (rutas[storageFolder] || 0) + 1;
        });

        console.log("\nDistribución por carpetas de Storage:");
        console.log(JSON.stringify(rutas, null, 2));

        console.log("\nMuestra de productos y sus rutas:");
        productos.forEach(p => {
            console.log(`- ${p.nombre} [${p.wholesaler}]: ${p.imagen_principal}`);
        });
    }

    // 2. Revisar carpetas físicas en Storage
    console.log("\n--- ESCANEO DE CARPETAS EN STORAGE ---");
    const carpetas = ['catalog', 'catalog-manual', 'catalog-live', 'grilla', 'marketing'];

    for (const carpeta of carpetas) {
        const { data, error: errStorage } = await supabase.storage.from('imagenes-marketing').list(carpeta);
        if (errStorage) {
            console.log(`- Carpeta '${carpeta}': No accesible / Error`);
        } else {
            console.log(`- Carpeta '${carpeta}': ${data.length} archivos.`);
        }
    }
}

ubicarImagenes();

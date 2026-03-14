require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function analizarFuentes() {
    console.log("--- ANÁLISIS DE ORIGEN DE DATOS (TABLA PRODUCTOS) ---");
    const { data: productos, error } = await supabase.from('productos').select('*');

    if (error) {
        console.error("Error:", error);
        return;
    }

    const total = productos.length;
    let externalImages = 0;
    let internalImages = { catalog: 0, manual: 0, live: 0, grilla: 0, unknown: 0 };
    let featuresCount = 0;
    let wholesalers = {};

    productos.forEach(p => {
        // Analizar Imagen
        const img = p.imagen_principal || '';
        if (img.includes('zecat.cl') || img.startsWith('http') && !img.includes('supabase')) {
            externalImages++;
        } else if (img.includes('supabase.co')) {
            if (img.includes('/catalog/')) internalImages.catalog++;
            else if (img.includes('catalog-manual')) internalImages.manual++;
            else if (img.includes('catalog-live')) internalImages.live++;
            else if (img.includes('/grilla/')) internalImages.grilla++;
            else internalImages.unknown++;
        }

        // Analizar Características (features)
        if (p.features && (Array.isArray(p.features) && p.features.length > 0 || typeof p.features === 'string' && p.features.length > 5)) {
            featuresCount++;
        }

        // Analizar Mayorista
        const w = p.wholesaler || 'Sin definir';
        wholesalers[w] = (wholesalers[w] || 0) + 1;
    });

    console.log(`Total Productos: ${total}`);
    console.log("\n1. ORIGEN DE IMÁGENES:");
    console.log(`- Externas (ZECAT/Otros): ${externalImages} (${Math.round(externalImages / total * 100)}%)`);
    console.log("- Internas (Supabase Storage):");
    console.log(`  - /catalog/ (Nuevo Hub): ${internalImages.catalog}`);
    console.log(`  - catalog-manual (Legado): ${internalImages.manual}`);
    console.log(`  - catalog-live (Sala Espera): ${internalImages.live}`);
    console.log(`  - /grilla/ (Marketing): ${internalImages.grilla}`);
    console.log(`  - Otros/Desconocidos: ${internalImages.unknown}`);

    console.log("\n2. CARACTERÍSTICAS (FEATURES):");
    console.log(`- Productos con características cargadas: ${featuresCount} (${Math.round(featuresCount / total * 100)}%)`);

    console.log("\n3. MAYORISTAS REGISTRADOS:");
    console.log(wholesalers);

    console.log("\n--- MUESTRA DE DATOS POR ORIGEN ---");
    const sampleManual = productos.find(p => p.imagen_principal?.includes('catalog-manual'));
    const sampleLive = productos.find(p => p.imagen_principal?.includes('catalog-live'));
    const sampleClean = productos.find(p => p.imagen_principal?.includes('/catalog/'));
    const sampleExternal = productos.find(p => p.imagen_principal?.includes('zecat.cl'));

    if (sampleManual) console.log(`- Ejemplo MANUAL: ${sampleManual.nombre} | ${sampleManual.imagen_principal}`);
    if (sampleLive) console.log(`- Ejemplo LIVE: ${sampleLive.nombre} | ${sampleLive.imagen_principal}`);
    if (sampleClean) console.log(`- Ejemplo LIMPIO: ${sampleClean.nombre} | ${sampleClean.imagen_principal}`);
    if (sampleExternal) console.log(`- Ejemplo EXTERNO: ${sampleExternal.nombre} | ${sampleExternal.imagen_principal}`);
}

analizarFuentes();

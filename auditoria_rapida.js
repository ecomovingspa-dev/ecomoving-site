require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("--- RESULTADOS DE AUDITORÍA ---");

    // 1. Revisar Productos
    const { data: productos, error: errProd } = await supabase
        .from('productos')
        .select('nombre, imagen_principal')
        .limit(100);

    if (errProd) {
        console.error("Error productos:", errProd);
    } else {
        const stats = { live: 0, manual: 0, grilla: 0, catalog: 0, otros: 0 };
        productos.forEach(p => {
            const img = p.imagen_principal || '';
            if (img.includes('catalog-live')) stats.live++;
            else if (img.includes('catalog-manual')) stats.manual++;
            else if (img.includes('/grilla/')) stats.grilla++;
            else if (img.includes('/catalog/')) stats.catalog++;
            else stats.otros++;
        });
        console.log("Distribución de imágenes en 'productos':", stats);
        console.log("Muestra de productos con imágenes sospechosas:");
        productos.filter(p => p.imagen_principal?.includes('catalog-live') || p.imagen_principal?.includes('catalog-manual'))
            .slice(0, 10)
            .forEach(p => console.log(`- ${p.nombre}: ${p.imagen_principal}`));
    }

    // 2. Revisar Agente Buffer
    const { count, error: errBuf } = await supabase
        .from('agente_buffer')
        .select('*', { count: 'exact', head: true });

    if (errBuf) {
        console.error("Error buffer:", errBuf);
    } else {
        console.log(`Total de registros en 'agente_buffer': ${count}`);
    }
}

check();

require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("--- AUDITORÍA DETALLADA ---");

    // 1. Productos
    const { data: productos, error: errProd } = await supabase
        .from('productos')
        .select('id, nombre, imagen_principal');

    if (errProd) {
        console.error("Error:", errProd);
    } else {
        console.log(`Total productos encontrados: ${productos?.length || 0}`);

        // Verificamos qué contienen realmente las URLs
        productos.slice(0, 10).forEach(p => {
            console.log(`[ID: ${p.id}] ${p.nombre}: ${p.imagen_principal}`);
        });

        const suspicious = productos.filter(p =>
            p.imagen_principal && (
                p.imagen_principal.includes('live') ||
                p.imagen_principal.includes('manual') ||
                !p.imagen_principal.includes('supabase')
            )
        );
        console.log(`\nProductos con rutas sospechosas/legado: ${suspicious.length}`);
        suspicious.slice(0, 20).forEach(p => console.log(`- ${p.nombre}: ${p.imagen_principal}`));
    }

    // 2. Agente Buffer
    const { data: buffer, error: errBuf } = await supabase
        .from('agente_buffer')
        .select('*');

    if (errBuf) {
        console.error("Error buffer:", errBuf);
    } else {
        console.log(`\nRegistros en agente_buffer: ${buffer?.length || 0}`);
        buffer.forEach(b => {
            console.log(`- [${b.id}] Mesa: ${b.target_table} | Accion: ${b.action} | Creado: ${b.created_at}`);
        });
    }
}

check();

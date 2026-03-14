require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function scanFinal() {
    console.log("--- ESCANEO DE SEGURIDAD FINAL ---");
    const folders = ['hero', 'catalog-live', 'catalog-manual', 'catalog'];

    for (const f of folders) {
        const { data, error } = await supabase.storage.from('imagenes-marketing').list(f);
        if (error) {
            console.log(`- [${f}]: Error o no existe`);
        } else {
            console.log(`- [${f}]: ${data.length} archivos detectados.`);
            if (f === 'hero' && data.length > 0) {
                console.log("  Muestra de Hero:");
                data.slice(0, 3).forEach(file => console.log(`    > ${file.name}`));
            }
        }
    }
}

scanFinal();

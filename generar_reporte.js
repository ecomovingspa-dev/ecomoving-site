require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function analizarFuentes() {
    let output = "--- REPORTE DE AUDITORÍA DE PRODUCTOS ---\n";
    const { data: productos, error } = await supabase.from('productos').select('*');

    if (error) {
        output += "Error: " + JSON.stringify(error) + "\n";
    } else {
        const total = productos.length;
        let extZecat = 0;
        let intCatalog = 0;
        let intManual = 0;
        let intLive = 0;
        let intGrilla = 0;
        let others = 0;
        let withFeatures = 0;
        let wholesalers = {};

        productos.forEach(p => {
            const img = p.imagen_principal || '';
            if (img.includes('zecat.cl')) extZecat++;
            else if (img.includes('/catalog/')) intCatalog++;
            else if (img.includes('catalog-manual')) intManual++;
            else if (img.includes('catalog-live')) intLive++;
            else if (img.includes('/grilla/')) intGrilla++;
            else others++;

            if (p.features && (Array.isArray(p.features) && p.features.length > 0 || typeof p.features === 'string')) {
                withFeatures++;
            }

            const w = p.wholesaler || 'Sin definir';
            wholesalers[w] = (wholesalers[w] || 0) + 1;
        });

        output += `Total Productos: ${total}\n`;
        output += `\nORIGEN DE IMÁGENES:\n`;
        output += `- ZECAT (Externo): ${extZecat}\n`;
        output += `- /catalog/ (Nuevo Hub): ${intCatalog}\n`;
        output += `- catalog-manual: ${intManual}\n`;
        output += `- catalog-live: ${intLive}\n`;
        output += `- grilla (Marketing): ${intGrilla}\n`;
        output += `- Otros: ${others}\n`;

        output += `\nCARACTERÍSTICAS:\n`;
        output += `- Con características: ${withFeatures}\n`;

        output += `\nMAYORISTAS:\n`;
        output += JSON.stringify(wholesalers, null, 2) + "\n";

        output += `\n--- MUESTRA 20 PRODUCTOS ---\n`;
        productos.slice(0, 20).forEach(p => {
            output += `- [${p.id}] ${p.nombre} | IMG: ${p.imagen_principal}\n`;
        });
    }

    fs.writeFileSync('reporte_auditoria.txt', output);
    console.log("Reporte generado en reporte_auditoria.txt");
}

analizarFuentes();

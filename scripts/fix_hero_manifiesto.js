/**
 * @adn FIX — 2026-03-06T13:40
 * Lee estado ACTUAL de Supabase, encuentra TODOS los bloques HERO MANIFIESTO
 * y los reemplaza por la sección Eco Intro. Verifica antes y después.
 */
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://xgdmyjzyejjmwdqkufhp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZG15anp5ZWpqbXdkcWt1ZmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTk0MTgsImV4cCI6MjA3OTM5NTQxOH0.WtEIZ324jxd5ymXJ6RwdXfqFc_qM6UAKJ-ONkbL2J4E';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const NEW_ECO_INTRO_BLOCK = {
    id: "eco_intro_section",
    col: 1,
    row: 1,
    span: "24x8",
    type: "both",
    label: "INTRO PRODUCTOS ECOLÓGICOS",
    shadow: "none",
    zIndex: 1,
    bgColor: "#050505",
    gallery: [],
    opacity: 1,
    gradient: false,
    textAlign: "left",
    textColor: "#ffffff",
    titleSize: "48px",
    blockTitle: "DISEÑADO PARA DURAR. CREADO PARA IMPACTAR.",
    fontFamily: "sans",
    fontWeight: "900",
    lineHeight: "1.1",
    borderRadius: "0px",
    letterSpacing: "-1px",
    textTransform: "uppercase",
    blockParagraph: "Productos corporativos de economía circular. Cada objeto, una declaración de liderazgo sostenible.",
    transform_posX: 50,
    transform_posY: 50,
    transform_zoom: 1.0,
    galleryAnimation: "fade"
};

function isManifiesto(block) {
    const label = (block.label || '').toUpperCase();
    const id = (block.id || '').toLowerCase();
    const title = (block.blockTitle || '').toUpperCase();
    return (
        label.includes('MANIFIESTO') ||
        id.includes('hero_2026') ||
        title.includes('FUTURO SOSTENIBLE')
    );
}

async function run() {
    console.log('\n🔍 [@adn] Leyendo estado ACTUAL de Supabase...\n');

    const { data, error } = await supabase
        .from('web_contenido')
        .select('content')
        .eq('section', 'sections')
        .single();

    if (error) { console.error('❌ Error leyendo:', error.message); process.exit(1); }

    const sectionsArray = data.content;
    if (!Array.isArray(sectionsArray)) { console.error('❌ sections no es array'); process.exit(1); }

    console.log(`📄 Secciones encontradas: ${sectionsArray.length}`);

    let totalReemplazados = 0;

    const updatedSections = sectionsArray.map((section, sIdx) => {
        const blocks = section.blocks || [];

        console.log(`\n── Sección [${sIdx}] id="${section.id}" → ${blocks.length} bloques`);

        // Listar todos los bloques para diagnóstico
        blocks.forEach((b, i) => {
            const target = isManifiesto(b);
            console.log(`   [${i}] id="${b.id}" label="${b.label}" blockTitle="${b.blockTitle || ''}" ${target ? '⚠️  MANIFIESTO DETECTADO' : ''}`);
        });

        const newBlocks = blocks.map((block, bIdx) => {
            if (isManifiesto(block)) {
                console.log(`\n   ✅ REEMPLAZANDO bloque [${bIdx}]:`);
                console.log(`      ANTES: id="${block.id}" col=${block.col} row=${block.row} span=${block.span}`);
                // Heredar posición real del bloque original
                const replacement = {
                    ...NEW_ECO_INTRO_BLOCK,
                    col: block.col,
                    row: block.row,
                    span: block.span
                };
                console.log(`      AHORA: id="${replacement.id}" col=${replacement.col} row=${replacement.row} span=${replacement.span}`);
                totalReemplazados++;
                return replacement;
            }
            return block;
        });

        return { ...section, blocks: newBlocks };
    });

    if (totalReemplazados === 0) {
        console.log('\n⚠️  No se encontró ningún bloque HERO MANIFIESTO en la base de datos actual.');
        console.log('   Verificando si el bloque eco_intro_section ya existe...');
        const allBlocks = sectionsArray.flatMap(s => s.blocks || []);
        const ecoExists = allBlocks.find(b => b.id === 'eco_intro_section');
        if (ecoExists) {
            console.log('   ✅ eco_intro_section YA EXISTE — el reemplazo anterior fue exitoso.');
            console.log('   El sitio puede estar mostrando datos en caché. Recarga el navegador con Ctrl+Shift+R.');
        } else {
            console.log('   ❌ Ninguno de los dos bloques existe. Estructura inesperada.');
            console.log('\n   Todos los IDs de bloques actuales:');
            allBlocks.forEach(b => console.log(`     - id="${b.id}" label="${b.label}"`));
        }
        return;
    }

    console.log(`\n💾 Guardando ${totalReemplazados} reemplazos en Supabase...`);
    const { error: updateError } = await supabase
        .from('web_contenido')
        .upsert({
            section: 'sections',
            content: updatedSections,
            updated_by: 'adn-fix-hero-manifiesto-2026-03-06T1340'
        }, { onConflict: 'section' });

    if (updateError) { console.error('❌ Error guardando:', updateError.message); process.exit(1); }

    console.log(`\n✅ [@adn] ${totalReemplazados} bloque(s) reemplazados y guardados en Supabase.`);
    console.log('   Recarga el navegador para ver el cambio (Ctrl+Shift+R para limpiar caché).\n');
}

run();

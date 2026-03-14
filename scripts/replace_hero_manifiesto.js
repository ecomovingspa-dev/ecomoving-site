/**
 * @adn REGISTRO DE CAMBIO — 2026-03-06
 * ─────────────────────────────────────────────────────────────────────────────
 * OPERACIÓN : Reemplazo de bloque "HERO MANIFIESTO" (id: hero_2026)
 * MOTIVO    : El usuario solicita reemplazar el bloque Hero Manifiesto de la
 *             grilla por una sección editorial de introducción a productos
 *             ecológicos, alineada al protocolo @seo_mkt (tono B2B ejecutivo,
 *             Economía Circular, Arquitectura Semántica Google 2026).
 * NUEVO ID  : "eco_intro_section"
 * LABEL     : "INTRO PRODUCTOS ECOLÓGICOS"
 * POSICIÓN  : Mantiene col:2, row:1, span:24x8 (misma huella visual)
 * AUTORÍA   : Antigravity + @seo_mkt ADN Protocol
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://xgdmyjzyejjmwdqkufhp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZG15anp5ZWpqbXdkcWt1ZmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTk0MTgsImV4cCI6MjA3OTM5NTQxOH0.WtEIZ324jxd5ymXJ6RwdXfqFc_qM6UAKJ-ONkbL2J4E';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── NUEVO BLOQUE: Sección editorial "Productos Ecológicos" (@seo_mkt) ──
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

async function replacHeroManifiesto() {
    console.log('🔄 [@adn] Iniciando reemplazo de HERO MANIFIESTO...\n');

    // 1. Obtener el array actual de sections desde Supabase
    const { data, error: fetchError } = await supabase
        .from('web_contenido')
        .select('content')
        .eq('section', 'sections')
        .single();

    if (fetchError) {
        console.error('❌ Error al leer sections:', fetchError.message);
        process.exit(1);
    }

    const sectionsArray = data.content;
    if (!Array.isArray(sectionsArray) || sectionsArray.length === 0) {
        console.error('❌ No se encontró el array sections o está vacío');
        process.exit(1);
    }

    // 2. Localizar el infinite_grid
    const gridIndex = sectionsArray.findIndex(s => s.id === 'infinite_grid');
    if (gridIndex === -1) {
        console.error('❌ No se encontró la sección infinite_grid');
        process.exit(1);
    }

    const grid = sectionsArray[gridIndex];
    const blocks = grid.blocks || [];

    // 3. Localizar el bloque HERO MANIFIESTO (id: hero_2026)
    const heroManifiestoIdx = blocks.findIndex(b => b.id === 'hero_2026');
    if (heroManifiestoIdx === -1) {
        console.warn('⚠️  Bloque hero_2026 no encontrado. Buscando por label...');
        const byLabel = blocks.findIndex(b => (b.label || '').toUpperCase().includes('MANIFIESTO'));
        if (byLabel === -1) {
            console.error('❌ No se encontró ningún bloque HERO MANIFIESTO');
            process.exit(1);
        }
        console.log(`✅ Encontrado por label en índice ${byLabel}: "${blocks[byLabel].label}"`);
    }

    const targetIdx = heroManifiestoIdx !== -1 ? heroManifiestoIdx : blocks.findIndex(b => (b.label || '').toUpperCase().includes('MANIFIESTO'));
    const oldBlock = blocks[targetIdx];

    console.log(`📦 Bloque a reemplazar:`);
    console.log(`   id    : ${oldBlock.id}`);
    console.log(`   label : ${oldBlock.label}`);
    console.log(`   pos   : col=${oldBlock.col} row=${oldBlock.row} span=${oldBlock.span}`);

    // 4. Reemplazar el bloque
    const newBlocks = [...blocks];
    newBlocks[targetIdx] = NEW_ECO_INTRO_BLOCK;

    const updatedGrid = { ...grid, blocks: newBlocks };
    const updatedSections = [...sectionsArray];
    updatedSections[gridIndex] = updatedGrid;

    // 5. Escribir en Supabase
    const { error: updateError } = await supabase
        .from('web_contenido')
        .upsert({
            section: 'sections',
            content: updatedSections,
            updated_by: 'adn-replace-hero-manifiesto-2026-03-06'
        }, { onConflict: 'section' });

    if (updateError) {
        console.error('❌ Error al actualizar:', updateError.message);
        process.exit(1);
    }

    console.log('\n✅ [@adn] Reemplazo completado exitosamente.');
    console.log(`   ANTES → id:"${oldBlock.id}" label:"${oldBlock.label}"`);
    console.log(`   AHORA → id:"${NEW_ECO_INTRO_BLOCK.id}" label:"${NEW_ECO_INTRO_BLOCK.label}"`);
    console.log(`   Título: "${NEW_ECO_INTRO_BLOCK.blockTitle}"`);
    console.log(`   Subtítulo: "${NEW_ECO_INTRO_BLOCK.blockParagraph}"`);
    console.log('\n📋 Registro ADN guardado en scripts/replace_hero_manifiesto.js');
}

replacHeroManifiesto();

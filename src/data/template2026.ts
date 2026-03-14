import { LayoutBlock } from '@/hooks/useWebContent';

export const CATHEDRAL_TEMPLATE_2026: LayoutBlock[] = [
    // --- MANIFIESTO DE MARCA (Intro) ---
    {
        id: 'brand_manifesto', label: 'MANIFIESTO', type: 'text',
        col: 6, row: 1, span: '14x3', zIndex: 1,
        bgColor: 'transparent', textColor: '#ffffff',
        blockTitle: 'INGENIERÍA SOSTENIBLE', blockParagraph: 'Diseñamos el futuro del merchandising corporativo con materiales nobles y tecnología térmica de vanguardia.',
        titleSize: '42px', fontWeight: '900', fontFamily: 'serif', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', lineHeight: '1.1',
        shadow: 'none', borderRadius: '0px', gradient: false, opacity: 1
    },

    // --- SECCIÓN: HIDRATACIÓN (BOTELLAS & MUGS) ---
    {
        id: 'sec_title_hydro', label: 'TÍTULO CATEGORÍA', type: 'text',
        col: 1, row: 5, span: '24x2', zIndex: 1, bgColor: 'transparent',
        blockTitle: '01. HIDRATACIÓN', titleSize: '18px', fontWeight: '400', fontFamily: 'mono', letterSpacing: '6px', textAlign: 'left', textColor: '#00d4bd'
    },
    {
        id: 'hydro_main', label: 'BOTELLA HERO', type: 'image',
        col: 1, row: 7, span: '12x8', zIndex: 2, bgColor: '#0a0a0a',
        blockTitle: 'SERIE TITANIO', blockParagraph: 'Acero 304 de doble pared.',
        titleSize: '32px', fontWeight: '700', fontFamily: 'sans', textAlign: 'left',
        shadow: 'soft', borderRadius: '24px', opacity: 1
    },
    {
        id: 'hydro_detail_1', label: 'MUG DETALLE', type: 'image',
        col: 14, row: 7, span: '11x4', zIndex: 2, bgColor: '#111',
        blockTitle: 'CERÁMICA MATE', titleSize: '24px', fontFamily: 'serif', textAlign: 'right',
        shadow: 'none', borderRadius: '16px', opacity: 1
    },
    {
        id: 'hydro_tech', label: 'ESPECIFICACIONES', type: 'text',
        col: 14, row: 12, span: '5x3', zIndex: 2, bgColor: '#00d4bd', textColor: '#000',
        blockTitle: '12H', blockParagraph: 'CALOR',
        titleSize: '48px', fontWeight: '900', textAlign: 'center', letterSpacing: '-2px', borderRadius: '12px', shadow: 'strong', opacity: 1
    },
    {
        id: 'hydro_detail_2', label: 'BOTELLA TEXTURA', type: 'image',
        col: 20, row: 12, span: '5x3', zIndex: 2, bgColor: '#222',
        shadow: 'none', borderRadius: '12px', opacity: 1
    },

    // --- SECCIÓN: OFICINA ECO (LIBRETAS & BAMBÚ) ---
    {
        id: 'sec_title_office', label: 'TÍTULO CATEGORÍA', type: 'text',
        col: 1, row: 16, span: '24x2', zIndex: 1, bgColor: 'transparent',
        blockTitle: '02. OFICINA ECO', titleSize: '18px', fontWeight: '400', fontFamily: 'mono', letterSpacing: '6px', textAlign: 'right', textColor: '#00d4bd'
    },
    {
        id: 'office_main', label: 'SET ESCRITORIO', type: 'image',
        col: 10, row: 18, span: '15x8', zIndex: 2, bgColor: '#0a0a0a',
        blockTitle: 'NATURALEZA EN TU MESA', blockParagraph: 'Bambú certificado FSC.',
        titleSize: '32px', fontWeight: '700', fontFamily: 'serif', textAlign: 'right',
        shadow: 'soft', borderRadius: '24px', opacity: 1
    },
    {
        id: 'office_detail_1', label: 'LIBRETA', type: 'image',
        col: 1, row: 18, span: '8x5', zIndex: 2, bgColor: '#111',
        blockTitle: 'TEXTURA REAL', titleSize: '18px', fontFamily: 'sans', textAlign: 'left',
        shadow: 'none', borderRadius: '16px', opacity: 1
    },
    {
        id: 'office_quote', label: 'FRASE', type: 'text',
        col: 1, row: 24, span: '8x2', zIndex: 1, bgColor: 'transparent',
        blockTitle: '"Diseño que respira."', titleSize: '24px', fontFamily: 'serif', fontStyle: 'italic', textAlign: 'center', textColor: '#888'
    },

    // --- SECCIÓN: TEXTIL & URBANO ---
    {
        id: 'sec_title_urban', label: 'TÍTULO CATEGORÍA', type: 'text',
        col: 1, row: 27, span: '24x2', zIndex: 1, bgColor: 'transparent',
        blockTitle: '03. VIDA URBANA', titleSize: '18px', fontWeight: '400', fontFamily: 'mono', letterSpacing: '6px', textAlign: 'center', textColor: '#00d4bd'
    },
    {
        id: 'urban_grid_1', label: 'MOCHILA', type: 'image',
        col: 1, row: 29, span: '8x6', zIndex: 2, bgColor: '#111', borderRadius: '0px', opacity: 1
    },
    {
        id: 'urban_grid_2', label: 'BOLSA TOTE', type: 'image',
        col: 9, row: 29, span: '8x6', zIndex: 2, bgColor: '#161616', borderRadius: '0px', opacity: 1
    },
    {
        id: 'urban_grid_3', label: 'ACCESORIO', type: 'image',
        col: 17, row: 29, span: '8x6', zIndex: 2, bgColor: '#111', borderRadius: '0px', opacity: 1
    },
    {
        id: 'urban_cta', label: 'CTA', type: 'both',
        col: 9, row: 36, span: '8x2', zIndex: 3, bgColor: '#00d4bd', textColor: '#000',
        blockTitle: 'VER COLECCIÓN', titleSize: '14px', fontWeight: '900', textAlign: 'center', letterSpacing: '2px',
        borderRadius: '30px', shadow: 'strong', opacity: 1
    },

    // --- SECCIÓN: TECH INNOVATION ---
    {
        id: 'sec_title_tech', label: 'TÍTULO CATEGORÍA', type: 'text',
        col: 1, row: 39, span: '24x2', zIndex: 1, bgColor: 'transparent',
        blockTitle: '04. TECNOLOGÍA', titleSize: '18px', fontWeight: '400', fontFamily: 'mono', letterSpacing: '6px', textAlign: 'left', textColor: '#00d4bd'
    },
    {
        id: 'tech_hero', label: 'BATERÍA EXTERNA', type: 'image',
        col: 1, row: 41, span: '10x10', zIndex: 2, bgColor: '#0f0f0f',
        blockTitle: 'ENERGÍA PORTÁTIL', blockParagraph: 'Carga rápida 20W con carcasa de trigo reciclado.',
        titleSize: '28px', fontWeight: '700', fontFamily: 'sans', textAlign: 'left',
        shadow: 'neon', borderRadius: '16px', opacity: 1
    },
    {
        id: 'tech_detail_1', label: 'AUDIO', type: 'image',
        col: 11, row: 41, span: '7x5', zIndex: 2, bgColor: '#111',
        blockTitle: 'SONIDO 360°', titleSize: '16px', fontFamily: 'mono', textAlign: 'right',
        shadow: 'soft', borderRadius: '12px', opacity: 1
    },
    {
        id: 'tech_detail_2', label: 'MEMORIA USB', type: 'image',
        col: 18, row: 41, span: '7x5', zIndex: 2, bgColor: '#111',
        shadow: 'none', borderRadius: '12px', opacity: 0.8
    },
    {
        id: 'tech_quote', label: 'FRASE TECH', type: 'text',
        col: 11, row: 46, span: '14x5', zIndex: 1, bgColor: '#00d4bd', textColor: '#000',
        blockTitle: 'CONECTIVIDAD SIN HUELLA', titleSize: '42px', fontWeight: '900', textAlign: 'center', letterSpacing: '-2px',
        shadow: 'strong', borderRadius: '24px', opacity: 1
    },

    // --- SECCIÓN: GOURMET & HOME ---
    {
        id: 'sec_title_gourmet', label: 'TÍTULO CATEGORÍA', type: 'text',
        col: 1, row: 53, span: '24x2', zIndex: 1, bgColor: 'transparent',
        blockTitle: '05. GOURMET & CASA', titleSize: '18px', fontWeight: '400', fontFamily: 'mono', letterSpacing: '6px', textAlign: 'right', textColor: '#00d4bd'
    },
    {
        id: 'gourmet_hero', label: 'TABLA MADERA', type: 'image',
        col: 9, row: 55, span: '16x8', zIndex: 2, bgColor: '#1a1a1a',
        blockTitle: 'MADERA NATIVA', blockParagraph: 'Tablas de picoteo en Raulí y Roble.',
        titleSize: '32px', fontWeight: '700', fontFamily: 'serif', textAlign: 'right',
        shadow: 'soft', borderRadius: '2px', opacity: 1
    },
    {
        id: 'gourmet_detail_1', label: 'CUCHILLOS', type: 'image',
        col: 1, row: 55, span: '8x8', zIndex: 2, bgColor: '#111',
        blockTitle: 'ACERO FORJADO', titleSize: '18px', fontFamily: 'sans', textAlign: 'left',
        shadow: 'none', borderRadius: '2px', opacity: 1
    }
];

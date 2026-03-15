import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function rebuildLanding() {
  const b2bSections = [
    {
      id: 'infinite_grid',
      order: 1,
      title1: '',
      paragraph1: '',
      bgColor: '#111111',
      blocks: [
        // FILA 1: Oficina y Textil
        {
          id: 'block_office',
          label: 'Oficina Sustentable',
          type: 'image',
          span: '24x36',
          col: 1,
          row: 1,
          zIndex: 1,
          image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop',
          blockTitle: 'Oficina Sustentable',
          blockParagraph: 'Línea completa de escritura, agendas y organización ecológica.',
          link: '/catalogo?q=oficina',
          textAlign: 'left',
          textVerticalAlign: 'flex-end',
          textColor: '#ffffff',
          borderRadius: '24px',
          shadow: 'soft',
          textPadding: '50px',
          transform_zoom: 1.05
        },
        {
          id: 'block_hydration',
          label: 'Línea Hidratación',
          type: 'image',
          span: '24x36',
          col: 25,
          row: 1,
          zIndex: 1,
          image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=2070&auto=format&fit=crop',
          blockTitle: 'Línea Hidratación',
          blockParagraph: 'Termos y botellas premium de alta retención térmica para el día a día corporativo.',
          link: '/catalogo?q=termo',
          textAlign: 'left',
          textVerticalAlign: 'flex-end',
          textColor: '#ffffff',
          borderRadius: '24px',
          shadow: 'soft',
          textPadding: '50px',
          transform_zoom: 1.05
        },
        
        // FILA 2: Soluciones Especializadas 
        {
          id: 'block_textile',
          label: 'Textil y Eventos',
          type: 'image',
          span: '48x40',
          col: 1,
          row: 39,
          zIndex: 1,
          image: 'https://images.unsplash.com/photo-1529369623266-f5264b696110?q=80&w=2000&auto=format&fit=crop',
          blockTitle: 'Textil Corporativo',
          blockParagraph: 'Viste a tu equipo y destaca en ferias comerciales con materiales ecológicos y reciclados.',
          link: '/catalogo?q=polera',
          textAlign: 'center',
          textVerticalAlign: 'center',
          textColor: '#ffffff',
          borderRadius: '24px',
          shadow: 'strong',
          textPadding: '60px',
          transform_zoom: 1.0
        },

        // FILA 3: Autoridad y Valor
        {
          id: 'block_trust',
          label: 'Confianza B2B',
          type: 'text',
          span: '48x16',
          col: 1,
          row: 81,
          zIndex: 1,
          bgColor: '#00d4bd',
          textColor: '#000000',
          blockTitle: '¿Por qué Ecomoving B2B?',
          blockParagraph: 'Stock permanente, facturación corporativa ágil y logística a nivel nacional. Somos pioneros en entregar regalos que impulsan la sustentabilidad.',
          textAlign: 'center',
          textVerticalAlign: 'center',
          borderRadius: '24px',
          shadow: 'none',
          textPadding: '40px'
        },

        // FILA 4: Teasers de Nivel
        {
          id: 'teaser_1',
          label: 'Teaser 1',
          type: 'image',
          span: '12x30',
          col: 1,
          row: 99,
          zIndex: 1,
          image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop', // Libreta
          borderRadius: '20px',
          link: '/catalogo'
        },
        {
          id: 'teaser_2',
          label: 'Teaser 2',
          type: 'image',
          span: '12x30',
          col: 13,
          row: 99,
          zIndex: 1,
          image: 'https://images.unsplash.com/photo-1618365908648-e71bf5716b02?q=80&w=800&auto=format&fit=crop', // Termo
          borderRadius: '20px',
          link: '/catalogo'
        },
        {
          id: 'teaser_3',
          label: 'Teaser 3',
          type: 'image',
          span: '12x30',
          col: 25,
          row: 99,
          zIndex: 1,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', // Mochila
          borderRadius: '20px',
          link: '/catalogo'
        },
        {
          id: 'teaser_4',
          label: 'Teaser 4',
          type: 'image',
          span: '12x30',
          col: 37,
          row: 99,
          zIndex: 1,
          image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop', // Audifonos
          borderRadius: '20px',
          link: '/catalogo'
        }
      ]
    }
  ];

  console.log('Sending new layout to Supabase...');
  const { error } = await supabase
    .from('web_contenido')
    .upsert({
      section: 'sections',
      content: b2bSections,
      updated_by: 'script_b2b_rebuild'
    }, {
      onConflict: 'section'
    });

  if (error) {
    console.error('Error updating Supabase:', error);
  } else {
    console.log('Successfully applied B2B Landing Page layout!');
  }
}

rebuildLanding();

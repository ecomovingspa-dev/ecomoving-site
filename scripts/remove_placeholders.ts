import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function cleanPlaceholders() {
  console.log('--- ADN: Iniciando limpieza de imágenes de ejemplo ---');

  // 1. Limpiar HERO
  const { data: heroData } = await supabase.from('web_contenido').select('*').eq('section', 'hero').single();
  if (heroData) {
    const updatedHero = {
      ...heroData.content,
      background_image: '',
      background_image_2: '',
      background_image_3: '',
      gallery: []
    };
    await supabase.from('web_contenido').update({ content: updatedHero }).eq('section', 'hero');
    console.log('✓ Hero: Imágenes eliminadas.');
  }

  // 2. Limpiar SECTIONS
  const { data: sectionsData } = await supabase.from('web_contenido').select('*').eq('section', 'sections').single();
  if (sectionsData && Array.isArray(sectionsData.content)) {
    const updatedSections = sectionsData.content.map((section: any) => ({
      ...section,
      gallery: [],
      blocks: (section.blocks || []).map((block: any) => ({
        ...block,
        image: '',
        gallery: []
      }))
    }));
    await supabase.from('web_contenido').update({ content: updatedSections }).eq('section', 'sections');
    console.log('✓ Sections: Imágenes eliminadas de todos los bloques.');
  }

  console.log('--- Limpieza completada. El sitio está limpio. ---');
}

cleanPlaceholders();

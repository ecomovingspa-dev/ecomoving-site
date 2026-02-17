
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xgdmyjzyejjmwdqkufhp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZG15anp5ZWpqbXdkcWt1ZmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTk0MTgsImV4cCI6MjA3OTM5NTQxOH0.WtEIZ324jxd5ymXJ6RwdXfqFc_qM6UAKJ-ONkbL2J4E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixHero() {
    console.log('Iniciando corrección de Supabase...');
    const { data, error } = await supabase
        .from('web_contenido')
        .upsert({
            section: 'hero',
            content: {
                title1: 'ECOMOVING: MERCHANDISING SUSTENTABLE Y DISEÑO PREMIUM',
                paragraph1: 'Elevamos tu marca con productos corporativos de alto impacto y conciencia ecológica.',
                cta_text: 'EXPLORAR CATÁLOGO 2026',
                cta_link: '/catalogo',
                background_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop'
            }
        }, { onConflict: 'section' });

    if (error) {
        console.error('Error al actualizar hero:', error);
    } else {
        console.log('✅ Supabase actualizado con éxito (Hero)');
    }

    // Opcional: Limpiar cualquier rastro de 'navigation' si existe
    const { error: delError } = await supabase
        .from('web_contenido')
        .delete()
        .eq('section', 'navigation');

    if (!delError) console.log('✅ Posible sección "navigation" eliminada.');
}

fixHero();

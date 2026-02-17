
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xgdmyjzyejjmwdqkufhp.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'MISSING_KEY' // I need to get the key from the env or the file

// This script is to be run with node or as a one-off in a temp file
async function fixHero() {
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
        }, { onConflict: 'section' })

    if (error) console.error('Error fixing hero:', error)
    else console.log('Successfully updated hero in Supabase')
}

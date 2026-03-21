// @ts-check
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function run() {
    const { data, error } = await supabase.from('productos').select('*').eq('status', 'approved').order('created_at', { ascending: false })
    if (error) {
        console.error(error)
        return
    }
    
    // Group by image
    const grouped = {}
    data.forEach(p => {
        const img = p.imagen_principal
        if (!grouped[img]) grouped[img] = []
        grouped[img].push(p.nombre)
    })
    
    Object.keys(grouped).forEach(img => {
        if (grouped[img].length > 1) {
            console.log(`Duplicate image: ${img}`)
            console.log(`Products: ${grouped[img].join(', ')}`)
            console.log('---')
        }
    })
    console.log('Done.')
}

run()

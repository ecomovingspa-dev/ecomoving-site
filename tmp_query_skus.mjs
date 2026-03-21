// @ts-check
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function run() {
    const images = [
        'https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/imagenes-marketing/catalogo/INSUMO-1772238951609-2.webp',
        'https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/imagenes-marketing/catalogo/INSUMO-1772244858463-15.webp'
    ]
    
    for (const img of images) {
        const { data, error } = await supabase.from('productos').select('*').eq('imagen_principal', img)
        if (data) {
            console.log(`\nIMAGE: ${img}`)
            data.forEach(p => console.log(`- ${p.nombre} (SKU: ${p.sku_externo}, Wholesaler: ${p.wholesaler})`))
        }
    }
}

run()

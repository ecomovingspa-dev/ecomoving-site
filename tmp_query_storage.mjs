// @ts-check
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function run() {
    const skus = ['T750', 'T766', 'K106', 'M59', 'T575', 'T625', 'T771', 'X9', 'M36'];
    
    for (const sku of skus) {
        const { data, error } = await supabase.storage.from('imagenes-marketing').list('catalogo', { search: sku });
        if (data && data.length > 0) {
            console.log(`\nSKU ${sku} found in storage:`);
            data.forEach(f => console.log(f.name));
        } else {
            console.log(`\nSKU ${sku} not found in storage.`);
        }
    }
}

run()


const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function crossReference() {
    const catalogFiles = JSON.parse(fs.readFileSync('catalog_files_full.json', 'utf8'));

    const { data: missingProds, error } = await supabase
        .from('productos')
        .select('id, nombre, imagen_principal')
        .or('imagen_principal.ilike.%catalog-manual%,imagen_principal.ilike.%catalog-m%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Checking ${missingProds.length} missing products...`);

    missingProds.forEach(p => {
        // Find if any file in catalog starts with the same 4-5 digits
        const match = p.imagen_principal.match(/0\.\d{4,}/);
        if (match) {
            const frag = match[0];
            const found = catalogFiles.find(f => f.includes(frag));
            if (found) {
                console.log(`[MATCH] ${p.nombre} -> ${found}`);
            }
        }
    });
}

crossReference();


const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findPotentialDuplicates() {
    const missingNames = [
        "Mug térmico \"YAMA\"",
        "Mug térmico encobrizado \"CUPRA\" 500cc",
        "Libreta \"GRETA\"",
        // ... (I'll just search for the main ones)
    ];

    console.log('Searching for potential duplicates with working images...');

    for (const name of missingNames) {
        const cleanName = name.replace(/"/g, ''); // Remove quotes for better searching
        const { data, error } = await supabase
            .from('productos')
            .select('nombre, imagen_principal')
            .ilike('nombre', `%${cleanName.split(' ')[0]}%`) // Search by first word
            .not('imagen_principal', 'ilike', '%catalog-manual%')
            .not('imagen_principal', 'ilike', '%catalog-m%')
            .limit(5);

        if (data && data.length > 0) {
            console.log(`\nPotential matches for "${name}":`);
            data.forEach(d => console.log(`- ${d.nombre}: ${d.imagen_principal}`));
        }
    }
}

findPotentialDuplicates();

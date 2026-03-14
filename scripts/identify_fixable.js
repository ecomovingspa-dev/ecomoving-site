
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function identifyFixable() {
    const catalogFiles = JSON.parse(fs.readFileSync('catalog_files.json', 'utf8'));

    const { data: allData, error } = await supabase
        .from('productos')
        .select('id, nombre, imagen_principal, features');

    if (error) {
        console.error('Error:', error);
        return;
    }

    const corrupted = allData.filter(p =>
        (p.imagen_principal && p.imagen_principal.includes('catalog-m')) ||
        (p.features && p.features.some(f => f && f.includes('catalog-m')))
    );

    console.log(`Analyzing ${corrupted.length} corrupted products...`);
    const fixable = [];
    const notFound = [];

    corrupted.forEach(p => {
        // Extract ID from features or imagen_principal
        let foundId = null;
        const allText = JSON.stringify(p);
        const match = allText.match(/0\.\d{10,}/);
        if (match) {
            foundId = match[0];
            const fullFilename = catalogFiles.find(f => f.includes(foundId));
            if (fullFilename) {
                fixable.push({
                    id: p.id,
                    nombre: p.nombre,
                    old_path: p.imagen_principal,
                    new_filename: fullFilename
                });
            } else {
                notFound.push({
                    id: p.id,
                    nombre: p.nombre,
                    fragment: foundId
                });
            }
        }
    });

    console.log(`\nFIXABLE (${fixable.length}):`);
    fixable.forEach(f => console.log(`- ${f.nombre} -> ${f.new_filename}`));

    console.log(`\nNOT FOUND (${notFound.length}):`);
    notFound.forEach(n => console.log(`- ${n.nombre} (Fragment: ${n.fragment})`));
}

identifyFixable();

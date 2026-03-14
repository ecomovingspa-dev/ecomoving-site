const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listRoot() {
    console.log('Listing files in imagenes-marketing at root level...');
    const { data: files, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('', { limit: 1000 });

    if (error) {
        console.error('Error fetching root:', error);
        return;
    }

    const filesOnly = files.filter(f => !f.metadata && f.id === null); // Folders usually have no metadata
    console.log(`Found ${files.length} items in root.`);

    // Sort and group by prefix to see what we have
    const mkt = files.filter(f => f.name.startsWith('MKT-'));
    const insumo = files.filter(f => f.name.startsWith('INSUMO-'));
    const prod = files.filter(f => f.name.startsWith('PROD-'));
    const catalogFiles = files.filter(f => f.name.startsWith('CAT-'));
    const other = files.filter(f => !f.name.startsWith('MKT-') && !f.name.startsWith('INSUMO-') && !f.name.startsWith('PROD-') && !f.name.startsWith('CAT-') && f.name !== 'catalog' && f.name !== 'grilla' && f.name !== '.emptyFolderPlaceholder');

    console.log(`MKT- files: ${mkt.length}`);
    console.log(`INSUMO- files: ${insumo.length}`);
    console.log(`PROD- files: ${prod.length}`);
    console.log(`CAT- files: ${catalogFiles.length}`);
    console.log(`Other files: ${other.length}`);

    console.log('Sample of others:');
    other.slice(0, 50).forEach(f => console.log(` - ${f.name}`));
}

listRoot();

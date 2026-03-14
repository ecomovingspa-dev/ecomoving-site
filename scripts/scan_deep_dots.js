
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function scanDeepDots() {
    console.log('Scanning imagenes-marketing for all files starting with "0." recursively...');
    const { data: files, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('', { recursive: true, limit: 10000 });

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Total files found: ${files.length}`);
    const dotFiles = files.filter(f => f.name.includes('/0.') || f.name.startsWith('0.'));
    console.log(`Files starting with 0.: ${dotFiles.length}`);

    fs.writeFileSync('dot_files_scan.json', JSON.stringify(dotFiles.map(f => f.name), null, 2));
    console.log('Results saved to dot_files_scan.json');

    // Search specifically for YAMA fragments
    const yamaFrag = '0.5520';
    const foundYama = dotFiles.find(name => name.includes(yamaFrag));
    if (foundYama) {
        console.log(`!!! FOUND YAMA FILE: ${foundYama} !!!`);
    } else {
        console.log('YAMA fragment not found in this scan.');
    }
}

scanDeepDots();

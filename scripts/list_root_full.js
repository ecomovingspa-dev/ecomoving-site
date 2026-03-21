
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listRootFull() {
    console.log('Listing root of imagenes-marketing without any filters...');
    // list('') only lists the items in the root folder, not recursively unless specified.
    const { data: items, error } = await supabase.storage
        .from('imagenes-marketing')
        .list('', { limit: 1000 });

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${items.length} items in root.`);
    items.forEach(i => {
        console.log(`- ${i.name} (${i.id ? 'file' : 'folder'})`);
    });
}

listRootFull();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanRows() {
    const idsToDelete = [388, 178, 293, 305];
    for (const id of idsToDelete) {
        const { error } = await supabase.from('web_contenido').delete().eq('id', id);
        if (error) {
            console.error(`Error deleting ${id}:`, error);
        } else {
            console.log(`Deleted row id: ${id}`);
        }
    }
}

cleanRows();

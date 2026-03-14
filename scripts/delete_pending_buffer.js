import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function deletePending() {
    console.log('🚀 Iniciando limpieza de agent_buffer...');
    const { data, error, count } = await supabase
        .from('agent_buffer')
        .delete({ count: 'exact' })
        .eq('status', 'pending');

    if (error) {
        console.error('❌ Error eliminando registros:', error);
    } else {
        console.log(`✅ Eliminados ${count} registros en estado 'pending'.`);
    }
}

deletePending();

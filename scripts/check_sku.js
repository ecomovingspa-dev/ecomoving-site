const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    'https://xgdmyjzyejjmwdqkufhp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZG15anp5ZWpqbXdkcWt1ZmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTk0MTgsImV4cCI6MjA3OTM5NTQxOH0.WtEIZ324jxd5ymXJ6RwdXfqFc_qM6UAKJ-ONkbL2J4E'
);
async function run() {
    const { data } = await supabase.from('productos').select('sku_externo, nombre, id').ilike('sku_externo', '%T733%').limit(5);
    console.log('Resultado T733:', data);
}
run();

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    'https://xgdmyjzyejjmwdqkufhp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZG15anp5ZWpqbXdkcWt1ZmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTk0MTgsImV4cCI6MjA3OTM5NTQxOH0.WtEIZ324jxd5ymXJ6RwdXfqFc_qM6UAKJ-ONkbL2J4E'
);

async function run() {
    const query = 'botella';

    console.log(`\n🔍 Probando búsqueda: "${query}"\n`);
    console.log('═'.repeat(60));

    // 1. Query actual (con .or)
    console.log('\n[1] Query con .or() — método actual:');
    const { data: orResult, error: orErr } = await supabase
        .from('productos')
        .select('nombre, categoria, status')
        .eq('status', 'approved')
        .or(`nombre.ilike.%${query}%,categoria.ilike.%${query}%`)
        .limit(20);

    if (orErr) console.error('  ERROR:', orErr.message);
    else {
        console.log(`  Resultados: ${orResult.length}`);
        orResult.forEach(p => console.log(`  → [${p.categoria}] ${p.nombre}`));
    }

    // 2. Query solo por nombre
    console.log('\n[2] Query SOLO por nombre (ilike):');
    const { data: nameResult, error: nameErr } = await supabase
        .from('productos')
        .select('nombre, categoria, status')
        .eq('status', 'approved')
        .ilike('nombre', `%${query}%`)
        .limit(20);

    if (nameErr) console.error('  ERROR:', nameErr.message);
    else {
        console.log(`  Resultados: ${nameResult.length}`);
        nameResult.forEach(p => console.log(`  → [${p.categoria}] ${p.nombre}`));
    }

    // 3. Ver valores únicos de categoría para entender mezcla
    console.log('\n[3] Todas las categorías únicas en la tabla:');
    const { data: allProds } = await supabase
        .from('productos')
        .select('nombre, categoria')
        .eq('status', 'approved');

    if (allProds) {
        const cats = [...new Set(allProds.map(p => p.categoria))].sort();
        cats.forEach(c => {
            const count = allProds.filter(p => p.categoria === c).length;
            const hasBotella = c?.toLowerCase().includes('botella');
            console.log(`  ${hasBotella ? '⚠️ ' : '  '}"${c}" → ${count} productos`);
        });
    }

    // 4. Buscar "mug" explícitamente
    console.log('\n[4] Mug: ¿qué categoría tiene?');
    const { data: mugs } = await supabase
        .from('productos')
        .select('nombre, categoria')
        .eq('status', 'approved')
        .ilike('nombre', '%mug%');
    if (mugs) mugs.forEach(p => console.log(`  → nombre: "${p.nombre}" | categoria: "${p.categoria}"`));

    console.log('\n' + '═'.repeat(60));
}
run();

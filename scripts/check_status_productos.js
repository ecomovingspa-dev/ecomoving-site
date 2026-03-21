const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    'https://xgdmyjzyejjmwdqkufhp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZG15anp5ZWpqbXdkcWt1ZmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTk0MTgsImV4cCI6MjA3OTM5NTQxOH0.WtEIZ324jxd5ymXJ6RwdXfqFc_qM6UAKJ-ONkbL2J4E'
);

async function run() {
    // Obtener TODOS los valores distintos de status y su conteo
    const { data, error } = await supabase
        .from('productos')
        .select('status, nombre, imagen_principal')
        .order('status');

    if (error) { console.error('Error:', error.message); return; }

    // Agrupar por status
    const groups = {};
    for (const row of data) {
        const s = row.status ?? 'null/undefined';
        if (!groups[s]) groups[s] = { count: 0, sinImagen: 0, ejemplos: [] };
        groups[s].count++;
        if (!row.imagen_principal) groups[s].sinImagen++;
        if (groups[s].ejemplos.length < 3) groups[s].ejemplos.push(row.nombre);
    }

    console.log('\n📊 AUDITORÍA TABLA `productos` — Estado actual\n');
    console.log(`Total de productos: ${data.length}\n`);
    console.log('─'.repeat(60));

    for (const [status, info] of Object.entries(groups)) {
        console.log(`\nstatus = "${status}"`);
        console.log(`  Cantidad : ${info.count}`);
        console.log(`  Sin imagen: ${info.sinImagen}`);
        console.log(`  Ejemplos : ${info.ejemplos.join(' | ')}`);
    }
    console.log('\n' + '─'.repeat(60));
}
run();

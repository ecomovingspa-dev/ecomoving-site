'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CatalogoPage() {
    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#050505', color: 'white', padding: '100px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00d4bd', textDecoration: 'none', marginBottom: '40px', fontWeight: 700 }}>
                    <ArrowLeft size={20} /> VOLVER AL INICIO
                </Link>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '20px' }}
                >
                    CATÁLOGO <span style={{ color: '#00d4bd' }}>2026</span>
                </motion.h1>

                <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '600px', lineHeight: 1.6, marginBottom: '60px' }}>
                    Estamos preparando nuestra nueva selección de productos sustentables premium.
                    Vuelve pronto para descubrir lo último en merchandising ecológico.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '30px',
                    opacity: 0.5
                }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} style={{ height: '400px', background: '#111', borderRadius: '24px', border: '1px solid #222' }} />
                    ))}
                </div>
            </div>
        </main>
    );
}

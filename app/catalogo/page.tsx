'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Product {
    id: string;
    nombre: string;
    categoria: string;
    descripcion: string;
    imagen_principal: string;
    precio?: number;
    is_premium?: boolean;
}

export default function CatalogoPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('TODAS');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let query = supabase
                    .from('productos')
                    .select('id, nombre, categoria, descripcion, imagen_principal, is_premium');

                const { data, error } = await query;
                if (error) throw error;
                setProducts(data || []);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = ['TODAS', ...Array.from(new Set(products.map(p => p.categoria.toUpperCase())))];

    const filtered = products.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
            p.descripcion?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'TODAS' || p.categoria.toUpperCase() === category;
        return matchesSearch && matchesCategory;
    });

    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#050505', color: 'white' }}>
            {/* Header Idéntico al Admin */}
            <nav className='nav-master'>
                <div className='logo-brand'>
                    <img src="https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/logo_ecomoving/Logo_horizontal.png" alt="Ecomoving Logo" className="logo-img" />
                </div>
                <div className='header-right' style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <Link href="/" className='nav-item'>VOLVER A INICIO</Link>
                    <div className='search-bar'>
                        <Search size={16} color="#444" />
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </nav>

            <div style={{ padding: '140px 60px 60px' }}>
                {/* Menú de Categorías Estilo Admin (Rectángulos con Borde) */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '60px', overflowX: 'auto', paddingBottom: '10px' }} className="custom-scroll">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`category-btn ${category === cat ? 'active' : ''}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid de Productos */}
                {loading ? (
                    <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 40, height: 40, border: '3px solid #00d4bd', borderTopColor: 'transparent', borderRadius: '50%' }} />
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
                        <AnimatePresence>
                            {filtered.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -10 }}
                                    style={{
                                        backgroundColor: '#0a0a0a',
                                        borderRadius: '24px',
                                        border: '1px solid #151515',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <div style={{ aspectRatio: '1/1', backgroundColor: '#111', overflow: 'hidden', position: 'relative' }}>
                                        <img
                                            src={product.imagen_principal}
                                            alt={product.nombre}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        {product.is_premium && (
                                            <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: '#00d4bd', color: 'black', padding: '5px 15px', borderRadius: '5px', fontSize: '10px', fontWeight: 900, letterSpacing: '2px' }}>
                                                PREMIUM
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '30px' }}>
                                        <span style={{ color: '#00d4bd', fontSize: '10px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>
                                            {product.categoria}
                                        </span>
                                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '10px', marginBottom: '15px', fontFamily: 'var(--font-heading)' }}>
                                            {product.nombre}
                                        </h3>
                                        <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '25px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {product.descripcion}
                                        </p>
                                        <button style={{ width: '100%', padding: '15px', backgroundColor: 'transparent', border: '1px solid #222', color: 'white', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s', fontSize: '11px', letterSpacing: '2px' }}>
                                            COTIZAR <ShoppingBag size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <footer style={{ marginTop: '100px', padding: '60px 0', borderTop: '1px solid #111', textAlign: 'center' }}>
                <p style={{ color: '#444', fontSize: '11px', letterSpacing: '4px' }}>ECOMOVING © 2026 | EXPERIENCIA DE MARCA SUSTENTABLE</p>
            </footer>

            <style jsx>{`
                .search-bar {
                    background: #111;
                    border: 1px solid #222;
                    padding: 8px 15px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 300px;
                }
                .search-bar input {
                    background: transparent;
                    border: none;
                    color: white;
                    outline: none;
                    font-size: 12px;
                    width: 100%;
                }
            `}</style>
        </main>
    );
}

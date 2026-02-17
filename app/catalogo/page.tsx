'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Search, Filter, ShoppingBag } from 'lucide-react';
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
        <main style={{ minHeight: '100vh', backgroundColor: '#050505', color: 'white', padding: '120px 20px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px' }}>
                    <div>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00d4bd', textDecoration: 'none', marginBottom: '30px', fontWeight: 700, fontSize: '12px', letterSpacing: '2px' }}>
                            <ArrowLeft size={16} /> VOLVER AL INICIO
                        </Link>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 0.9, marginBottom: '10px' }}
                        >
                            CATÁLOGO <span style={{ color: '#00d4bd' }}>2026</span>
                        </motion.h1>
                        <p style={{ color: '#666', fontSize: '1.2rem', maxWidth: '600px' }}>
                            Selección exclusiva de merchandising sustentable para marcas con propósito.
                        </p>
                    </div>

                    {/* Buscador y Filtros */}
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    backgroundColor: '#111',
                                    border: '1px solid #222',
                                    padding: '15px 15px 15px 45px',
                                    borderRadius: '12px',
                                    color: 'white',
                                    width: '300px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Filtros de Categoría */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '60px', overflowX: 'auto', paddingBottom: '10px' }} className="custom-scroll">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            style={{
                                padding: '12px 25px',
                                borderRadius: '50px',
                                border: '1px solid',
                                borderColor: category === cat ? '#00d4bd' : '#222',
                                backgroundColor: category === cat ? 'rgba(0, 212, 189, 0.1)' : 'transparent',
                                color: category === cat ? '#00d4bd' : '#666',
                                fontWeight: 700,
                                fontSize: '11px',
                                letterSpacing: '2px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.3s'
                            }}
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
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
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
                                            <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: '#00d4bd', color: 'black', padding: '5px 15px', borderRadius: '50px', fontSize: '10px', fontWeight: 900, letterSpacing: '1px' }}>
                                                PREMIUM
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '30px' }}>
                                        <span style={{ color: '#00d4bd', fontSize: '10px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>
                                            {product.categoria}
                                        </span>
                                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '10px', marginBottom: '15px' }}>
                                            {product.nombre}
                                        </h3>
                                        <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '25px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {product.descripcion}
                                        </p>
                                        <button style={{ width: '100%', padding: '15px', backgroundColor: 'transparent', border: '1px solid #222', color: 'white', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s' }}>
                                            COTIZAR <ShoppingBag size={18} />
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
        </main>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, ShoppingBag, Loader2, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Product {
    id: string;
    nombre: string;
    categoria: string;
    descripcion: string;
    imagen_principal: string;
    imagenes_galeria?: string[];
    features?: string[];
    is_premium?: boolean;
    wholesaler?: string;
}

export default function CatalogoPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('TODAS');

    const specialCategories = ['TODAS', 'ECOLÓGICOS', 'BOTELLAS, MUGS Y TAZAS', 'CUADERNOS, LIBRETAS Y MEMO SET', 'MOCHILAS, BOLSOS Y MORRALES', 'BOLÍGRAFOS', 'ACCESORIOS'];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Obtenemos los productos reales tal cual están en Supabase
                const { data, error } = await supabase
                    .from('productos')
                    .select('*');

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

    const filtered = products.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
            (p.descripcion && p.descripcion.toLowerCase().includes(search.toLowerCase())) ||
            (p.id && p.id.toLowerCase().includes(search.toLowerCase()));

        const catUpper = p.categoria ? p.categoria.toUpperCase() : '';
        const matchesCategory = activeCategory === 'TODAS' || catUpper.includes(activeCategory);

        return matchesSearch && matchesCategory;
    });

    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#050505', color: 'white' }}>
            {/* Header Mirror Admin */}
            <nav className='nav-master'>
                <div className='logo-brand'>
                    <img src="https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/logo_ecomoving/Logo_horizontal.png" alt="Ecomoving Logo" />
                </div>

                <div className='search-container'>
                    <Search className='search-icon' size={20} />
                    <input
                        className='search-input'
                        type="text"
                        placeholder="Buscar por nombre, SKU o categoría..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className='nav-actions' style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <Link href="/" className='nav-item'>INICIO</Link>
                    <Link href="/#contacto" className='nav-item'>CONTACTO</Link>
                </div>
            </nav>

            {/* Split Layout: Sidebar + Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', height: '100vh', paddingTop: '80px', overflow: 'hidden' }}>

                {/* Sidebar - Identical to Gallery Tab in EcomovingWeb */}
                <aside className="custom-scroll" style={{ borderRight: '1px solid rgba(255,255,255,0.05)', padding: '40px 60px', overflowY: 'auto', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <h3 className='sidebar-title'>SECCIONES</h3>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {specialCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`sidebar-btn ${activeCategory === cat ? 'active' : ''}`}
                            >
                                {cat}
                                {activeCategory === cat && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content Area */}
                <section className="custom-scroll" style={{ padding: '60px', overflowY: 'auto' }}>
                    {loading ? (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Loader2 className="animate-spin" color="var(--accent-turquoise)" size={40} />
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
                            <AnimatePresence>
                                {filtered.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="product-card"
                                    >
                                        <div className='image-container'>
                                            <img
                                                src={product.imagen_principal}
                                                alt={product.nombre}
                                                className='product-image'
                                            />
                                            {product.is_premium && (
                                                <div className='premium-badge'>PREMIUM</div>
                                            )}
                                        </div>

                                        <div className="card-content">
                                            <span className='category-label'>{product.categoria}</span>
                                            <h3 className='product-name'>{product.nombre}</h3>

                                            {/* Características Reales (Technical Specs) */}
                                            {product.features && product.features.length > 0 && (
                                                <div style={{ marginBottom: '20px' }}>
                                                    <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                        {product.features.slice(0, 3).map((feat, i) => (
                                                            <li key={i} style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <div style={{ width: '4px', height: '4px', background: 'var(--accent-gold)', borderRadius: '50%' }} />
                                                                {feat}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <p className='product-desc'>{product.descripcion}</p>

                                            <button className='cta-button'>
                                                COTIZAR <ShoppingBag size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {filtered.length === 0 && (
                                <div style={{ gridColumn: '1 / -1', padding: '100px', textAlign: 'center', opacity: 0.2 }}>
                                    <ShoppingBag size={80} style={{ marginBottom: '20px' }} />
                                    <p style={{ letterSpacing: '2px', textTransform: 'uppercase' }}>No se encontraron productos en esta sección.</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Info, Settings, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Product {
    id: string;
    nombre: string;
    categoria: string;
    imagen_principal: string;
}

export default function CatalogoPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('productos')
                    .select('id, nombre, categoria, imagen_principal');
                if (error) throw error;
                setProducts(data || []);
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filtered = products.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.categoria.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#050505' }}>
            {/* Header - Mirror Image 1 */}
            <nav className='nav-master'>
                <div className='nav-left'>
                    <img src="https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/logo_ecomoving/Logo_horizontal.png" alt="Ecomoving Logo" className='logo-img' />
                </div>

                <div className='nav-right'>
                    <Link href="/" className='nav-link'>VOLVER A INICIO</Link>
                    <div className='search-box'>
                        <Search size={14} color="#444" />
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Settings size={18} color="#444" style={{ cursor: 'pointer shadow' }} />
                </div>
            </nav>

            {/* Breadcrumb / Category Navigation - Mirror Image 1 */}
            <div className='cat-nav'>
                <button className='cat-btn-main'>
                    CATEGORIAS <ChevronRight size={14} />
                </button>
                <Link href="#" className='cat-link'>PRODUCTOS ECO</Link>
                <Link href="#" className='cat-link'>PRODUCTOS PREMIUM</Link>
            </div>

            {/* Product Gallery - Mirror Image 1 */}
            {loading ? (
                <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 30, height: 30, border: '2px solid #D4AF37', borderTopColor: 'transparent', borderRadius: '50%' }} />
                </div>
            ) : (
                <div className='product-grid'>
                    <AnimatePresence>
                        {filtered.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="product-item"
                            >
                                <div className='image-wrapper'>
                                    <img src={product.imagen_principal} alt={product.nombre} />
                                    <div className='tag-overlay'>{product.categoria}</div>
                                    <div className='info-overlay'>
                                        <Info size={16} />
                                    </div>
                                </div>
                                <h3 className='product-title'>{product.nombre}</h3>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </main>
    );
}

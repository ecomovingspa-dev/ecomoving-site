'use client';

import React, { useState } from 'react';
import ProductCatalog from '@/components/ProductCatalog';
import CatalogLeadMagnet from '@/components/CatalogLeadMagnet';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default function CatalogPage() {
    const [search, setSearch] = useState('');

    return (
        <main style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
            {/* Header del Catálogo */}
            <nav className="nav-premium">
                <Link href="/" className="brand-logo">
                    <img src="https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/logo_ecomoving/Logo_horizontal.png" alt="Ecomoving Logo" className="logo-img" />
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    <Link href="/" className="nav-item-link" style={{ color: '#888', textDecoration: 'none', fontSize: '10px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>Volver a Inicio</Link>

                    <div style={{ position: 'relative', width: '250px' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: 'rgba(255,255,255,0.4)' }} />
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 40px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '4px',
                                color: 'white',
                                outline: 'none',
                                fontSize: '12px',
                                fontFamily: 'var(--font-body)'
                            }}
                        />
                    </div>
                </div>
            </nav>

            <div style={{ paddingTop: '100px' }}>
                <ProductCatalog adminMode={false} externalSearch={search} />
            </div>

            <CatalogLeadMagnet />

            <footer className="footer-minimal" style={{ padding: '80px 0', textAlign: 'center', borderTop: '1px solid #111', background: '#000' }}>
                <div>
                    <img src="https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/logo_ecomoving/Logo_horizontal.png" alt="Ecomoving Logo" style={{ height: '40px' }} />
                    <p style={{ marginTop: '20px', color: '#444', fontSize: '0.7rem', letterSpacing: '4px', textTransform: 'uppercase' }}>
                        Catálogo Exclusivo para Empresas<br />
                        Ecomoving Premium
                    </p>
                </div>
                <div style={{ marginTop: '40px', fontSize: '0.6rem', color: '#222', letterSpacing: '2px' }}>
                    &copy; {new Date().getFullYear()} ECOMOVING SPA. TODOS LOS DERECHOS RESERVADOS.
                </div>
            </footer>

            <style jsx>{`
                .nav-premium {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    z-index: 1000;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 50px;
                    background: rgba(0,0,0,0.8);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .logo-img {
                    height: 25px;
                    width: auto;
                }
                .nav-item-link:hover {
                    color: var(--accent-turquoise) !important;
                }
            `}</style>
        </main>
    );
}

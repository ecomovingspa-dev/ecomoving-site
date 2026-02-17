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

'use client';

import React, { useState } from 'react';
import ProductCatalog from '@/components/ProductCatalog';
import CatalogLeadMagnet from '@/components/CatalogLeadMagnet';
import Link from 'next/link';

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
                    &copy; 2026 ECOMOVING SPA. TODOS LOS DERECHOS RESERVADOS.
                </div>
            </footer>
        </main>
    );
}

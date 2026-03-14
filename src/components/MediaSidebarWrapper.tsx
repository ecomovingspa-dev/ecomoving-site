'use client';

import { usePathname } from 'next/navigation';
import MediaSidebar from './MediaSidebar';

/**
 * Wrapper que monta el MediaSidebar solo en rutas de administración.
 * Lo excluye automáticamente de /catalogo (vista pública).
 */
export default function MediaSidebarWrapper({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();

    // No mostrar en la página pública del catálogo
    if (pathname === '/catalogo') return null;

    return <MediaSidebar isOpen={isOpen} onClose={onClose} />;
}

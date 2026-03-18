'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Crop, FileText, Image as ImageIcon, Layout, Lock, Unlock, Layers, Rocket, Send, CloudUpload, Monitor, Tablet, Smartphone } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useWebContent, SectionContent, GridCell, DynamicSection, WebContent } from '@/hooks/useWebContent';
import EditorSEO from '@/components/EditorSEO';
import BibliotecaIA from '@/components/BibliotecaIA';
import CatalogHub from '@/components/CatalogHub';
import VisualGallery from '@/components/VisualGallery';
import SectionComposer from '@/components/SectionComposer';
import ProjectLauncher from '@/components/ProjectLauncher';
import ExportModal from '@/components/ExportModal';
import BlockInspector from '@/components/BlockInspector';
import PeekCarousel from '@/components/PeekCarousel';


interface Project {
  id: string;
  name: string;
  repo: string;
  path: string;
  lastExport: string;
  type: 'public' | 'internal';
  status: 'online' | 'ready';
}

const BentoBlock = ({ block, designMode, assets, handleDrop, entryIndex, onClick, isSelected, previewMode }: {
  block: any,
  designMode: boolean,
  assets: any,
  handleDrop: (e: React.DragEvent, id: string) => void,
  entryIndex: number,
  onClick?: () => void,
  isSelected?: boolean,
  previewMode?: string
}) => {
  const currentMode = previewMode || 'desktop';
  let finalCol = block.col || 1;
  let finalRow = block.row || 1;
  let finalSpan = block.span || '1x1';

  if (currentMode === 'tablet') {
    if (block.tCol !== undefined) finalCol = block.tCol;
    if (block.tRow !== undefined) finalRow = block.tRow;
    if (block.tSpan !== undefined) finalSpan = block.tSpan;
  } else if (currentMode === 'mobile') {
    if (block.mCol !== undefined) finalCol = block.mCol;
    if (block.mRow !== undefined) finalRow = block.mRow;
    if (block.mSpan !== undefined) {
      finalSpan = block.mSpan;
    } else {
      // Si no hay mSpan, adaptamos el span de escritorio (usualmente 12) a 48 por defecto
      const [w, h] = (block.span || '12x8').split('x').map((n: string) => parseInt(n) || 12);
      finalSpan = `48x${h}`; // Por defecto full width en móvil si no se ha configurado
    }
  }

  const cardRef = React.useRef<HTMLDivElement>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // ── PRIORIDAD: override manual (drag) > gallery del bloque > imagen del bloque ──
  const [mSpanW, mSpanH] = (block.mSpan || `${block.mCol ? (block.span || '1x1').split('x')[0] : 48}x${(block.span || '1x1').split('x')[1] || 8}`).split('x').map((n: string) => parseInt(n) || 1);
  const [tSpanW, tSpanH] = (block.tSpan || block.span || '1x1').split('x').map((n: string) => parseInt(n) || 1);
  const baseImages = block.gallery && block.gallery.length > 0 ? block.gallery : [block.image].filter(Boolean);
  // En modo 'peek', la galería tiene prioridad: el localStorage override es una sola imagen
  // y rompería el carrusel. Solo se aplica el override en modos de slideshow normales.
  const isPeek = ['peek', 'full-carousel'].includes(block.galleryAnimation || '') && baseImages.length >= 2;
  // Bugfix: ensure we actually have valid image URLs. If a block has NO images defined, fallback to a placeholder if design mode, else empty array.
  const validImages = baseImages.map((img: string) => img?.trim()).filter(Boolean);
  let images = (!isPeek && assets[block.id]) ? [assets[block.id]] : validImages;
  
  if (images.length === 0) {
      images = designMode ? [] : [];
  }
  const [spanW, spanH] = finalSpan.split('x').map((n: string) => parseInt(n) || 1);
  const isText = block.type === 'text' || block.type === 'both';
  const isImage = block.type === 'image' || block.type === 'both' || !block.type;

  const shadowStyles = {
    none: 'none',
    soft: '0 10px 30px rgba(0,0,0,0.3)',
    strong: '0 20px 60px rgba(0,0,0,0.6)',
    neon: `0 0 30px ${block.bgColor}88`
  };

  const zoom = block.transform_zoom || 1;
  const posX = block.transform_posX ?? 50;
  const posY = block.transform_posY ?? 50;
  const aspectRatio = block.transform_aspectRatio || (block.isCircle ? '1/1' : 'auto');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIdx((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const anim = useMemo(() => {
    const type = block.galleryAnimation || 'fade';
    const targetScale = isHovered ? zoom * 1.06 : zoom;

    switch (type) {
      case 'slide-h':
        return { initial: { opacity: 0, x: '100%' }, animate: { opacity: 1, x: 0, scale: targetScale }, exit: { opacity: 0, x: '-100%' } };
      case 'slide-v':
        return { initial: { opacity: 0, y: '100%' }, animate: { opacity: 1, y: 0, scale: targetScale }, exit: { opacity: 0, y: '-100%' } };
      case 'zoom':
        return { initial: { opacity: 0, scale: targetScale * 0.5 }, animate: { opacity: 1, scale: targetScale }, exit: { opacity: 0, scale: targetScale * 1.5 } };
      case 'none':
        return { initial: { opacity: 1, scale: targetScale }, animate: { opacity: 1, scale: targetScale }, exit: { opacity: 1, scale: targetScale } };
      case 'crossfade':
        return { initial: { opacity: 0, scale: targetScale }, animate: { opacity: 1, scale: targetScale }, exit: { opacity: 0, scale: targetScale } };
      default:
        // fade (con ligero scale/desfase)
        return { initial: { opacity: 0, scale: targetScale * 1.02 }, animate: { opacity: 1, scale: targetScale }, exit: { opacity: 0, scale: targetScale * 0.98 } };
    }
  }, [block.galleryAnimation, zoom, isHovered]);

  return (
    <motion.div
      ref={cardRef}
      layoutId={block.id}
      className="bento-block-mobile"
      // ── CONCEPTO PREMIUM: entrada escalonada desde abajo al hacer scroll ──
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: (entryIndex % 6) * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        gridColumn: `var(--final-col) / span var(--final-span-w)`,
        gridRow: `var(--final-row) / span var(--final-span-h)`,
        // CSS Variables for responsive power
        '--final-col': finalCol,
        '--final-row': finalRow,
        '--final-span-w': spanW,
        '--final-span-h': spanH,
        '--t-col': block.tCol ?? block.col ?? 1,
        '--t-row': block.tRow ?? block.row ?? 1,
        '--t-span-w': tSpanW,
        '--t-span-h': tSpanH,
        '--m-col': block.mCol ?? 1,
        '--m-row': block.mRow ?? block.row ?? 1,
        '--m-span-w': mSpanW,
        '--m-span-h': mSpanH,
        zIndex: block.zIndex || 1,
        position: 'relative',
        background: block.gradient
          ? `linear-gradient(135deg, ${block.bgColor}, ${block.bgColor}dd)`
          : (block.bgColor || '#111'),
        borderRadius: block.isCircle ? '50%' : (block.borderRadius || '12px'),
        aspectRatio: aspectRatio,
        ...({ '--mobile-aspect': `${spanW} / ${spanH}` } as any),
        boxShadow: isHovered
          ? (shadowStyles[block.shadow as keyof typeof shadowStyles] || '0 20px 60px rgba(0,0,0,0.5)')
          : (shadowStyles[block.shadow as keyof typeof shadowStyles] || shadowStyles.none),
        backdropFilter: block.blur ? `blur(${block.blur})` : 'none',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: isText ? '40px' : '0',
        border: designMode
          ? isSelected
            ? '2px solid var(--eco-accent-primary)'
            : '1px dashed rgba(0,212,189,0.3)'
          : (isHovered
            ? `1px solid ${block.borderColor || 'rgba(255,255,255,0.10)'}`
            : `1px solid ${block.borderColor || 'rgba(255,255,255,0.03)'}`),
        cursor: designMode ? 'pointer' : (block.link ? 'pointer' : 'default'),
        margin: '4px',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)'
      }}
      whileHover={!designMode ? { scale: 1.012, y: -4 } : {}}
      onClick={designMode && onClick ? onClick : undefined}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, block.id)}
    >
      {/* ── CONCEPTO PREMIUM: Spotlight radial que sigue al cursor ── */}
      {!designMode && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.055), transparent 45%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {designMode && block.label && (
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, background: 'rgba(0,212,189,0.1)', color: '#00d4bd', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
          {block.label}
        </div>
      )}

      {isImage && (
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
          {/* ── MODO CARRUSEL INTERACTIVO ── */}
          {block.galleryAnimation === 'peek' && images.length >= 2 ? (
            <PeekCarousel images={images} mode="peek" />
          ) : block.galleryAnimation === 'full-carousel' && images.length >= 2 ? (
            <PeekCarousel images={images} mode="full" />
          ) : (
            <AnimatePresence mode="wait">
              {images[currentIdx] ? (
                <motion.img
                  key={`${block.id}-${currentIdx}`}
                  initial={anim.initial}
                  animate={anim.animate}
                  exit={anim.exit}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  src={images[currentIdx]}
                  style={{
                    position: 'absolute',
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    objectPosition: `${posX}% ${posY}%`,
                    opacity: block.type === 'both' ? 0.4 : 1,
                    zIndex: 1,
                    transition: 'object-position 0.2s ease-out'
                  }}
                  alt={block.label}
                />
              ) : (
                <motion.div 
                  key="empty-image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}
                >
                  {designMode && <ImageIcon className="w-6 h-6 text-white/10" />}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      )}

      {/* CONTEXTO EDITORIAL */}
      {(block.blockTitle || block.blockParagraph || block.link) && (
        <div style={{
          position: 'absolute',
          top: block.textPadding ? (block.textPadding.includes(' ') ? block.textPadding.split(' ')[0] : block.textPadding) : '30px',
          left: block.textPadding ? (block.textPadding.includes(' ') ? block.textPadding.split(' ')[1] || block.textPadding.split(' ')[0] : block.textPadding) : '30px',
          right: block.textPadding ? (block.textPadding.includes(' ') ? block.textPadding.split(' ')[1] || block.textPadding.split(' ')[0] : block.textPadding) : '30px',
          bottom: block.textPadding ? (block.textPadding.includes(' ') ? block.textPadding.split(' ')[0] : block.textPadding) : '30px',
          zIndex: 20, pointerEvents: 'none',
          display: 'flex', flexDirection: 'column',
          alignItems: block.textAlign === 'center' ? 'center' : (block.textAlign === 'right' ? 'flex-end' : 'flex-start'),
          justifyContent: block.textVerticalAlign || 'flex-start',
          ...(block.textProtection && {
            background: block.textAlign === 'center' 
               ? 'radial-gradient(circle at center, rgba(0,0,0,0.45) 0%, transparent 80%)' 
               : `linear-gradient(${block.textAlign === 'right' ? 'to left' : 'to right'}, rgba(0,0,0,0.5) 0%, transparent 90%)`,
            borderRadius: '20px',
            padding: '20px'
          })
        }}>
          {block.blockTitle && (
            <h2 style={{
              margin: '0 0 15px 0',
              color: block.textColor || '#ffffff',
              fontSize: block.titleSize || '2rem',
              fontWeight: parseInt(block.fontWeight || '700'),
              textAlign: block.textAlign || 'left',
              textTransform: block.textTransform || 'none',
              letterSpacing: block.letterSpacing || 'normal',
              fontFamily: 'var(--eco-font-display)',
              textShadow: block.textProtection 
                ? '0 0 20px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.8)' 
                : '0 4px 20px rgba(0,0,0,0.6)',
              lineHeight: block.titleLineHeight || 1.1,
              maxWidth: block.textMaxWidth || '90%'
            }}>
              {block.blockTitle}
            </h2>
          )}
          {block.blockTitle && block.blockParagraph && (
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--eco-accent-primary)', margin: `0 0 ${block.textGap || '15px'} 0`, opacity: 0.8 }} />
          )}
          {block.blockParagraph && (
            <p style={{
              margin: '0 0 20px 0',
              color: block.textColor ? `${block.textColor}dd` : '#cccccc',
              fontSize: block.paragraphSize || '1rem', fontWeight: 400,
              textAlign: block.textAlign || 'left',
              lineHeight: block.lineHeight || '1.5',
              fontStyle: block.fontStyle || 'normal',
              maxWidth: block.textMaxWidth || '600px',
              textShadow: block.textProtection 
                ? '0 0 10px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.9)' 
                : '0 2px 10px rgba(0,0,0,0.8)'
            }}>
              {block.blockParagraph}
            </p>
          )}

          {/* Botón CTA inyectado por la IA */}
          {block.link && (
            <div
              style={{
                marginTop: 'auto', // Lo empuja hacia abajo si es que hay espacio
                padding: '10px 24px',
                backgroundColor: 'var(--eco-accent-primary)',
                color: 'black',
                fontWeight: 800,
                fontSize: '12px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                borderRadius: '4px',
                boxShadow: '0 4px 15px rgba(0,212,189,0.4)',
                pointerEvents: 'auto', // Permite click a pesar del puntero padre
                transition: 'transform 0.2s',
              }}
              onClick={(e) => {
                if (!designMode) {
                  e.stopPropagation();
                  window.location.href = block.link;
                }
              }}
            >
              VER DETALLE
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const { content, loading: contentLoading, refetch: refetchContent, updateSection } = useWebContent();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Tools State
  const [isEditorSEOOpen, setIsEditorSEOOpen] = useState(false);
  const [isBibliotecaOpen, setIsBibliotecaOpen] = useState(false);
  const [isCatalogHubOpen, setIsCatalogHubOpen] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [designMode, setDesignMode] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const [previewSections, setPreviewSections] = useState<DynamicSection[] | null>(null);

  const [isProduction, setIsProduction] = useState(false);
  const [isAdminBypass, setIsAdminBypass] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isProd = hostname.includes('ecomoving.cl') || hostname.includes('vercel.app');
      const bypass = window.location.search.includes('admin=true') || window.location.search.includes('design=true');
      setIsProduction(isProd);
      setIsAdminBypass(bypass);

      if (isProd && !bypass) {
        setSelectedProject({ id: 'prod', name: 'Ecomoving | Sitio Público', repo: '', path: '', lastExport: '', type: 'public', status: 'online' });
      }
    }
  }, []);

  // Asset State
  const [assets, setAssets] = useState<Record<string, string>>({
    hero: '',
  });

  const handleComposerChange = useCallback((newSections: DynamicSection[]) => {
    setPreviewSections(newSections);
  }, []);

  // ── INDEPENDENCIA AUTOMÁTICA: Popular campos responsive si faltan ──
  useEffect(() => {
    if (content?.sections && !previewSections) {
      const source = content.sections;
      const ms = source.find((s: any) => s.id === 'infinite_grid');
      if (ms && ms.blocks) {
        let changed = false;
        const newBlocks = ms.blocks.map((b: any) => {
          const updates: any = {};
          if (b.tCol === undefined) { updates.tCol = b.col || 1; changed = true; }
          if (b.tRow === undefined) { updates.tRow = b.row || 1; changed = true; }
          if (b.tSpan === undefined) { updates.tSpan = b.span || '1x1'; changed = true; }
          if (b.mCol === undefined) { updates.mCol = b.col || 1; changed = true; }
          if (b.mRow === undefined) { updates.mRow = b.row || 1; changed = true; }
          if (b.mSpan === undefined) { updates.mSpan = b.span || '1x1'; changed = true; }
          return changed ? { ...b, ...updates } : b;
        });

        if (changed) {
          const newSections = source.map((s: any) => s.id === ms.id ? { ...s, blocks: newBlocks } : s);
          setPreviewSections(newSections);
          updateSection('sections', newSections);
        }
      }
    }
  }, [content, previewSections, updateSection]);

  const handleComposerClose = useCallback(() => {
    setPreviewSections(null);
    setIsComposerOpen(false);
  }, []);

  // ── Inspector: actualizar un bloque y guardar en Supabase ──
  const handleBlockUpdate = useCallback((blockId: string, updates: Partial<any>) => {
    const source = previewSections || content?.sections;
    if (!Array.isArray(source)) return;

    // ── RESPONSIVE MAPPER ──
    const mappedUpdates: any = { ...updates };
    if (previewMode === 'tablet') {
      if ('col' in updates) { mappedUpdates.tCol = updates.col; delete mappedUpdates.col; }
      if ('row' in updates) { mappedUpdates.tRow = updates.row; delete mappedUpdates.row; }
      if ('span' in updates) { mappedUpdates.tSpan = updates.span; delete mappedUpdates.span; }
    } else if (previewMode === 'mobile') {
      if ('col' in updates) { mappedUpdates.mCol = updates.col; delete mappedUpdates.col; }
      if ('row' in updates) { mappedUpdates.mRow = updates.row; delete mappedUpdates.row; }
      if ('span' in updates) { mappedUpdates.mSpan = updates.span; delete mappedUpdates.span; }
    }

    const newSections = source.map((s: any) => {
      if (!s.blocks) return s;
      return { ...s, blocks: s.blocks.map((b: any) => b.id === blockId ? { ...b, ...mappedUpdates } : b) };
    });
    setPreviewSections(newSections);
    updateSection('sections', newSections);
  }, [previewSections, content, updateSection, previewMode]);

  const handleBlockDelete = useCallback((blockId: string) => {
    const source = previewSections || content?.sections;
    if (!Array.isArray(source)) return;
    const newSections = source.map((s: any) => ({
      ...s, blocks: (s.blocks || []).filter((b: any) => b.id !== blockId)
    }));
    setPreviewSections(newSections);
    updateSection('sections', newSections);
    setSelectedBlockId(null);
  }, [previewSections, content, updateSection]);

  // ── Agregar bloque nuevo ──
  const handleAddBlock = useCallback(() => {
    let source = previewSections || content?.sections;
    if (!Array.isArray(source)) source = [];
    
    // Buscar la sección de la grilla o crearla si está vacío
    let ms = source.find((s: any) => s.id === 'infinite_grid' || (s.title1 && s.title1.includes('LIENZO')));
    
    if (!ms && source.length === 0) {
      // Si todo está vacío, inicializamos la estructura base
      ms = { 
        id: 'infinite_grid', 
        order: 1, 
        title1: 'LIENZO INFINITO', 
        paragraph1: 'Grid maestra de 48 columnas.', 
        bgColor: '#0c0c0c', 
        blocks: [] 
      };
      source = [ms];
    } else if (!ms && source.length > 0) {
      ms = source[0];
    }

    if (!ms) return;

    const blocks = ms.blocks || [];
    const nextRow = blocks.reduce((acc: number, b: any) => {
      const [, h] = (b.span || '4x2').split('x').map(Number);
      return Math.max(acc, (b.row || 1) + (h || 2) + 3);
    }, 1);

    const newBlock = {
      id: `block_${Date.now()}`,
      label: 'NUEVO BLOQUE', 
      type: 'image' as const,
      span: '24x20', 
      col: 1, 
      row: nextRow,
      // INDEPENDENCIA AUTOMÁTICA DESDE EL INICIO
      tCol: 1,
      tRow: nextRow,
      tSpan: '48x20', // Tablet default span (full width usually better)
      mCol: 1,
      mRow: nextRow,
      mSpan: '48x15', // Mobile default span
      zIndex: 1, 
      opacity: 1, 
      borderRadius: '24px', 
      shadow: 'none' as const,
      textAlign: 'center' as const, 
      gallery: []
    };

    const newSections = source.map((s: any) =>
      s.id === ms.id ? { ...s, blocks: [...(s.blocks || []), newBlock] } : s
    );

    setPreviewSections(newSections);
    updateSection('sections', newSections);
    setSelectedBlockId(newBlock.id);
  }, [previewSections, content, updateSection]);

  // ── Cambiar color de fondo del lienzo ──
  const handleCanvasBgChange = useCallback((color: string) => {
    const source = previewSections || content?.sections;
    if (!Array.isArray(source)) return;
    const newSections = source.map((s: any) =>
      s.id === 'infinite_grid' || (source.length === 1) ? { ...s, bgColor: color } : s
    );
    setPreviewSections(newSections);
    updateSection('sections', newSections);
  }, [previewSections, content, updateSection]);

  /* 
  useEffect(() => {
    const saved = localStorage.getItem('ecomoving_assets');
    if (saved) {
      try {
        setAssets(JSON.parse(saved));
      } catch {
        localStorage.removeItem('ecomoving_assets');
      }
    }
  }, []);
  */

  // ── Purga de huérfanos: cuando cambia el contenido, limpia keys obsoletas del localStorage ──
  useEffect(() => {
    const source = previewSections || content?.sections;
    let blocks: any[] | undefined;
    if (Array.isArray(source)) {
      const ms = source.find((s: any) => s.id === 'infinite_grid') || (source.length === 1 ? source[0] : null);
      blocks = ms?.blocks;
    } else if (source) {
      const ms = (source as any)['infinite_grid'] || (Object.values(source).length === 1 ? Object.values(source)[0] : null);
      blocks = (ms as any)?.blocks;
    }
    if (!blocks || blocks.length === 0) return;
    const saved = localStorage.getItem('ecomoving_assets');
    if (!saved) return;
    try {
      const stored: Record<string, string> = JSON.parse(saved);
      const validIds = new Set(['hero', ...blocks.map((b: any) => b.id)]);
      const cleaned = Object.fromEntries(Object.entries(stored).filter(([k]) => validIds.has(k)));
      if (Object.keys(cleaned).length !== Object.keys(stored).length) {
        localStorage.setItem('ecomoving_assets', JSON.stringify(cleaned));
        setAssets(cleaned);
      }
    } catch { /* safe to ignore */ }
  }, [content, previewSections]);

  const handleDeploy = async () => {
    if (!confirm('¿Estás seguro de enviar los cambios a GitHub? Esto actualizará el sitio web público.')) return;
    setIsDeploying(true);
    try {
      const res = await fetch('/api/git-sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('¡ÉXITO! ' + data.message);
      } else {
        alert('ERROR: ' + data.error);
      }
    } catch (err) {
      alert('Error de conexión con el servidor de despliegue.');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDrop = async (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    const url = e.dataTransfer.getData('image_url')?.trim();
    if (!url) return;

    // 1. Actualización Visual Inmediata (Local)
    const newAssets = { ...assets, [blockId]: url };
    setAssets(newAssets);

    // 2. Persistencia Real en Base de Datos (Supabase)
    const source = previewSections || content?.sections;
    if (!Array.isArray(source)) return;

    const newSections = source.map((s: any) => {
      if (!s.blocks) return s;
      return { 
        ...s, 
        blocks: s.blocks.map((b: any) => 
          b.id === blockId ? { ...b, image: url, gallery: [url] } : b
        ) 
      };
    });

    setPreviewSections(newSections);
    await updateSection('sections', newSections);
    console.log(`[Constructor] Imagen persistida en bloque ${blockId}: ${url}`);
  };


  const heroContent = content?.hero || { title1: 'ECOMOVING', cta_text: 'EXPLORAR', cta_link: '#' };

  const heroImages = useMemo(() => {
    return [
      (heroContent as any).background_image || assets.hero,
      (heroContent as any).background_image_2,
      (heroContent as any).background_image_3
    ].filter(Boolean);
  }, [heroContent, assets.hero]);

  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroSlide(prev => (prev + 1) % heroImages.length);
      }, 5500); // 5.5s transición premium
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  if (contentLoading) return <div className='loading-screen'>ECOMOVING SPA</div>;

 
  if (!selectedProject && !isProduction) {
    return <ProjectLauncher onSelect={(p) => setSelectedProject(p)} />;
  }

  const showAdminUI = !isProduction || isAdminBypass;

  // 1. Buscar la sección maestra (Soporte Live Preview)
  const source = previewSections || content?.sections;
  let masterSection: any;

  if (Array.isArray(source)) {
    masterSection = source.find(s => s.id === 'infinite_grid');
    if (!masterSection && source.length === 1) masterSection = source[0];
  } else {
    masterSection = (source as any)?.['infinite_grid'];
    if (!masterSection && source) {
      const values = Object.values(source);
      if (values.length === 1) masterSection = values[0];
    }
  }

  const hasBlocks = masterSection && masterSection.blocks && masterSection.blocks.length > 0;

  return (
    <main className={designMode ? 'design-mode' : ''} style={{ backgroundColor: 'var(--eco-bg-primary)', color: 'white', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '4px',
          background: 'var(--eco-accent-gradient)',
          transformOrigin: '0%', zIndex: 2000,
          scaleX
        }}
      />

 
      {/* --- NAV MASTER (Solo Admin) --- */}
      {showAdminUI && (
        <nav className='nav-master'>
          <div className='logo-brand'>
            <img src="https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/logo_ecomoving/Logo_horizontal.png" alt="Ecomoving Logo" className="logo-img" />
          </div>
          <div className='nav-actions' style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setSelectedProject(null)} className='nav-btn' style={{ background: 'rgba(255,100,100,0.1)', color: '#ff6b6b' }}><Rocket size={16} /> SALIR</button>

            <button
              onClick={handleDeploy}
              className='nav-btn'
              style={{ background: isDeploying ? 'rgba(0, 212, 189, 0.2)' : 'rgba(255,255,255,0.05)', color: isDeploying ? '#00d4bd' : '#aaa', borderColor: isDeploying ? '#00d4bd' : 'rgba(255,255,255,0.1)' }}
              disabled={isDeploying}
            >
              <CloudUpload size={16} className={isDeploying ? 'animate-bounce' : ''} />
              {isDeploying ? 'ENVIANDO...' : 'PUBLISH'}
            </button>

            <button onClick={() => setIsCatalogHubOpen(true)} className='nav-btn'><Layout size={16} /> HUB</button>
            <button onClick={() => setIsBibliotecaOpen(true)} className='nav-btn'><ImageIcon size={16} /> BIBLIOTECA</button>
            <button onClick={() => setIsEditorSEOOpen(true)} className='nav-btn'><FileText size={16} /> SEO</button>
            
            {/* SIMULADOR DISPOSITIVOS */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', marginLeft: '10px' }}>
              <button onClick={() => setPreviewMode('desktop')} className='nav-btn' style={{ border: 'none', borderRadius: 0, backgroundColor: previewMode === 'desktop' ? 'rgba(0,212,189,0.2)' : 'transparent', color: previewMode === 'desktop' ? '#00d4bd' : '#aaa' }} title="Desktop View">
                <Monitor size={16} />
              </button>
              <button onClick={() => setPreviewMode('tablet')} className='nav-btn' style={{ border: 'none', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRadius: 0, backgroundColor: previewMode === 'tablet' ? 'rgba(0,212,189,0.2)' : 'transparent', color: previewMode === 'tablet' ? '#00d4bd' : '#aaa' }} title="Tablet View">
                <Tablet size={16} />
              </button>
              <button onClick={() => setPreviewMode('mobile')} className='nav-btn' style={{ border: 'none', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRadius: 0, backgroundColor: previewMode === 'mobile' ? 'rgba(0,212,189,0.2)' : 'transparent', color: previewMode === 'mobile' ? '#00d4bd' : '#aaa' }} title="Mobile View">
                <Smartphone size={16} />
              </button>
            </div>

            {selectedProject?.type === 'public' && (
              <button onClick={() => setIsExportModalOpen(true)} className='nav-btn' style={{ background: 'var(--accent-gold)11', color: 'var(--accent-gold)', borderColor: 'var(--accent-gold)33', marginLeft: '10px' }}><Send size={16} /> EXPORTAR</button>
            )}
            <button onClick={() => { setDesignMode(!designMode); setSelectedBlockId(null); }} className='nav-btn'
              style={designMode ? { background: 'rgba(0,212,189,0.15)', color: '#00d4bd', borderColor: 'rgba(0,212,189,0.5)', marginLeft: '10px' } : { marginLeft: '10px' }}>
              <Crop size={16} /> {designMode ? '● DISEÑO' : 'DISEÑO'}
            </button>
          </div>
        </nav>
      )}

      <div style={{ padding: showAdminUI ? '80px 0 0 0' : '0', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: previewMode !== 'desktop' ? '#111' : 'transparent' }}>
        <div 
          className={`device-preview-wrapper ${previewMode} ${designMode ? 'design-active' : ''}`}
          style={{
            width: previewMode === 'desktop' ? '100%' : previewMode === 'tablet' ? '768px' : '375px',
            backgroundColor: 'var(--eco-bg-primary)',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: '100vh',
            transformOrigin: 'top center',
            overflowX: 'hidden',
            boxShadow: previewMode !== 'desktop' ? '0 30px 60px rgba(0,0,0,0.8)' : 'none',
            border: previewMode === 'mobile' ? '8px solid #333' : previewMode === 'tablet' ? '4px solid #222' : 'none',
            borderRadius: previewMode === 'mobile' ? '40px' : previewMode === 'tablet' ? '20px' : '0',
            marginTop: previewMode !== 'desktop' ? '30px' : '0',
            marginBottom: previewMode !== 'desktop' ? '50px' : '0',
            position: 'relative'
          }}
        >
          {previewMode === 'mobile' && (
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '120px', height: '20px', backgroundColor: '#333', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', zIndex: 9999 }}></div>
          )}

      {/* --- HERO SECTION --- */}
      <section
        className='hero-premium'
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, 'hero')}
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: (heroContent as any).text_align_v === 'top' ? 'flex-start' : (heroContent as any).text_align_v === 'bottom' ? 'flex-end' : 'center',
          justifyContent: (heroContent as any).text_align_h === 'left' ? 'flex-start' : (heroContent as any).text_align_h === 'right' ? 'flex-end' : 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '120px 50px' // Aire extra para cuando el texto se alinea a los bordes
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <AnimatePresence mode="popLayout">
            {(heroImages[currentHeroSlide] || assets.hero) ? (
              <motion.img
                key={currentHeroSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                src={heroImages[currentHeroSlide] || assets.hero}
                alt="Ecomoving"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : null}
          </AnimatePresence>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.8) 120%)' }} />
        </div>

        {/* Indicadores de Slide */}
        {heroImages.length > 1 && (
          <div style={{ position: 'absolute', bottom: '40px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '10px', zIndex: 10 }}>
            {heroImages.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentHeroSlide(idx)}
                style={{
                  width: idx === currentHeroSlide ? '30px' : '8px',
                  height: '4px',
                  borderRadius: '2px',
                  background: idx === currentHeroSlide ? 'var(--eco-accent-primary)' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            ))}
          </div>
        )}
        <div style={{ position: 'relative', zIndex: 2, textAlign: (heroContent as any).text_align_h || 'center', maxWidth: '1000px', width: '100%' }}>
          {(heroContent as any).title1 && (
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              style={{ fontSize: '5rem', fontFamily: 'var(--font-heading)', lineHeight: (heroContent as any).titleLineHeight || 1, marginBottom: '20px', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
            >
              {(heroContent as any).title1}
            </motion.h1>
          )}
          {(heroContent as any).paragraph1 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ fontSize: '1.5rem', color: '#ccc', marginBottom: '40px', letterSpacing: '2px', textShadow: '0 2px 10px rgba(0,0,0,0.9)', lineHeight: (heroContent as any).paragraphLineHeight || 1.4 }}
            >
              {(heroContent as any).paragraph1}
            </motion.p>
          )}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <Link href={(heroContent as any).cta_link || '/catalogo'} className='cta-luxury' style={{ display: 'inline-block', padding: '15px 40px', background: 'var(--eco-accent-primary)', color: '#000', fontWeight: 900, borderRadius: '2px', letterSpacing: '2px', textDecoration: 'none', boxShadow: '0 0 20px rgba(0,212,189,0.4)' }}>
              {(heroContent as any).cta_text || 'EXPLORAR CATÁLOGO'}
            </Link>
          </motion.div>
        </div>
      </section>



      {/* --- INFINITE GRID CANVAS (24 COLUMNS) --- */}
      <section id="infinite-canvas" style={{
        minHeight: hasBlocks ? '100vh' : '0', // Ocultamos la franja negra si no hay bloques
        display: hasBlocks ? 'block' : 'none', // Directamente lo desaparecemos visualmente
        background: 'var(--eco-bg-primary)', // Match con el fondo de la página
        position: 'relative',
        padding: '0'
      }}>
        {/* Visual Guide for 48 Cols (visible only in Design Mode) */}
        {designMode && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'grid', gridTemplateColumns: 'repeat(48, 1fr)', gap: '0',
            pointerEvents: 'none', zIndex: 9999, opacity: 0.1
          }}>
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} style={{ borderRight: '1px solid var(--eco-accent-primary)', height: '100%' }} />
            ))}
          </div>
        )}

        {/* --- AQUÍ EMPIEZA EL LIENZO INFINITO --- */}
        {hasBlocks && (masterSection?.title1?.trim() || masterSection?.paragraph1?.trim()) && (
          <div className="section-header-wrap" style={{ 
            padding: previewMode === 'mobile' ? '60px 20px 40px 20px' : '100px 60px 60px 60px', 
            width: '100%', maxWidth: '1400px', margin: '0 auto' 
          }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {masterSection.title1?.trim() && (
                <h2 style={{ 
                  fontSize: 'clamp(3rem, 6vw, 5rem)', 
                  fontFamily: 'var(--eco-font-display)', 
                  letterSpacing: '6px',
                  marginBottom: '15px',
                  color: 'white',
                  position: 'relative',
                  display: 'inline-block',
                  textTransform: 'uppercase'
                }}>
                  {masterSection.title1}
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 1.2, ease: "circOut" }}
                    style={{ 
                      position: 'absolute', 
                      bottom: '-8px', 
                      left: 0, 
                      height: '4px', 
                      background: 'var(--eco-accent-gradient)',
                      borderRadius: '2px',
                      boxShadow: '0 0 15px rgba(0, 229, 160, 0.4)'
                    }}
                  />
                </h2>
              )}
              {masterSection.paragraph1?.trim() && (
                <p style={{ 
                  fontSize: '1.2rem', 
                  fontFamily: 'var(--eco-font-heading)', 
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: '25px',
                  letterSpacing: '2px',
                  fontWeight: 300
                }}>
                  {masterSection.paragraph1}
                </p>
              )}
            </motion.div>
          </div>
        )}
        <div className="responsive-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(48, 1fr)',
          gridAutoRows: '15px', // Micro-resolución de 15px para control total
          gridAutoFlow: 'dense',
          gap: '0px',
          padding: hasBlocks ? '20px' : '0',
          width: '100%',
          maxWidth: '100%',
          backgroundColor: 'var(--eco-bg-primary)',
          overflow: 'visible'
        }}>

          {hasBlocks && [...masterSection.blocks].sort((a: any, b: any) => {
            // Sort primarily by row (top to bottom)
            if (a.row !== b.row) return (a.row || 0) - (b.row || 0);
            // Sort secondarily by col (left to right)
            return (a.col || 0) - (b.col || 0);
          }).map((block: any, idx: number) => (
            <BentoBlock
              key={block.id}
              block={block}
              designMode={designMode}
              assets={assets}
              entryIndex={idx}
              isSelected={selectedBlockId === block.id}
              previewMode={previewMode}
              onClick={() => setSelectedBlockId(selectedBlockId === block.id ? null : block.id)}
              handleDrop={(e: any) => handleDrop(e, block.id)}
            />
          ))}

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ padding: '80px 0', textAlign: 'center', borderTop: '1px solid #111', background: '#000' }}>
        <div style={{ marginBottom: '20px' }}>
          <img src="https://xgdmyjzyejjmwdqkufhp.supabase.co/storage/v1/object/public/logo_ecomoving/Logo_horizontal.png" alt="Ecomoving Logo" className="logo-img-footer" />
        </div>
        <div style={{ fontSize: '0.8rem', color: '#555', letterSpacing: '4px', marginBottom: '30px' }}>CHILE &bull; SUSTENTABILIDAD &bull; DISEÑO</div>
        <div style={{ fontSize: '0.7rem', color: '#333' }}>© 2026 TODOS LOS DERECHOS RESERVADOS</div>
      </footer>
      
      </div> {/* CLOSING WRAPPER DIV */}
      </div> {/* CLOSING OUTER PADDING DIV */}

      {/* --- TOOLS --- */}
      <SectionComposer
        isOpen={isComposerOpen}
        onClose={handleComposerClose}
        content={content}
        onSave={(newSections) => {
          // Si estamos en modo infinito, newSections[0] es nuestra grid maestra
          if (newSections.length > 0 && newSections[0].id === 'infinite_grid') {
            // Aquí deberíamos llamar a updateSection, pero por ahora solo cerramos
            // La lógica real de guardado debe implementarse en useWebContent para soportar este modo
            updateSection('sections', newSections);
          }
          handleComposerClose();
        }}
        onChange={handleComposerChange}
      />
      <EditorSEO isOpen={isEditorSEOOpen} onClose={() => setIsEditorSEOOpen(false)} onContentUpdate={(section, newContent) => {
        updateSection(section as any, newContent);
        if (section === 'sections') {
          setPreviewSections(newContent);
        }
      }} selectedBlockId={selectedBlockId} />
      {isBibliotecaOpen && <BibliotecaIA onClose={() => setIsBibliotecaOpen(false)} />}
      <CatalogHub isOpen={isCatalogHubOpen} onClose={() => setIsCatalogHubOpen(false)} />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={selectedProject as any}
      />

      {/* ── INSPECTOR ÚNICO — siempre visible en design mode ── */}
      <AnimatePresence>
        {designMode && (() => {
          const source = previewSections || content?.sections;
          const ms = Array.isArray(source)
            ? (source.find((s: any) => s.id === 'infinite_grid') || (source.length === 1 ? source[0] : null))
            : null;
          const allBlocks: any[] = ms?.blocks || [];
          const inspectedBlock = selectedBlockId ? (allBlocks.find((b: any) => b.id === selectedBlockId) || null) : null;
          
          // Mapear coordenadas actuales para el Inspector si estamos en responsive
          let mappedBlock = inspectedBlock ? { ...inspectedBlock } : null;
          if (mappedBlock) {
             if (previewMode === 'tablet') {
               if (mappedBlock.tCol !== undefined) mappedBlock.col = mappedBlock.tCol;
               if (mappedBlock.tRow !== undefined) mappedBlock.row = mappedBlock.tRow;
               if (mappedBlock.tSpan !== undefined) mappedBlock.span = mappedBlock.tSpan;
             } else if (previewMode === 'mobile') {
               if (mappedBlock.mCol !== undefined) mappedBlock.col = mappedBlock.mCol;
               if (mappedBlock.mRow !== undefined) mappedBlock.row = mappedBlock.mRow;
               if (mappedBlock.mSpan !== undefined) mappedBlock.span = mappedBlock.mSpan;
             }
          }

          return (
            <BlockInspector
              block={mappedBlock}
              allBlocks={allBlocks}
              canvasBgColor={ms?.bgColor || '#000000'}
              onClose={() => setDesignMode(false)}
              onUpdate={handleBlockUpdate}
              onDelete={handleBlockDelete}
              onAddBlock={handleAddBlock}
              onSelectBlock={(id) => setSelectedBlockId(id || null)}
              onCanvasBgChange={handleCanvasBgChange}
            />
          );
        })()}
      </AnimatePresence>

      <style jsx global>{`
        .nav-master {
          position: fixed; top: 0; width: 100%; z-index: 1000;
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 50px; background: rgba(0,0,0,0.8); backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .logo-brand { font-family: var(--font-heading); letter-spacing: 6px; font-weight: 900; }
        .nav-btn {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: #aaa; padding: 8px 16px; border-radius: 4px; font-size: 11px;
          cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s;
        }
        .nav-btn:hover { color: var(--eco-accent-primary); border-color: var(--eco-accent-primary); }
        .cta-luxury:hover { transform: scale(1.05); box-shadow: var(--eco-accent-glow); }
        .loading-screen { height: 100vh; background: var(--eco-bg-primary); color: var(--eco-accent-primary); display: flex; align-items: center; justify-content: center; font-size: 2rem; letter-spacing: 15px; font-family: var(--eco-font-display); }

        /* --- RESPONSIVE MOBILE FIXES --- */
        @media (max-width: 768px) {
          .nav-master {
            flex-direction: column;
            padding: 15px 20px;
            gap: 15px;
            position: relative; 
          }
          .nav-actions {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
        
        /* Mobile Breakpoint: Only padding and font changes */
        @media (max-width: 768px) {
           .hero-premium { padding: 120px 20px !important; }
           .hero-premium h1 { font-size: 3rem !important; }
           .hero-premium p { font-size: 1.1rem !important; }
        }

        /* Simulator Mobile: Preserve the Grid for Design */
        .device-preview-wrapper.mobile .hero-premium { padding: 80px 20px !important; }
        .device-preview-wrapper.mobile .hero-premium h1 { font-size: 2.22rem !important; }
        .device-preview-wrapper.mobile .hero-premium p { font-size: 1rem !important; }
        /* Grid is preserved as in Tablet, allowing precise editing */

        /* Simulator Tablet: Preserve the Grid in Tablet View */
        .device-preview-wrapper.tablet .hero-premium { padding: 120px 40px !important; }
        .device-preview-wrapper.tablet .hero-premium h1 { font-size: 4rem !important; }
        /* No longer unsetting grid for tablet, so design stays in place */

        /* Real Tablet: Preserve the Grid */
        @media (min-width: 769px) and (max-width: 1024px) {
           .hero-premium { padding: 120px 40px !important; }
           .hero-premium h1 { font-size: 4rem !important; }
        }

        /* RESPONSIVE INDEPENDENCE ENGINE (Auto-switch in public site) */
        @media (min-width: 769px) and (max-width: 1024px) {
           main:not(.design-mode) .bento-block-mobile { 
              --final-col: var(--t-col) !important;
              --final-row: var(--t-row) !important;
              --final-span-w: var(--t-span-w) !important;
              --final-span-h: var(--t-span-h) !important;
           }
        }
        @media (max-width: 768px) {
           main:not(.design-mode) .bento-block-mobile { 
              --final-col: var(--m-col) !important;
              --final-row: var(--m-row) !important;
              --final-span-w: var(--m-span-w) !important;
              --final-span-h: var(--m-span-h) !important;
           }
        }

        /* Simulator Sync */
        .device-preview-wrapper.tablet:not(.design-active) .bento-block-mobile {
              --final-col: var(--t-col) !important;
              --final-row: var(--t-row) !important;
              --final-span-w: var(--t-span-w) !important;
              --final-span-h: var(--t-span-h) !important;
        }
        .device-preview-wrapper.mobile:not(.design-active) .bento-block-mobile {
              --final-col: var(--m-col) !important;
              --final-row: var(--m-row) !important;
              --final-span-w: var(--m-span-w) !important;
              --final-span-h: var(--m-span-h) !important;
        }
      `}</style>
    </main>
  );
}
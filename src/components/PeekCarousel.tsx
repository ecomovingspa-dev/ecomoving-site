'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PeekCarouselProps {
    images: string[];
    mode?: 'peek' | 'full';
}

export default function PeekCarousel({ images, mode = 'peek' }: PeekCarouselProps) {
    const [current, setCurrent] = useState(images.length >= 3 ? 1 : 0);
    const [hovered, setHovered] = useState(false);
    const [containerW, setContainerW] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const dragStartX = useRef<number | null>(null);
    const dragMoved = useRef(false);

    // ── Medir el contenedor con ResizeObserver (px reales) ──
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const measure = () => setContainerW(el.clientWidth);
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    if (!images || images.length === 0) return null;

    if (images.length === 1) {
        return (
            <div ref={containerRef} style={{ position: 'absolute', inset: 0 }}>
                <img src={images[0]} alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
            </div>
        );
    }

    // ── Layout en píxeles ──
    const isFull = mode === 'full';
    const SLIDE_RATIO = isFull ? 1.0 : 0.60;
    const GAP_PX = isFull ? 0 : 14;
    const slideW = containerW * SLIDE_RATIO;
    const peekW = isFull ? 0 : (containerW - slideW - GAP_PX * 2) / 2;
    const offsetPx = isFull ? -current * slideW : peekW + GAP_PX - current * (slideW + GAP_PX);

    const goTo = (idx: number) =>
        setCurrent(Math.max(0, Math.min(images.length - 1, idx)));

    // ── Mouse drag / swipe ──
    const handleMouseDown = (e: React.MouseEvent) => {
        dragStartX.current = e.clientX;
        dragMoved.current = false;
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (dragStartX.current !== null && Math.abs(e.clientX - dragStartX.current) > 8)
            dragMoved.current = true;
    };
    const handleMouseUp = (e: React.MouseEvent) => {
        if (dragStartX.current === null) return;
        const delta = e.clientX - dragStartX.current;
        if (Math.abs(delta) > 40) {
            dragMoved.current = true;
            delta < 0 ? goTo(current + 1) : goTo(current - 1);
        }
        dragStartX.current = null;
    };

    // ── Touch ──
    const handleTouchStart = (e: React.TouchEvent) => {
        dragStartX.current = e.touches[0].clientX;
        dragMoved.current = false;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (dragStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - dragStartX.current;
        if (Math.abs(delta) > 40) delta < 0 ? goTo(current + 1) : goTo(current - 1);
        dragStartX.current = null;
    };

    // ── Click posicional (izq 30% → prev, der 70% → next) ──
    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (dragMoved.current) { dragMoved.current = false; return; }
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        if (ratio < 0.3 && current > 0) goTo(current - 1);
        else if (ratio > 0.7 && current < images.length - 1) goTo(current + 1);
    };

    return (
        <div
            ref={containerRef}
            style={{ position: 'absolute', inset: 0, overflow: 'hidden', cursor: 'grab' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleContainerClick}
        >
            {/* ── TRACK ── */}
            {containerW > 0 && (
                <div style={{
                    display: 'flex',
                    height: '100%',
                    gap: `${GAP_PX}px`,
                    transform: `translateX(${offsetPx}px)`,
                    transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'transform',
                    userSelect: 'none',
                }}>
                    {images.map((img, i) => {
                        const isActive = i === current;
                        return (
                            <div
                                key={i}
                                style={{
                                    flexShrink: 0,
                                    width: `${slideW}px`,
                                    height: '100%',
                                    borderRadius: isFull ? '0px' : '14px',
                                    overflow: 'hidden',
                                    // Sin scale: la altura no varía durante el deslizamiento
                                    opacity: isFull || isActive ? 1 : 0.45,
                                    transition: 'opacity 0.55s ease',
                                }}
                            >
                                <img
                                    src={img}
                                    draggable={false}
                                    alt=""
                                    style={{
                                        width: '100%', height: '100%',
                                        objectFit: 'cover',
                                        pointerEvents: 'none',
                                        userSelect: 'none',
                                        // Zoom sutil SOLO en la imagen (no en el contenedor) — no afecta la altura
                                        transform: isActive && !isFull ? 'scale(1.04)' : 'scale(1)',
                                        transition: 'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
                                    }}
                                    onError={e => (e.target as HTMLImageElement).style.display = 'none'}
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── FLECHAS (hover) ── */}
            {hovered && current > 0 && (
                <button
                    onClick={e => { e.stopPropagation(); goTo(current - 1); }}
                    style={{
                        position: 'absolute', left: `${Math.max(8, peekW / 2 - 20)}px`, top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white', borderRadius: '50%', width: '40px', height: '40px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', backdropFilter: 'blur(12px)', zIndex: 20,
                    }}
                >
                    <ChevronLeft size={20} />
                </button>
            )}
            {hovered && current < images.length - 1 && (
                <button
                    onClick={e => { e.stopPropagation(); goTo(current + 1); }}
                    style={{
                        position: 'absolute', right: `${Math.max(8, peekW / 2 - 20)}px`, top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white', borderRadius: '50%', width: '40px', height: '40px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', backdropFilter: 'blur(12px)', zIndex: 20,
                    }}
                >
                    <ChevronRight size={20} />
                </button>
            )}

            {/* ── DOTS ── */}
            <div style={{
                position: 'absolute', bottom: '14px', width: '100%',
                display: 'flex', justifyContent: 'center', gap: '7px', zIndex: 20,
            }}>
                {images.map((_, i) => (
                    <div
                        key={i}
                        onClick={e => { e.stopPropagation(); goTo(i); }}
                        style={{
                            height: '4px',
                            width: i === current ? '22px' : '4px',
                            borderRadius: '2px',
                            background: i === current ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)',
                            transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s ease',
                            cursor: 'pointer',
                        }}
                    />
                ))}
            </div>

            {/* ── DEBUG (dev only) ── */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{
                    position: 'absolute', bottom: '30px', right: '8px',
                    background: 'rgba(0,0,0,0.85)', color: '#00d4bd',
                    fontSize: '9px', padding: '3px 7px', borderRadius: '4px',
                    fontFamily: 'monospace', zIndex: 30, pointerEvents: 'none',
                }}>
                    W:{Math.round(containerW)} slide:{Math.round(slideW)} peek:{Math.round(peekW)}
                </div>
            )}
        </div>
    );
}

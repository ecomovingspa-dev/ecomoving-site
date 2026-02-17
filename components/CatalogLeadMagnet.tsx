'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, User, Briefcase, CheckCircle, Download } from 'lucide-react';

export default function CatalogLeadMagnet() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email) return;

        setStatus('loading');

        // Simular envío a Supabase o email service
        setTimeout(() => {
            setStatus('success');
            console.log('Lead captured:', formData);
        }, 1500);
    };

    return (
        <section className="lead-magnet-container">
            <div className="lead-magnet-card">
                <AnimatePresence mode="wait">
                    {status !== 'success' ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="lead-inner"
                        >
                            <div className="lead-header">
                                <h3 className="lead-title">OBTÉN NUESTRO CATÁLOGO 2026</h3>
                            </div>

                            <form onSubmit={handleSubmit} className="lead-form">
                                <div className="input-group">
                                    <div className="input-wrapper">
                                        <User size={16} className="input-icon" />
                                        <input
                                            type="text"
                                            placeholder="Nombre"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="lead-input"
                                        />
                                    </div>
                                    <div className="input-wrapper">
                                        <Mail size={16} className="input-icon" />
                                        <input
                                            type="email"
                                            placeholder="Email Corporativo"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="lead-input"
                                        />
                                    </div>
                                    <div className="input-wrapper">
                                        <Briefcase size={16} className="input-icon" />
                                        <input
                                            type="text"
                                            placeholder="Empresa"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="lead-input"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    className="lead-submit"
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? 'PROCESANDO...' : 'SOLICITAR ACCESO AL CATÁLOGO'}
                                    <Send size={14} style={{ marginLeft: '12px', opacity: 0.7 }} />
                                </motion.button>
                            </form>

                            <div className="lead-footer-trend">
                                TENDENCIA 2026 &nbsp;&bull;&nbsp; ECOMOVING PREMIUM &nbsp;&bull;&nbsp; CATÁLOGO ESTRATÉGICO
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="lead-success"
                        >
                            <CheckCircle size={40} className="success-icon" />
                            <h3 className="success-title">ACCESO CONCEDIDO</h3>
                            <p className="success-subtitle">El catálogo exclusivo 2026 ha sido enviado a <strong>{formData.email}</strong>.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </section>
    );
}

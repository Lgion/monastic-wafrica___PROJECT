import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Save, Info, MapPin, Phone, Mail, Trash2, Package, Edit2 } from 'lucide-react';
import { redirect, notFound } from 'next/navigation';
import { MonasteryLocationPicker } from '@/components/map';

async function getMonastery(id: string) {
    const m = await prisma.monastery.findUnique({
        where: { id },
        include: {
            products: true
        }
    });
    if (!m) notFound();
    return m;
}

async function updateMonastery(id: string, formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const latitude = formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null;
    const longitude = formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null;

    await prisma.monastery.update({
        where: { id },
        data: {
            name,
            description,
            location,
            phone,
            email,
            latitude,
            longitude
        }
    });

    redirect('/admin/monasteres');
}

async function deleteMonastery(id: string) {
    'use server';
    const products = await prisma.product.count({ where: { monasteryId: id } });
    if (products > 0) return;
    await prisma.monastery.delete({ where: { id } });
    redirect('/admin/monasteres');
}

export default async function EditMonasteryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const m = await getMonastery(id);

    return (
        <div className="admin-form animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="admin-form__header">
                <div className="admin-form__header-left">
                    <Link href="/admin/monasteres" className="admin-form__back-link">
                        <ArrowLeft className="admin-form__back-icon" />
                    </Link>
                    <div>
                        <h1 className="admin-form__title">Modifier : {m.name}</h1>
                        <p className="admin-form__subtitle">Mettre à jour les informations de la communauté</p>
                    </div>
                </div>

                <div className="admin-form__header-right">
                    <form action={deleteMonastery.bind(null, m.id)}>
                        <button
                            type="submit"
                            className="admin-form__action-btn admin-form__action-btn--danger"
                            title="Supprimer la communauté"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>

            <form action={updateMonastery.bind(null, m.id)} className="admin-form__grid">
                <div className="admin-form__main-col">
                    {/* General Information */}
                    <div className="admin-form__section">
                        <div className="admin-form__section-header">
                            <Info className="admin-form__section-icon" />
                            <h2 className="admin-form__section-title">Information Générale</h2>
                        </div>

                        <div className="admin-form__fields">
                            <div className="admin-form__field-group">
                                <label className="admin-form__label">Nom du monastère/communauté</label>
                                <input
                                    name="name"
                                    type="text"
                                    defaultValue={m.name}
                                    required
                                    className="admin-form__input"
                                />
                            </div>

                            <div className="admin-form__field-group">
                                <label className="admin-form__label">Description</label>
                                <textarea
                                    name="description"
                                    rows={6}
                                    defaultValue={m.description || ''}
                                    required
                                    className="admin-form__textarea"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="admin-form__section">
                        <div className="admin-form__section-header">
                            <Phone className="admin-form__section-icon" />
                            <h2 className="admin-form__section-title">Contact</h2>
                        </div>

                        <div className="admin-form__row">
                            <div className="admin-form__field-group">
                                <label className="admin-form__label">Téléphone</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    defaultValue={m.phone || ''}
                                    placeholder="+225 07 00 00 00 00"
                                    className="admin-form__input"
                                />
                            </div>
                            <div className="admin-form__field-group">
                                <label className="admin-form__label">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={m.email || ''}
                                    placeholder="contact@communaute.ci"
                                    className="admin-form__input"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-form__side-col">
                    {/* Products List from this Monastery */}
                    <div className="admin-form__section">
                        <div className="admin-form__section-header" style={{ justifyContent: 'space-between', width: '100%', display: 'flex' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Package className="admin-form__section-icon" />
                                <h2 className="admin-form__section-title">Produits de cette communauté</h2>
                            </div>
                            <Link href="/admin/produits/nouveau" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textDecoration: 'none' }}>
                                + Ajouter
                            </Link>
                        </div>

                        <div className="admin-form__fields">
                            {m.products.map((p: any) => (
                                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid transparent' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '2rem', height: '2rem', backgroundColor: '#ffffff', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                            <Package className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem', lineHeight: 1 }}>{p.name}</p>
                                            <p style={{ fontSize: '0.625rem', color: '#94a3b8', textTransform: 'capitalize' }}>{p.category}</p>
                                        </div>
                                    </div>
                                    <Link href={`/admin/produits/${p.id}/modifier`} style={{ padding: '0.5rem', color: '#94a3b8' }}>
                                        <Edit2 className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))}
                            {m.products.length === 0 && (
                                <p style={{ textAlign: 'center', padding: '1rem 0', fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>Aucun produit associé.</p>
                            )}
                        </div>
                    </div>

                    {/* Location & Map Settings */}
                    <div className="admin-form__section admin-form__section--sticky">
                        <div className="admin-form__section-header">
                            <MapPin className="admin-form__section-icon" />
                            <h2 className="admin-form__section-title">Localisation</h2>
                        </div>

                        <div className="admin-form__fields">
                            <MonasteryLocationPicker
                                initialLocation={m.location}
                                initialLat={m.latitude || undefined}
                                initialLng={m.longitude || undefined}
                            />
                            <p className="text-[10px] text-slate-400 italic">Cliquez sur la carte pour modifier le lieu. Le nom et les coordonnées se mettront à jour automatiquement.</p>
                        </div>

                        <div className="admin-form__actions">
                            <button type="submit" className="admin-form__submit-btn">
                                <Save className="admin-form__submit-icon" />
                                Enregistrer
                            </button>
                            <Link href="/admin/monasteres" className="admin-form__cancel-link">
                                Annuler
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

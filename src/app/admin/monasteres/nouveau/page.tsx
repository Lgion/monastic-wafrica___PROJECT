import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Save, Home, Info, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { redirect } from 'next/navigation';
import { MonasteryLocationPicker } from '@/components/map';

async function createMonastery(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const latitude = formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null;
    const longitude = formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null;

    await prisma.monastery.create({
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

export default function NewMonasteryPage() {
    return (
        <div className="admin-form animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="admin-form__header">
                <div className="admin-form__header-left">
                    <Link href="/admin/monasteres" className="admin-form__back-link">
                        <ArrowLeft className="admin-form__back-icon" />
                    </Link>
                    <div>
                        <h1 className="admin-form__title">Nouvelle Communauté</h1>
                        <p className="admin-form__subtitle">Ajoutez un nouveau lieu ou une nouvelle communauté chrétienne</p>
                    </div>
                </div>
            </div>

            <form action={createMonastery} className="admin-form__grid">
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
                                    placeholder="Ex: Monastère Sainte Marie de Bouaké"
                                    required
                                    className="admin-form__input"
                                />
                            </div>

                            <div className="admin-form__field-group">
                                <label className="admin-form__label">Description</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    placeholder="Histoire, spiritualité et activités de la communauté..."
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
                                    placeholder="+225 07 00 00 00 00"
                                    className="admin-form__input"
                                />
                            </div>
                            <div className="admin-form__field-group">
                                <label className="admin-form__label">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="contact@communaute.ci"
                                    className="admin-form__input"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-form__side-col">
                    {/* Location & Map Settings */}
                    <div className="admin-form__section admin-form__section--sticky">
                        <div className="admin-form__section-header">
                            <MapPin className="admin-form__section-icon" />
                            <h2 className="admin-form__section-title">Localisation</h2>
                        </div>

                        <div className="admin-form__fields">
                            <MonasteryLocationPicker />
                            <p className="text-[10px] text-slate-400 italic">Cliquez sur la carte pour choisir un lieu précis. Le nom de la ville et les coordonnées se rempliront automatiquement.</p>
                        </div>

                        <div className="admin-form__actions">
                            <button type="submit" className="admin-form__submit-btn">
                                <Save className="admin-form__submit-icon" />
                                Enregistrer le lieu
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

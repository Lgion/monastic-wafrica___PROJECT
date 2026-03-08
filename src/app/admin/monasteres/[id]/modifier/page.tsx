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
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/monasteres" className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-50">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Modifier : {m.name}</h1>
                        <p className="text-slate-500">Mettre à jour les informations de la communauté</p>
                    </div>
                </div>

                <form action={deleteMonastery.bind(null, m.id)}>
                    <button
                        type="submit"
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all group"
                        title="Supprimer la communauté"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </form>
            </div>

            <form action={updateMonastery.bind(null, m.id)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                <div className="lg:col-span-2 space-y-6">
                    {/* General Information */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                            <Info className="w-5 h-5 text-emerald-600" />
                            <h2 className="font-bold text-slate-900">Information Générale</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nom du monastère/communauté</label>
                                <input
                                    name="name"
                                    type="text"
                                    defaultValue={m.name}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows={6}
                                    defaultValue={m.description}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 resize-none font-medium"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                            <Phone className="w-5 h-5 text-emerald-600" />
                            <h2 className="font-bold text-slate-900">Contact</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Téléphone</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    defaultValue={m.phone || ''}
                                    placeholder="+225 07 00 00 00 00"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={m.email || ''}
                                    placeholder="contact@communaute.ci"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Products List from this Monastery */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-emerald-600" />
                                <h2 className="font-bold text-slate-900">Produits de cette communauté</h2>
                            </div>
                            <Link href="/admin/produits/nouveau" className="text-xs font-bold text-emerald-600 hover:underline">
                                + Ajouter
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {m.products.map(p => (
                                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group border border-transparent hover:border-emerald-100 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-300">
                                            <Package className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 leading-none mb-1">{p.name}</p>
                                            <p className="text-[10px] text-slate-400 capitalize">{p.category}</p>
                                        </div>
                                    </div>
                                    <Link href={`/admin/produits/${p.id}/modifier`} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-emerald-600 transition-all">
                                        <Edit2 className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))}
                            {m.products.length === 0 && (
                                <p className="text-center py-4 text-xs text-slate-400 italic">Aucun produit associé.</p>
                            )}
                        </div>
                    </div>

                    {/* Location & Map Settings */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6 sticky top-28">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                            <h2 className="font-bold text-slate-900">Localisation</h2>
                        </div>

                        <div className="space-y-4">
                            <MonasteryLocationPicker
                                initialLocation={m.location}
                                initialLat={m.latitude || undefined}
                                initialLng={m.longitude || undefined}
                            />
                            <p className="text-[10px] text-slate-400 italic">Cliquez sur la carte pour modifier le lieu. Le nom et les coordonnées se mettront à jour automatiquement.</p>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                            <button
                                type="submit"
                                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                            >
                                <Save className="w-5 h-5" />
                                Enregistrer les modifications
                            </button>
                            <Link href="/admin/monasteres" className="w-full text-center py-2 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                                Annuler
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

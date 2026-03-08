import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Home,
    MapPin,
    Phone,
    Mail,
    ExternalLink,
    Package
} from 'lucide-react';

async function getMonasteries() {
    return await prisma.monastery.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export default async function AdminMonasteriesPage() {
    const monasteries = await getMonasteries();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-slate-900">
                <div>
                    <h1 className="text-3xl font-bold">Monastères</h1>
                    <p className="text-slate-500 font-medium">Gérez les communautés chrétiennes et leurs informations</p>
                </div>
                <Link
                    href="/admin/monasteres/nouveau"
                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                >
                    <Plus className="w-5 h-5" />
                    Nouveau Monastère
                </Link>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un monastère, un lieu..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-900"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {monasteries.map((m) => (
                    <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                                    <Home className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/admin/monasteres/${m.id}/modifier`} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-emerald-500 hover:text-white transition-all">
                                        <Edit2 className="w-4 h-4" />
                                    </Link>
                                    <button className="p-2 bg-slate-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2">{m.name}</h3>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{m.description}</p>

                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span>{m.location}</span>
                                </div>
                                {m.phone && (
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <span>{m.phone}</span>
                                    </div>
                                )}
                                {m.email && (
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span>{m.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                                <Package className="w-4 h-4" />
                                <span>{m._count.products} produits</span>
                            </div>
                            <Link href={`/monasteres#${m.id}`} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {monasteries.length === 0 && (
                <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Home className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Aucun monastère trouvé</h3>
                    <p className="text-slate-500 mb-6">Commencez par ajouter votre première communauté.</p>
                    <Link
                        href="/admin/monasteres/nouveau"
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Créer un monastère
                    </Link>
                </div>
            )}
        </div>
    );
}

import React from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Clock, CheckCircle2, XCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';

// In a real app with auth, we would filter by the logged-in user's email or ID
// For this demo, we'll show all orders or allow filtering by phone/email
async function getOrders() {
    return await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });
}

export default async function UserOrdersPage() {
    const orders = await getOrders();

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'PAID':
            case 'COMPLETED':
                return { label: 'Terminée', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 };
            case 'PENDING':
                return { label: 'En attente', color: 'text-orange-600', bg: 'bg-orange-50', icon: Clock };
            case 'FAILED':
            case 'CANCELLED':
                return { label: 'Annulée', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle };
            default:
                return { label: status, color: 'text-slate-600', bg: 'bg-slate-50', icon: Package };
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/boutique" className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="font-bold text-slate-900">Mes Commandes</h1>
                    <div className="w-10"></div> {/* Spacer for symmetry */}
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Aucune commande trouvée</h2>
                        <p className="text-slate-500 mb-8 max-w-xs">Vous n'avez pas encore passé de commande sur Monastic Wafrica.</p>
                        <Link href="/boutique" className="px-8 py-3 bg-amber-700 text-white font-bold rounded-xl hover:bg-amber-800 transition-all">
                            Commencer mes achats
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const status = getStatusInfo(order.status);
                            return (
                                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Commande #{order.id.slice(-6).toUpperCase()}</p>
                                                <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bg} ${status.color}`}>
                                                <status.icon className="w-3.5 h-3.5" />
                                                <span className="text-xs font-bold uppercase">{status.label}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex gap-4">
                                                    <div className="w-12 h-12 bg-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-slate-200" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-slate-900 truncate">{item.product.name}</p>
                                                        <p className="text-xs text-slate-500">Quantité : {item.quantity}</p>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-900">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">Total réglé</p>
                                                <p className="text-lg font-black text-slate-900">{order.total.toLocaleString()} <span className="text-xs font-bold text-slate-400">FCFA</span></p>
                                            </div>
                                            <button className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors">
                                                Détails du suivi
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Mobile Navigation Spacer */}
            <div className="h-10"></div>
        </div>
    );
}

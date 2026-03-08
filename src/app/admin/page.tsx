import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

async function getStats() {
  const [orderCount, productCount, pendingOrders, totalRevenue] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({ _sum: { total: true } })
  ]);

  return {
    orderCount,
    productCount,
    pendingOrders,
    revenue: totalRevenue._sum.total || 0,
    // Dummy growth stats
    growth: 12.5
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: 'Revenus Totaux', value: `${new Intl.NumberFormat('fr-CI').format(stats.revenue)} FCFA`, icon: TrendingUp, color: 'emerald', trend: '+12%' },
    { label: 'Commandes', value: stats.orderCount, icon: ShoppingBag, color: 'blue', trend: '+5%' },
    { label: 'En attente', value: stats.pendingOrders, icon: Clock, color: 'orange', trend: '-2%' },
    { label: 'Produits', value: stats.productCount, icon: Package, color: 'purple', trend: 'stable' },
  ];

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-500">Aperçu général de votre activité</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all">Exporter</button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all">Rapport détaillé</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${card.color}-50 text-${card.color}-600 group-hover:scale-110 transition-transform`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center text-xs font-bold gap-1 ${card.trend.startsWith('+') ? 'text-emerald-500' : card.trend === 'stable' ? 'text-slate-400' : 'text-red-500'}`}>
                {card.trend}
                {card.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : card.trend !== 'stable' && <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{card.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-900">Commandes récentes</h2>
            <Link href="/admin/commandes" className="text-emerald-600 text-sm font-semibold hover:underline">Voir tout</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Client</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Montant</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-all cursor-pointer">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{order.customerName}</p>
                      <p className="text-xs text-slate-500">{order.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {new Intl.NumberFormat('fr-CI').format(order.total)} FCFA
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">Aucune commande pour le moment</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Notifications */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="font-bold text-lg text-slate-900 mb-6">Actions rapides</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/produits/nouveau" className="flex flex-col items-center justify-center p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all group">
                <Package className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-emerald-900">Nouveau Produit</span>
              </Link>
              <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all group">
                <Users className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-blue-900">Client Info</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Besoin d'aide ?</h3>
              <p className="text-slate-400 text-sm mb-4">Consultez notre documentation pour gérer au mieux votre boutique.</p>
              <button className="px-4 py-2 bg-emerald-500 rounded-lg text-sm font-bold hover:bg-emerald-400 transition-all">Support</button>
            </div>
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

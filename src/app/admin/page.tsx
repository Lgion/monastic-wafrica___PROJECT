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
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <div>
          <h1 className="admin-dashboard__title">Tableau de bord</h1>
          <p className="admin-dashboard__subtitle">Aperçu général de votre activité</p>
        </div>
        <div className="admin-dashboard__actions">
          <button className="admin-dashboard__action-btn admin-dashboard__action-btn--secondary">Exporter</button>
          <button className="admin-dashboard__action-btn admin-dashboard__action-btn--primary">Rapport détaillé</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-dashboard__stats">
        {cards.map((card, i) => (
          <div key={i} className="admin-dashboard__stat-card">
            <div className="admin-dashboard__stat-header">
              <div className={`admin-dashboard__stat-icon-wrapper admin-dashboard__stat-icon-wrapper--${card.color}`}>
                <card.icon className="admin-dashboard__stat-icon" />
              </div>
              <div className={`admin-dashboard__stat-trend ${card.trend.startsWith('+') ? 'admin-dashboard__stat-trend--positive' : card.trend === 'stable' ? 'admin-dashboard__stat-trend--neutral' : 'admin-dashboard__stat-trend--negative'}`}>
                {card.trend}
                {card.trend.startsWith('+') ? <ArrowUpRight className="admin-dashboard__stat-trend-icon" /> : card.trend !== 'stable' && <ArrowDownRight className="admin-dashboard__stat-trend-icon" />}
              </div>
            </div>
            <h3 className="admin-dashboard__stat-label">{card.label}</h3>
            <p className="admin-dashboard__stat-value">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="admin-dashboard__main-grid">
        {/* Recent Orders Table */}
        <div className="admin-dashboard__table-wrapper">
          <div className="admin-dashboard__table-header">
            <h2 className="admin-dashboard__table-title">Commandes récentes</h2>
            <Link href="/admin/commandes" className="admin-dashboard__table-link">Voir tout</Link>
          </div>
          <div className="admin-dashboard__table-container">
            <table className="admin-dashboard__table">
              <thead className="admin-dashboard__table-head">
                <tr>
                  <th className="admin-dashboard__th">Client</th>
                  <th className="admin-dashboard__th">Date</th>
                  <th className="admin-dashboard__th">Montant</th>
                  <th className="admin-dashboard__th">Statut</th>
                </tr>
              </thead>
              <tbody className="admin-dashboard__tbody">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="admin-dashboard__tr">
                    <td className="admin-dashboard__td">
                      <p className="admin-dashboard__customer-name">{order.customerName}</p>
                      <p className="admin-dashboard__customer-phone">{order.customerPhone}</p>
                    </td>
                    <td className="admin-dashboard__td admin-dashboard__td-date">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="admin-dashboard__td admin-dashboard__td-amount">
                      {new Intl.NumberFormat('fr-CI').format(order.total)} FCFA
                    </td>
                    <td className="admin-dashboard__td">
                      <span className={`admin-dashboard__status-badge ${order.status === 'COMPLETED' ? 'admin-dashboard__status-badge--completed' :
                          order.status === 'PENDING' ? 'admin-dashboard__status-badge--pending' :
                            'admin-dashboard__status-badge--cancelled'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="admin-dashboard__td-empty">Aucune commande pour le moment</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Notifications */}
        <div className="admin-dashboard__side-panel">
          <div className="admin-dashboard__quick-actions">
            <h2 className="admin-dashboard__quick-title">Actions rapides</h2>
            <div className="admin-dashboard__quick-grid">
              <Link href="/admin/produits/nouveau" className="admin-dashboard__quick-btn admin-dashboard__quick-btn--new-product">
                <Package className="admin-dashboard__quick-icon admin-dashboard__quick-icon--emerald" />
                <span className="admin-dashboard__quick-label admin-dashboard__quick-label--emerald">Nouveau Produit</span>
              </Link>
              <button className="admin-dashboard__quick-btn admin-dashboard__quick-btn--client-info">
                <Users className="admin-dashboard__quick-icon admin-dashboard__quick-icon--blue" />
                <span className="admin-dashboard__quick-label admin-dashboard__quick-label--blue">Client Info</span>
              </button>
            </div>
          </div>

          <div className="admin-dashboard__help-widget">
            <div className="admin-dashboard__help-content">
              <h3 className="admin-dashboard__help-title">Besoin d'aide ?</h3>
              <p className="admin-dashboard__help-desc">Consultez notre documentation pour gérer au mieux votre boutique.</p>
              <button className="admin-dashboard__help-btn">Support</button>
            </div>
            <div className="admin-dashboard__help-blur"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

import React from 'react';
import { prisma } from '@/lib/prisma';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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

export default async function OrdersPage() {
  const orders = await getOrders();

  const getStatusModifier = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'admin-orders__status--completed';
      case 'PENDING': return 'admin-orders__status--pending';
      case 'FAILED': return 'admin-orders__status--failed';
      case 'CANCELLED': return 'admin-orders__status--cancelled';
      default: return 'admin-orders__status--default';
    }
  };

  return (
    <div className="admin-orders">
      <div className="admin-orders__header">
        <div>
          <h1 className="admin-orders__title">Commandes</h1>
          <p className="admin-orders__subtitle">Gérez le suivi et le statut des commandes clients</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="admin-orders__controls">
        <div className="admin-orders__search">
          <Search className="admin-orders__search-icon" />
          <input
            type="text"
            placeholder="Rechercher une commande, un client, un numéro..."
            className="admin-orders__search-input"
          />
        </div>
        <div className="admin-orders__actions">
          <button className="admin-orders__btn admin-orders__btn--outline">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
          <button className="admin-orders__btn admin-orders__btn--primary">
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-orders__table-wrapper">
        <div className="admin-orders__table-container">
          <table className="admin-orders__table">
            <thead className="admin-orders__thead">
              <tr>
                <th className="admin-orders__th">ID Commande</th>
                <th className="admin-orders__th">Client</th>
                <th className="admin-orders__th">Articles</th>
                <th className="admin-orders__th">Total</th>
                <th className="admin-orders__th">Paiement</th>
                <th className="admin-orders__th">Statut</th>
                <th className="admin-orders__th admin-orders__th--right">Actions</th>
              </tr>
            </thead>
            <tbody className="admin-orders__tbody">
              {orders.map((order: any) => (
                <tr key={order.id} className="admin-orders__tr group">
                  <td className="admin-orders__td">
                    <span className="admin-orders__id">#{order.id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td className="admin-orders__td">
                    <div className="admin-orders__customer">
                      <div className="admin-orders__customer-avatar">
                        {order.customerName.charAt(0)}
                      </div>
                      <div className="admin-orders__customer-info">
                        <p className="admin-orders__customer-name">{order.customerName}</p>
                        <p className="admin-orders__customer-phone">{order.customerPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="admin-orders__td">
                    <span className="admin-orders__items">{order.items.length} article(s)</span>
                  </td>
                  <td className="admin-orders__td">
                    <span className="admin-orders__total">{new Intl.NumberFormat('fr-CI').format(order.total)} FCFA</span>
                  </td>
                  <td className="admin-orders__td">
                    <div className="admin-orders__payment">
                      <span className="admin-orders__payment-method">{order.paymentMethod}</span>
                      <span className="admin-orders__payment-status">{order.paymentStatus}</span>
                    </div>
                  </td>
                  <td className="admin-orders__td">
                    <span className={`admin-orders__status ${getStatusModifier(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="admin-orders__td admin-orders__td--right">
                    <div className="admin-orders__action-icons">
                      <button className="admin-orders__action-icon-btn admin-orders__action-icon-btn--eye" title="Détails">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="admin-orders__action-icon-btn admin-orders__action-icon-btn--more" title="Modifier">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Dummy */}
        <div className="admin-orders__footer">
          <p className="admin-orders__footer-text">Affichage de {orders.length} sur {orders.length} commandes</p>
          <div className="admin-orders__pagination">
            <button className="admin-orders__page-btn" disabled><ChevronLeft className="w-4 h-4" /></button>
            <button className="admin-orders__page-btn" disabled><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

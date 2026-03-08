import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { categoryLabels } from '@/lib/types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Star,
  ExternalLink
} from 'lucide-react';

async function getProducts() {
  return await prisma.product.findMany({
    include: {
      monastery: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="admin-products">
      <div className="admin-products__header">
        <div>
          <h1 className="admin-products__title">Produits</h1>
          <p className="admin-products__subtitle">Gérez votre catalogue de produits monastiques</p>
        </div>
        <div className="admin-products__actions">
          <div className="admin-products__dropdown-wrapper">
            <button className="admin-products__btn admin-products__btn--outline">
              <Plus className="w-5 h-5" />
              Nouvelle Catégorie
            </button>
            <div className="admin-products__dropdown">
              <div className="admin-products__dropdown-header">
                Catégories existantes
              </div>
              {Array.from(new Set(products.map((p: any) => p.category))).length > 0 ? (
                Array.from(new Set(products.map((p: any) => p.category))).map((cat: any, i) => (
                  <div key={i} className="admin-products__dropdown-item">
                    {(categoryLabels as Record<string, string>)[cat] || cat}
                  </div>
                ))
              ) : (
                <div className="admin-products__dropdown-empty">Aucune</div>
              )}
            </div>
          </div>
          <Link
            href="/admin/produits/nouveau"
            className="admin-products__btn admin-products__btn--primary"
          >
            <Plus className="w-5 h-5" />
            Nouveau Produit
          </Link>
        </div>
      </div>

      <div className="admin-products__controls">
        <div className="admin-products__search">
          <Search className="admin-products__search-icon" />
          <input
            type="text"
            placeholder="Rechercher un produit, une catégorie..."
            className="admin-products__search-input"
          />
        </div>
      </div>

      <div className="admin-products__grid">
        {products.map((product: any) => (
          <div key={product.id} className="admin-products__card">
            <div className="admin-products__card-image-container">
              {/* Image placeholder - normally product.images would be used */}
              <div className="admin-products__card-placeholder">
                <Package className="admin-products__card-placeholder-icon" />
              </div>

              {product.featured && (
                <div className="admin-products__featured-badge">
                  <Star className="admin-products__featured-icon" />
                </div>
              )}

              <div className="admin-products__card-overlay">
                <Link href={`/admin/produits/${product.id}/modifier`} className="admin-products__card-action admin-products__card-action--edit">
                  <Edit2 className="admin-products__card-action-icon" />
                </Link>
                <button className="admin-products__card-action admin-products__card-action--delete">
                  <Trash2 className="admin-products__card-action-icon" />
                </button>
              </div>
            </div>

            <div className="admin-products__card-body">
              <div className="admin-products__card-meta">
                <span className="admin-products__card-category">{product.category}</span>
                <span className="admin-products__card-price">{new Intl.NumberFormat('fr-CI').format(product.price)} FCFA</span>
              </div>
              <h3 className="admin-products__card-title">{product.name}</h3>
              <p className="admin-products__card-subtitle">
                <Package className="admin-products__card-subtitle-icon" />
                {product.monastery?.name}
              </p>

              <div className="admin-products__card-footer">
                <div className="admin-products__card-stock-col">
                  <span className="admin-products__card-stock-label">Stock</span>
                  <span className={`admin-products__card-stock-val ${product.stock < 10 ? 'admin-products__card-stock-val--low' : ''}`}>{product.stock} unités</span>
                </div>
                <Link href={`/produit/${product.id}`} target="_blank" className="admin-products__card-link">
                  <ExternalLink className="admin-products__card-link-icon" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="admin-products__empty">
          <div className="admin-products__empty-icon-wrapper">
            <Package className="admin-products__empty-icon" />
          </div>
          <h3 className="admin-products__empty-title">Aucun produit trouvé</h3>
          <p className="admin-products__empty-subtitle">Commencez par ajouter votre premier produit monastique.</p>
          <Link
            href="/admin/produits/nouveau"
            className="admin-products__btn admin-products__btn--primary"
            style={{ margin: "0 auto", width: "fit-content" }}
          >
            <Plus className="w-5 h-5" />
            Créer un produit
          </Link>
        </div>
      )}
    </div>
  );
}

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
    <div className="space-y-6">
      <div className="flex justify-between items-center text-slate-900">
        <div>
          <h1 className="text-3xl font-bold">Produits</h1>
          <p className="text-slate-500 font-medium">Gérez votre catalogue de produits monastiques</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center gap-2 bg-white text-emerald-600 border-2 border-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg shadow-emerald-100">
              <Plus className="w-5 h-5" />
              Nouvelle Catégorie
            </button>
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 flex flex-col py-2">
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 mb-1">
                Catégories existantes
              </div>
              {Array.from(new Set(products.map((p) => p.category))).length > 0 ? (
                Array.from(new Set(products.map((p) => p.category))).map((cat, i) => (
                  <div key={i} className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors cursor-default">
                    {(categoryLabels as Record<string, string>)[cat] || cat}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-400 italic text-center">Aucune</div>
              )}
            </div>
          </div>
          <Link
            href="/admin/produits/nouveau"
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            <Plus className="w-5 h-5" />
            Nouveau Produit
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un produit, une catégorie..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="aspect-square bg-slate-100 relative overflow-hidden">
              {/* Image placeholder - normally product.images would be used */}
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <Package className="w-12 h-12" />
              </div>

              {product.featured && (
                <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 p-1.5 rounded-lg shadow-lg">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}

              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Link href={`/admin/produits/${product.id}/modifier`} className="p-3 bg-white text-slate-900 rounded-full hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-110">
                  <Edit2 className="w-5 h-5" />
                </Link>
                <button className="p-3 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all transform hover:scale-110">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{product.category}</span>
                <span className="text-sm font-bold text-slate-900">{new Intl.NumberFormat('fr-CI').format(product.price)} FCFA</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
              <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                <Package className="w-3 h-3" />
                {product.monastery?.name}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Stock</span>
                  <span className={`text-sm font-bold ${product.stock < 10 ? 'text-red-500' : 'text-slate-900'}`}>{product.stock} unités</span>
                </div>
                <Link href={`/p/${product.id}`} target="_blank" className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Package className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Aucun produit trouvé</h3>
          <p className="text-slate-500 mb-6">Commencez par ajouter votre premier produit monastique.</p>
          <Link
            href="/admin/produits/nouveau"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Créer un produit
          </Link>
        </div>
      )}
    </div>
  );
}

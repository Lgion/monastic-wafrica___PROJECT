import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Save, Upload, Package, Info, Tag, Layers, Home } from 'lucide-react';
import { redirect } from 'next/navigation';

async function getMonasteries() {
  return await prisma.monastery.findMany();
}

async function createProduct(formData: FormData) {
  'use server';

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseInt(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string);
  const category = formData.get('category') as string;
  const monasteryId = formData.get('monasteryId') as string;
  const featured = formData.get('featured') === 'on';

  // In a real app, you'd handle image upload to S3/Cloudinary/etc.
  const images = "https://images.unsplash.com/photo-1590733431244-70b730878cdf?q=80&w=300&h=300&auto=format&fit=crop";

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      category,
      monasteryId,
      images,
      featured
    }
  });

  redirect('/admin/produits');
}

export default async function NewProductPage() {
  const monasteries = await getMonasteries();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/produits" className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-50">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nouveau Produit</h1>
          <p className="text-slate-500">Ajoutez un article unique à votre catalogue</p>
        </div>
      </div>

      <form action={createProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <Info className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-slate-900">Information Générale</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nom du produit</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Ex: Miel de Lavande Premium"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description détaillée</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Décrivez les bienfaits, la provenance et les ingrédients..."
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 resize-none font-medium"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <Tag className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-slate-900">Prix et Stock</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Prix (FCFA)</label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">XOF</span>
                  <input
                    name="price"
                    type="number"
                    placeholder="0"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Quantité en stock</label>
                <input
                  name="stock"
                  type="number"
                  placeholder="0"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <Upload className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-slate-900">Images du produit</h2>
            </div>

            <div className="aspect-video border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50/50 transition-all cursor-pointer group">
              <div className="p-4 bg-slate-50 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <p className="font-bold text-sm text-slate-600">Cliquez pour téléverser</p>
              <p className="text-xs">PNG, JPG ou WEBP jusqu'à 5MB</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Organization */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6 sticky top-28">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <Layers className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-slate-900">Organisation</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                  <Home className="w-3.5 h-3.5" />
                  Monastère Producteur
                </label>
                <select
                  name="monasteryId"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 font-medium appearance-none"
                >
                  <option value="">Sélectionner un monastère</option>
                  {monasteries.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Catégorie</label>
                <select
                  name="category"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 font-medium appearance-none"
                >
                  <option value="Epicerie">Epicerie Finie</option>
                  <option value="Sante">Santé & Bien-être</option>
                  <option value="Artisanat">Artisanat</option>
                  <option value="Cosmetique">Cosmétique</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">Mettre en vedette</span>
                  <span className="text-[10px] text-slate-500">Afficher sur la page d'accueil</span>
                </div>
                <input
                  name="featured"
                  type="checkbox"
                  className="w-6 h-6 rounded-lg text-emerald-600 focus:ring-emerald-500 border-slate-300 transition-all cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                <Save className="w-5 h-5" />
                Enregistrer le produit
              </button>
              <Link href="/admin/produits" className="w-full text-center py-2 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                Annuler
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

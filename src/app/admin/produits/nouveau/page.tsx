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
    <div className="admin-form animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="admin-form__header">
        <div className="admin-form__header-left">
          <Link href="/admin/produits" className="admin-form__back-link">
            <ArrowLeft className="admin-form__back-icon" />
          </Link>
          <div>
            <h1 className="admin-form__title">Nouveau Produit</h1>
            <p className="admin-form__subtitle">Ajoutez un article unique à votre catalogue</p>
          </div>
        </div>
      </div>

      <form action={createProduct} className="admin-form__grid">
        <div className="admin-form__main-col">
          {/* General Information */}
          <div className="admin-form__section">
            <div className="admin-form__section-header">
              <Info className="admin-form__section-icon" />
              <h2 className="admin-form__section-title">Information Générale</h2>
            </div>

            <div className="admin-form__fields">
              <div className="admin-form__field-group">
                <label className="admin-form__label">Nom du produit</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Ex: Miel de Lavande Premium"
                  required
                  className="admin-form__input"
                />
              </div>

              <div className="admin-form__field-group">
                <label className="admin-form__label">Description détaillée</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Décrivez les bienfaits, la provenance et les ingrédients..."
                  required
                  className="admin-form__textarea"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="admin-form__section">
            <div className="admin-form__section-header">
              <Tag className="admin-form__section-icon" />
              <h2 className="admin-form__section-title">Prix et Stock</h2>
            </div>

            <div className="admin-form__row">
              <div className="admin-form__field-group">
                <label className="admin-form__label">Prix (FCFA)</label>
                <div className="admin-form__input-wrapper">
                  <span className="admin-form__input-suffix">XOF</span>
                  <input
                    name="price"
                    type="number"
                    placeholder="0"
                    required
                    className="admin-form__input"
                  />
                </div>
              </div>
              <div className="admin-form__field-group">
                <label className="admin-form__label">Quantité en stock</label>
                <input
                  name="stock"
                  type="number"
                  placeholder="0"
                  required
                  className="admin-form__input"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="admin-form__section">
            <div className="admin-form__section-header">
              <Upload className="admin-form__section-icon" />
              <h2 className="admin-form__section-title">Images du produit</h2>
            </div>

            <div className="admin-form__upload">
              <div className="admin-form__upload-icon-wrapper">
                <Upload className="admin-form__upload-icon" />
              </div>
              <p className="admin-form__upload-title">Cliquez pour téléverser</p>
              <p className="admin-form__upload-hint">PNG, JPG ou WEBP jusqu'à 5MB</p>
            </div>
          </div>
        </div>

        <div className="admin-form__side-col">
          {/* Organization */}
          <div className="admin-form__section admin-form__section--sticky">
            <div className="admin-form__section-header">
              <Layers className="admin-form__section-icon" />
              <h2 className="admin-form__section-title">Organisation</h2>
            </div>

            <div className="admin-form__fields">
              <div className="admin-form__field-group">
                <label className="admin-form__label">
                  <Home className="w-3.5 h-3.5" />
                  Monastère Producteur
                </label>
                <select
                  name="monasteryId"
                  required
                  className="admin-form__select"
                >
                  <option value="">Sélectionner un monastère</option>
                  {monasteries.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form__field-group">
                <label className="admin-form__label">Catégorie</label>
                <select
                  name="category"
                  required
                  className="admin-form__select"
                >
                  <option value="Epicerie">Epicerie Finie</option>
                  <option value="Sante">Santé & Bien-être</option>
                  <option value="Artisanat">Artisanat</option>
                  <option value="Cosmetique">Cosmétique</option>
                </select>
              </div>

              <div className="admin-form__toggle-box">
                <div className="admin-form__toggle-info">
                  <span className="admin-form__toggle-title">Mettre en vedette</span>
                  <span className="admin-form__toggle-desc">Afficher sur la page d'accueil</span>
                </div>
                <input
                  name="featured"
                  type="checkbox"
                  className="admin-form__checkbox"
                />
              </div>
            </div>

            <div className="admin-form__actions">
              <button type="submit" className="admin-form__submit-btn">
                <Save className="admin-form__submit-icon" />
                Enregistrer le produit
              </button>
              <Link href="/admin/produits" className="admin-form__cancel-link">
                Annuler
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Trash2, Info, Tag, Layers, Home, Save, Upload } from 'lucide-react'
import { categoryLabels } from '@/lib/types'
import { updateProduct, deleteProduct } from '../../actions'

async function getProduct(productId: string) {
  return await prisma.product.findUnique({ where: { id: productId }, include: { monastery: true } })
}

async function getMonasteries() {
  return await prisma.monastery.findMany({ orderBy: { name: 'asc' } })
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const [product, monasteries] = await Promise.all([getProduct(id), getMonasteries()])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <Link href="/admin/produits" className="text-amber-700 hover:text-amber-800">Retour aux produits</Link>
        </div>
      </div>
    )
  }

  const handleUpdate = async (formData: FormData) => {
    'use server'
    await updateProduct(id, formData)
  }

  const handleDelete = async () => {
    'use server'
    await deleteProduct(id)
  }

  return (
    <div className="admin-form animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="admin-form__header">
        <div className="admin-form__header-left">
          <Link href="/admin/produits" className="admin-form__back-link">
            <ArrowLeft className="admin-form__back-icon" />
          </Link>
          <div>
            <h1 className="admin-form__title">Modifier le produit</h1>
            <p className="admin-form__subtitle">Mettez à jour les informations de {product.name}</p>
          </div>
        </div>
        <div className="admin-form__header-right">
          <form action={handleDelete}>
            <button
              type="submit"
              className="admin-form__action-btn admin-form__action-btn--danger"
              onClick={(e) => { if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) e.preventDefault() }}
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </form>
        </div>
      </div>

      <form action={handleUpdate} className="admin-form__grid">
        <div className="admin-form__main-col">
          <div className="admin-form__section">
            <div className="admin-form__section-header">
              <Info className="admin-form__section-icon" />
              <h2 className="admin-form__section-title">Information Générale</h2>
            </div>
            <div className="admin-form__fields">
              <div className="admin-form__field-group">
                <label className="admin-form__label">Nom du produit *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={product.name}
                  className="admin-form__input"
                />
              </div>

              <div className="admin-form__field-group">
                <label className="admin-form__label">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={product.description || ''}
                  className="admin-form__textarea"
                />
              </div>
            </div>
          </div>

          <div className="admin-form__section">
            <div className="admin-form__section-header">
              <Tag className="admin-form__section-icon" />
              <h2 className="admin-form__section-title">Prix et Stock</h2>
            </div>
            <div className="admin-form__row">
              <div className="admin-form__field-group">
                <label className="admin-form__label">Prix (FCFA) *</label>
                <div className="admin-form__input-wrapper">
                  <span className="admin-form__input-suffix">XOF</span>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    defaultValue={product.price}
                    className="admin-form__input"
                  />
                </div>
              </div>
              <div className="admin-form__field-group">
                <label className="admin-form__label">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  defaultValue={product.stock}
                  className="admin-form__input"
                />
              </div>
            </div>
          </div>

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
          <div className="admin-form__section admin-form__section--sticky">
            <div className="admin-form__section-header">
              <Layers className="admin-form__section-icon" />
              <h2 className="admin-form__section-title">Organisation</h2>
            </div>

            <div className="admin-form__fields">
              <div className="admin-form__field-group">
                <label className="admin-form__label">
                  <Home className="w-3.5 h-3.5" />
                  Monastère *
                </label>
                <select
                  name="monasteryId"
                  required
                  defaultValue={product.monasteryId}
                  className="admin-form__select"
                >
                  <option value="">Sélectionner un monastère</option>
                  {monasteries.map((monastery: any) => (
                    <option key={monastery.id} value={monastery.id}>{monastery.name}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form__field-group">
                <label className="admin-form__label">Catégorie *</label>
                <select
                  name="category"
                  required
                  defaultValue={product.category}
                  className="admin-form__select"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form__toggle-box">
                <div className="admin-form__toggle-info">
                  <span className="admin-form__toggle-title">Mettre en vedette</span>
                  <span className="admin-form__toggle-desc">Afficher sur la page d'accueil</span>
                </div>
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  defaultChecked={product.featured}
                  className="admin-form__checkbox"
                />
              </div>
            </div>

            <div className="admin-form__actions">
              <button type="submit" className="admin-form__submit-btn">
                <Save className="admin-form__submit-icon" />
                Enregistrer
              </button>
              <Link href="/admin/produits" className="admin-form__cancel-link">
                Annuler
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

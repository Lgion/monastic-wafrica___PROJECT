import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Package, ShoppingBag, TrendingUp, ArrowLeft, Trash2 } from 'lucide-react'
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
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h1 className="text-xl font-bold">Monastic Wafrica</h1>
          <p className="text-sm text-gray-400">Administration</p>
        </div>
        <nav className="mt-6">
          <Link href="/admin" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <TrendingUp className="w-5 h-5 mr-3" />Tableau de bord
          </Link>
          <Link href="/admin/commandes" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <ShoppingBag className="w-5 h-5 mr-3" />Commandes
          </Link>
          <Link href="/admin/produits" className="flex items-center px-6 py-3 bg-gray-800 text-white">
            <Package className="w-5 h-5 mr-3" />Produits
          </Link>
          <Link href="/" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mt-auto">
            ← Retour au site
          </Link>
        </nav>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-2xl">
          <Link href="/admin/produits" className="text-gray-500 hover:text-gray-700 text-sm flex items-center mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />Retour aux produits
          </Link>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Modifier le produit</h2>
            <form action={handleDelete}>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={(e) => { if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) e.preventDefault() }}
              >
                <Trash2 className="w-4 h-4 mr-2" />Supprimer
              </button>
            </form>
          </div>

          <form action={handleUpdate} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
              <input type="text" name="name" required defaultValue={product.name} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" rows={4} defaultValue={product.description} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
                <input type="number" name="price" required min="0" defaultValue={product.price} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <input type="number" name="stock" required min="0" defaultValue={product.stock} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select name="category" required defaultValue={product.category} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                <option value="">Sélectionner une catégorie</option>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monastère *</label>
              <select name="monasteryId" required defaultValue={product.monasteryId} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                <option value="">Sélectionner un monastère</option>
                {monasteries.map((monastery) => (
                  <option key={monastery.id} value={monastery.id}>{monastery.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input type="checkbox" name="featured" id="featured" defaultChecked={product.featured} className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded" />
              <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">Mettre en vedette sur la page d'accueil</label>
            </div>

            <div className="flex gap-4 pt-4">
              <Link href="/admin/produits" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Annuler</Link>
              <button type="submit" className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors">Enregistrer les modifications</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import { categoryLabels, Category } from '@/lib/types'

export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: { categorie?: string }
}) {
  const category = searchParams.categorie as Category | undefined

  const products = await prisma.product.findMany({
    where: category ? { category } : {},
    include: { monastery: true },
    orderBy: { createdAt: 'desc' },
  })

  const categories = Object.entries(categoryLabels) as [Category, string][]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Boutique</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/boutique"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !category
              ? 'bg-amber-700 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tous
        </a>
        {categories.map(([key, label]) => (
          <a
            key={key}
            href={`/boutique?categorie=${key}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === key
                ? 'bg-amber-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">Aucun produit dans cette catégorie pour le moment.</p>
        </div>
      )}
    </div>
  )
}

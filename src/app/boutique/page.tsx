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
    <div className="boutique">
      <h1 className="boutique__title">Boutique</h1>

      {/* Filters */}
      <div className="boutique__filters">
        <a
          href="/boutique"
          className={`boutique__filter-btn ${!category ? 'boutique__filter-btn--active' : 'boutique__filter-btn--inactive'
            }`}
        >
          Tous
        </a>
        {categories.map(([key, label]) => (
          <a
            key={key}
            href={`/boutique?categorie=${key}`}
            className={`boutique__filter-btn ${category === key
              ? 'boutique__filter-btn--active'
              : 'boutique__filter-btn--inactive'
              }`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="boutique__grid">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      ) : (
        <div className="boutique__empty">
          <p className="boutique__empty-text">Aucun produit dans cette catégorie pour le moment.</p>
        </div>
      )}
    </div>
  )
}

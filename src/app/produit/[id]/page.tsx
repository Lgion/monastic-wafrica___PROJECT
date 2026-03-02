import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { categoryLabels } from '@/lib/types'
import { ArrowLeft, MapPin, Phone } from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'

interface Props {
  params: { id: string }
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { monastery: true },
  })

  if (!product) {
    notFound()
  }

  const images = product.images.split(',').filter(Boolean)
  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
    },
    include: { monastery: true },
    take: 4,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <Link
        href="/boutique"
        className="inline-flex items-center text-gray-600 hover:text-amber-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à la boutique
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={images[0] || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={img}
                    alt={`${product.name} - ${i + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full mb-3">
              {categoryLabels[product.category]}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-amber-700">{product.price.toLocaleString()} FCFA</p>
          </div>

          <div className="prose prose-sm text-gray-600">
            <p>{product.description}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
            </span>
          </div>

          <AddToCartButton product={product} />

          {/* Monastery Info */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Produit par</h3>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="font-medium text-amber-900">{product.monastery.name}</p>
              <div className="flex items-center gap-2 text-sm text-amber-700 mt-1">
                <MapPin className="w-4 h-4" />
                {product.monastery.location}
              </div>
              {product.monastery.phone && (
                <div className="flex items-center gap-2 text-sm text-amber-700 mt-1">
                  <Phone className="w-4 h-4" />
                  {product.monastery.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div key={p.id}>
                <Link href={`/produit/${p.id}`} className="block group">
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <Image
                      src={p.images.split(',')[0] || '/placeholder.jpg'}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-amber-700 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-amber-700 font-semibold">{p.price.toLocaleString()} FCFA</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

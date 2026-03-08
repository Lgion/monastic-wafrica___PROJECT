import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { categoryLabels } from '@/lib/types'
import { ArrowLeft, MapPin, Phone } from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
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
    <div className="produit">
      {/* Back Link */}
      <Link
        href="/boutique"
        className="produit__back-link"
      >
        <ArrowLeft className="produit__back-icon" />
        Retour à la boutique
      </Link>

      <div className="produit__grid">
        {/* Images */}
        <div className="produit__images">
          <div className="produit__image-main">
            <Image
              src={images[0] || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="produit__img"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="produit__image-thumbs">
              {images.slice(1).map((img: string, i: number) => (
                <div key={i} className="produit__image-thumb">
                  <Image
                    src={img}
                    alt={`${product.name} - ${i + 2}`}
                    fill
                    className="produit__img"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="produit__info">
          <div>
            <span className="produit__category">
              {(categoryLabels as Record<string, string>)[product.category] || product.category}
            </span>
            <h1 className="produit__title">{product.name}</h1>
            <p className="produit__price">{product.price.toLocaleString()} FCFA</p>
          </div>

          <div className="produit__desc">
            <p>{product.description}</p>
          </div>

          <div className="produit__stock">
            <span className={product.stock > 0 ? 'produit__stock-status--in' : 'produit__stock-status--out'}>
              {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
            </span>
          </div>

          <AddToCartButton product={product} />

          {/* Monastery Info */}
          <div className="produit__monastery-section">
            <h3 className="produit__monastery-title">Produit par</h3>
            <div className="produit__monastery-card">
              <p className="produit__monastery-name">{product.monastery.name}</p>
              <div className="produit__monastery-contact">
                <MapPin className="produit__monastery-icon" />
                {product.monastery.location}
              </div>
              {product.monastery.phone && (
                <div className="produit__monastery-contact">
                  <Phone className="produit__monastery-icon" />
                  {product.monastery.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="produit__related">
          <h2 className="produit__related-title">Produits similaires</h2>
          <div className="produit__related-grid">
            {relatedProducts.map((p: any) => (
              <div key={p.id}>
                <Link href={`/produit/${p.id}`} className="produit__related-item">
                  <div className="produit__related-image-wrapper">
                    <Image
                      src={p.images.split(',')[0] || '/placeholder.jpg'}
                      alt={p.name}
                      fill
                      className="produit__related-image"
                    />
                  </div>
                  <h3 className="produit__related-name">
                    {p.name}
                  </h3>
                  <p className="produit__related-price">{p.price.toLocaleString()} FCFA</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Category, categoryLabels } from '@/lib/types'
import { log } from 'console'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    stock: number
    category: string | Category
    monastery: { name: string }
    images: string
    featured: boolean
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images.split(',')[0] || '/placeholder.jpg'
  console.log(product)

  return (
    <div className="product-card">
      <Link href={`/produit/${product.id}`}>
        <div className="product-card__image-container">
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="product-card__image"
          />
          <span className="product-card__badge">
            {(categoryLabels as Record<string, string>)[product.category] || product.category}
          </span>
        </div>
      </Link>
      <div className="product-card__body">
        <p className="product-card__monastery">{product.monastery.name}</p>
        <Link href={`/produit/${product.id}`} className="product-card__product-link">
          <h3 className="product-card__name">
            {product.name}
          </h3>
        </Link>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__footer">
          <span className="product-card__price">{product.price.toLocaleString()} FCFA</span>
          <button
            className="product-card__add-btn"
            aria-label="Ajouter au panier"
          >
            <ShoppingCart className="product-card__icon" />
          </button>
        </div>
      </div>
    </div>
  )
}

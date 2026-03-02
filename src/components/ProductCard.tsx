'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Category, categoryLabels } from '@/lib/types'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    stock: number
    category: Category
    monastery: { name: string }
    images: string
    featured: boolean
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images.split(',')[0] || '/placeholder.jpg'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/produit/${product.id}`}>
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover"
          />
          <span className="absolute top-2 left-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
            {categoryLabels[product.category]}
          </span>
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.monastery.name}</p>
        <Link href={`/produit/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-amber-700 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-amber-700">{product.price.toLocaleString()} FCFA</span>
          <button 
            className="p-2 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors"
            aria-label="Ajouter au panier"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

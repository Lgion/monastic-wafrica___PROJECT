'use client'

import { useState } from 'react'
import { Plus, Minus, ShoppingCart, Check } from 'lucide-react'
import { Category } from '@/lib/types'

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    stock: number
    images: string
    category: Category
  }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    
    // Check if product already in cart
    const existingItem = cart.find((item: { productId: string }) => item.productId === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images.split(',')[0] || '/placeholder.jpg',
      })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    setAdded(true)
    
    // Reset after 2 seconds
    setTimeout(() => setAdded(false), 2000)
  }

  if (product.stock <= 0) {
    return (
      <button
        disabled
        className="w-full py-3 bg-gray-200 text-gray-500 font-medium rounded-lg cursor-not-allowed"
      >
        Rupture de stock
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Quantité:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-gray-100 transition-colors"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="p-2 hover:bg-gray-100 transition-colors"
            disabled={quantity >= product.stock}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={handleAddToCart}
        disabled={added}
        className={`w-full py-3 font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors ${
          added
            ? 'bg-green-600 text-white'
            : 'bg-amber-700 text-white hover:bg-amber-800'
        }`}
      >
        {added ? (
          <>
            <Check className="w-5 h-5" />
            <span>Ajouté au panier!</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>Ajouter au panier - {(product.price * quantity).toLocaleString()} FCFA</span>
          </>
        )}
      </button>
    </div>
  )
}

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
    category: string | Category
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
        className="add-to-cart__submit add-to-cart__submit--disabled"
      >
        Rupture de stock
      </button>
    )
  }

  return (
    <div className="add-to-cart">
      {/* Quantity Selector */}
      <div className="add-to-cart__quantity">
        <span className="add-to-cart__label">Quantité:</span>
        <div className="add-to-cart__controls">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="add-to-cart__btn"
            disabled={quantity <= 1}
          >
            <Minus className="add-to-cart__icon" />
          </button>
          <span className="add-to-cart__value">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="add-to-cart__btn"
            disabled={quantity >= product.stock}
          >
            <Plus className="add-to-cart__icon" />
          </button>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={handleAddToCart}
        disabled={added}
        className={`add-to-cart__submit ${added
          ? 'add-to-cart__submit--added'
          : 'add-to-cart__submit--normal'
          }`}
      >
        {added ? (
          <>
            <Check className="add-to-cart__submit-icon" />
            <span>Ajouté au panier!</span>
          </>
        ) : (
          <>
            <ShoppingCart className="add-to-cart__submit-icon" />
            <span>Ajouter au panier - {(product.price * quantity).toLocaleString()} FCFA</span>
          </>
        )}
      </button>
    </div>
  )
}

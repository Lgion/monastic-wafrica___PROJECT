'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { CartItem } from '@/lib/types'

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
  }, [])

  const updateQuantity = (productId: string, delta: number) => {
    const newCart = cart.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) }
      }
      return item
    })
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeItem = (productId: string) => {
    const newCart = cart.filter(item => item.productId !== productId)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!mounted) return null

  if (cart.length === 0) {
    return (
      <div className="cart__empty">
        <ShoppingBag className="cart__empty-icon" />
        <h1 className="cart__empty-title">Votre panier est vide</h1>
        <p className="cart__empty-desc">Découvrez nos produits artisanaux</p>
        <Link
          href="/boutique"
          className="cart__btn"
        >
          Continuer les achats
        </Link>
      </div>
    )
  }

  return (
    <div className="cart">
      <Link
        href="/boutique"
        className="cart__back-link"
      >
        <ArrowLeft className="cart__back-icon" />
        Continuer les achats
      </Link>

      <h1 className="cart__title">Votre panier</h1>

      <div className="cart__grid">
        {/* Cart Items */}
        <div className="cart__items">
          {cart.map((item) => (
            <div key={item.productId} className="cart__item">
              <div className="cart__item-image-wrapper">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="cart__item-img"
                />
              </div>
              <div className="cart__item-details">
                <h3 className="cart__item-title">{item.name}</h3>
                <p className="cart__item-price">{item.price.toLocaleString()} FCFA</p>

                <div className="cart__item-actions">
                  <div className="cart__qty">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="cart__qty-btn"
                    >
                      <Minus className="cart__qty-icon" />
                    </button>
                    <span className="cart__qty-value">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="cart__qty-btn"
                    >
                      <Plus className="cart__qty-icon" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="cart__remove-btn"
                  >
                    <Trash2 className="cart__qty-icon" />
                  </button>
                </div>
              </div>
              <div className="cart__item-total">
                <p className="cart__item-total-val">
                  {(item.price * item.quantity).toLocaleString()} FCFA
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart__summary">
          <h2 className="cart__summary-title">Récapitulatif</h2>
          <div className="cart__summary-lines">
            <div className="cart__summary-line">
              <span className="cart__summary-label">Sous-total</span>
              <span className="cart__summary-value">{total.toLocaleString()} FCFA</span>
            </div>
            <div className="cart__summary-line">
              <span className="cart__summary-label">Livraison</span>
              <span className="cart__summary-value">Calculée à l&apos;étape suivante</span>
            </div>
          </div>
          <div className="cart__summary-total-wrapper">
            <div className="cart__summary-total">
              <span className="cart__summary-total-label">Total</span>
              <span className="cart__summary-total-value">{total.toLocaleString()} FCFA</span>
            </div>
          </div>
          <Link
            href="/commande"
            className="cart__checkout-btn"
          >
            Passer la commande
          </Link>
        </div>
      </div>
    </div>
  )
}

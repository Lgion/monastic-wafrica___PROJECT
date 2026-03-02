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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
        <p className="text-gray-600 mb-6">Découvrez nos produits artisanaux</p>
        <Link
          href="/boutique"
          className="inline-flex items-center px-6 py-3 bg-amber-700 text-white font-medium rounded-lg hover:bg-amber-800 transition-colors"
        >
          Continuer les achats
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/boutique"
        className="inline-flex items-center text-gray-600 hover:text-amber-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Continuer les achats
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Votre panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.productId} className="flex gap-4 bg-white p-4 rounded-lg border border-gray-200">
              <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-amber-700 font-semibold">{item.price.toLocaleString()} FCFA</p>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  {(item.price * item.quantity).toLocaleString()} FCFA
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-medium">{total.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Livraison</span>
              <span className="font-medium">Calculée à l&apos;étape suivante</span>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-amber-700">{total.toLocaleString()} FCFA</span>
            </div>
          </div>
          <Link
            href="/commande"
            className="block w-full py-3 bg-amber-700 text-white text-center font-medium rounded-lg hover:bg-amber-800 transition-colors"
          >
            Passer la commande
          </Link>
        </div>
      </div>
    </div>
  )
}

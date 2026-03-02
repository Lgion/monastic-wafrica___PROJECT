'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { CartItem, PaymentMethod, paymentLabels, abidjanDistricts } from '@/lib/types'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    address: '',
    district: '',
    paymentMethod: 'CASH_ON_DELIVERY' as PaymentMethod,
  })

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (savedCart.length === 0) {
      router.push('/boutique')
      return
    }
    setCart(savedCart)
  }, [router])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 1000 // FCFA
  const grandTotal = total + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cart,
          total: grandTotal,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setOrderId(data.id)
        setSuccess(true)
        localStorage.removeItem('cart')
      }
    } catch (error) {
      console.error('Error placing order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée!</h1>
        <p className="text-gray-600 mb-2">Merci pour votre commande.</p>
        <p className="text-sm text-gray-500 mb-6">Numéro de commande: {orderId}</p>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Nous vous contacterons prochainement pour confirmer votre commande et organiser la livraison.
        </p>
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
        href="/panier"
        className="inline-flex items-center text-gray-600 hover:text-amber-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour au panier
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de livraison</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="+225 XX XX XX XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quartier *</label>
                <select
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Sélectionner un quartier</option>
                  {abidjanDistricts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse détaillée *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Rue, immeuble, appartement..."
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mode de paiement</h2>
            <div className="space-y-2">
              {(Object.keys(paymentLabels) as PaymentMethod[]).map((method) => (
                <label
                  key={method}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.paymentMethod === method
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                    className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="ml-3 font-medium">{paymentLabels[method]}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-700 text-white font-medium rounded-lg hover:bg-amber-800 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Traitement...' : `Confirmer la commande - ${grandTotal.toLocaleString()} FCFA`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} x{item.quantity}</span>
                <span className="font-medium">{(item.price * item.quantity).toLocaleString()} FCFA</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-medium">{total.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Livraison</span>
              <span className="font-medium">{deliveryFee.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="text-amber-700">{grandTotal.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

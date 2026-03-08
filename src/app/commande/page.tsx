'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { CartItem, PaymentMethod, paymentLabels, abidjanDistricts } from '@/lib/types'
import PaymentWidget from '@/components/PaymentWidget'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [showPayment, setShowPayment] = useState(false)

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

        if (formData.paymentMethod === 'CASH_ON_DELIVERY') {
          setSuccess(true)
          localStorage.removeItem('cart')
        } else {
          setShowPayment(true)
        }
      }
    } catch (error) {
      console.error('Error placing order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="checkout__success">
        <CheckCircle className="checkout__success-icon" />
        <h1 className="checkout__success-title">Commande confirmée!</h1>
        <p className="checkout__success-text">Merci pour votre commande.</p>
        <p className="checkout__success-order-id">Numéro de commande: {orderId}</p>
        <p className="checkout__success-info">
          Nous vous contacterons prochainement pour confirmer votre commande et organiser la livraison.
        </p>
        <Link
          href="/boutique"
          className="checkout__success-btn"
        >
          Continuer les achats
        </Link>
      </div>
    )
  }

  if (showPayment) {
    return (
      <div className="checkout__payment-overlay">
        <PaymentWidget
          amount={grandTotal}
          orderId={orderId}
          onSuccess={async () => {
            // Update order status in DB
            await fetch(`/api/orders/${orderId}/pay`, { method: 'POST' });

            setSuccess(true)
            setShowPayment(false)
            localStorage.removeItem('cart')
          }}
          onCancel={() => setShowPayment(false)}
        />
      </div>
    )
  }

  return (
    <div className="checkout">
      <Link
        href="/panier"
        className="checkout__back-link"
      >
        <ArrowLeft className="cart__back-icon" />
        Retour au panier
      </Link>

      <h1 className="checkout__title">Finaliser la commande</h1>

      <div className="checkout__grid">
        {/* Form */}
        <form onSubmit={handleSubmit} className="checkout__form">
          <div>
            <h2 className="checkout__section-title">Informations de livraison</h2>
            <div className="checkout__fields">
              <div>
                <label className="checkout__label">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="checkout__input"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="checkout__label">Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="checkout__input"
                  placeholder="+225 XX XX XX XX"
                />
              </div>
              <div>
                <label className="checkout__label">Email</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="checkout__input"
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <label className="checkout__label">Quartier *</label>
                <select
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="checkout__input"
                >
                  <option value="">Sélectionner un quartier</option>
                  {abidjanDistricts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="checkout__label">Adresse détaillée *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="checkout__input"
                  placeholder="Rue, immeuble, appartement..."
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="checkout__section-title">Mode de paiement</h2>
            <div className="checkout__payment-methods">
              {(Object.keys(paymentLabels) as PaymentMethod[]).map((method) => (
                <label
                  key={method}
                  className={`checkout__payment-method ${formData.paymentMethod === method
                    ? 'checkout__payment-method--active'
                    : 'checkout__payment-method--inactive'
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                    className="checkout__radio"
                  />
                  <span className="checkout__radio-label">{paymentLabels[method]}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="checkout__submit-btn"
          >
            {loading ? 'Traitement...' : `Confirmer la commande - ${grandTotal.toLocaleString()} FCFA`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="checkout__summary">
          <h2 className="checkout__summary-title">Récapitulatif</h2>
          <div className="checkout__summary-items">
            {cart.map((item) => (
              <div key={item.productId} className="checkout__summary-item">
                <span className="checkout__summary-item-name">{item.name} x{item.quantity}</span>
                <span className="checkout__summary-item-price">{(item.price * item.quantity).toLocaleString()} FCFA</span>
              </div>
            ))}
          </div>
          <div className="checkout__summary-totals">
            <div className="checkout__summary-row">
              <span className="checkout__summary-label">Sous-total</span>
              <span className="checkout__summary-value">{total.toLocaleString()} FCFA</span>
            </div>
            <div className="checkout__summary-row">
              <span className="checkout__summary-label">Livraison</span>
              <span className="checkout__summary-value">{deliveryFee.toLocaleString()} FCFA</span>
            </div>
            <div className="checkout__summary-total-row">
              <span>Total</span>
              <span className="checkout__summary-total-value">{grandTotal.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

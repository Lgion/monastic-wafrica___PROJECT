export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: Category
  monasteryId: string
  monastery: Monastery
  images: string
  featured: boolean
}

export interface Monastery {
  id: string
  name: string
  location: string
  description: string
  phone?: string | null
  email?: string | null
  latitude?: number | null
  longitude?: number | null
}

export type Category = 'MIEL' | 'CONFITURE' | 'TISANE' | 'COSMETIQUE' | 'ARTISANAT' | 'EPICE'

export const categoryLabels: Record<Category, string> = {
  MIEL: 'Miel',
  CONFITURE: 'Confitures',
  TISANE: 'Tisanes',
  COSMETIQUE: 'Cosmétiques',
  ARTISANAT: 'Artisanat',
  EPICE: 'Épices'
}

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export type PaymentMethod = 'ORANGE_MONEY' | 'WAVE' | 'MTN_MONEY' | 'CASH_ON_DELIVERY'

export const paymentLabels: Record<PaymentMethod, string> = {
  ORANGE_MONEY: 'Orange Money',
  WAVE: 'Wave',
  MTN_MONEY: 'MTN Mobile Money',
  CASH_ON_DELIVERY: 'Paiement à la livraison'
}

export const abidjanDistricts = [
  'Cocody',
  'Plateau',
  'Marcory',
  'Treichville',
  'Yopougon',
  'Abobo',
  'Adjame',
  'Koumassi',
  'Port-Bouet',
  'Bingerville',
  'Riviéra',
  'Angré',
  'Autre'
]

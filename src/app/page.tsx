import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import { ArrowRight, Leaf, Truck, Shield } from 'lucide-react'

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: { monastery: true },
    take: 4,
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-green-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Produits artisanaux des
              <span className="text-amber-700"> monastères</span> d&apos;Afrique de l&apos;Ouest
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Découvrez nos miels, confitures, tisanes et cosmétiques naturels 
              fabriqués avec amour par les communautés monastiques d&apos;Abidjan.
            </p>
            <Link
              href="/boutique"
              className="inline-flex items-center px-6 py-3 bg-amber-700 text-white font-medium rounded-lg hover:bg-amber-800 transition-colors"
            >
              Découvrir la boutique
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Leaf className="w-10 h-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">100% Naturel</h3>
              <p className="text-sm text-gray-600">Produits bio sans additifs chimiques</p>
            </div>
            <div className="text-center p-6">
              <Truck className="w-10 h-10 text-amber-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Livraison à Abidjan</h3>
              <p className="text-sm text-gray-600">Livraison rapide dans tous les quartiers</p>
            </div>
            <div className="text-center p-6">
              <Shield className="w-10 h-10 text-amber-700 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Qualité garantie</h3>
              <p className="text-sm text-gray-600">Satisfaction ou remboursement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Produits en vedette</h2>
            <Link
              href="/boutique"
              className="text-amber-700 hover:text-amber-800 font-medium flex items-center"
            >
              Voir tout
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

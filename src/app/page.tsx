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
    <div className="home">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero__container">
          <div className="home-hero__content">
            <h1 className="home-hero__title">
              Produits artisanaux des
              <span className="home-hero__highlight"> monastères</span> d&apos;Afrique de l&apos;Ouest
            </h1>
            <p className="home-hero__description">
              Découvrez nos miels, confitures, tisanes et cosmétiques naturels
              fabriqués avec amour par les communautés monastiques d&apos;Abidjan.
            </p>
            <Link
              href="/boutique"
              className="home-hero__btn"
            >
              Découvrir la boutique
              <ArrowRight className="home-hero__btn-icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        <div className="home-features__container">
          <div className="home-features__grid">
            <div className="home-features__card">
              <Leaf className="home-features__icon home-features__icon--green" />
              <h3 className="home-features__title">100% Naturel</h3>
              <p className="home-features__desc">Produits bio sans additifs chimiques</p>
            </div>
            <div className="home-features__card">
              <Truck className="home-features__icon home-features__icon--amber" />
              <h3 className="home-features__title">Livraison à Abidjan</h3>
              <p className="home-features__desc">Livraison rapide dans tous les quartiers</p>
            </div>
            <div className="home-features__card">
              <Shield className="home-features__icon home-features__icon--dark-amber" />
              <h3 className="home-features__title">Qualité garantie</h3>
              <p className="home-features__desc">Satisfaction ou remboursement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="home-featured">
        <div className="home-featured__container">
          <div className="home-featured__header">
            <h2 className="home-featured__title">Produits en vedette</h2>
            <Link
              href="/boutique"
              className="home-featured__link"
            >
              Voir tout
              <ArrowRight className="home-featured__btn-icon" />
            </Link>
          </div>
          <div className="home-featured__grid">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

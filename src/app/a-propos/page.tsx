import { Leaf, Heart, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="about">
      <h1 className="about__title">À propos de Monastic Wafrica</h1>

      <div className="about__intro">
        <p className="about__intro-p">
          Monastic Wafrica est une initiative qui met en valeur les produits artisanaux des monastères
          d&apos;Afrique de l&apos;Ouest. Notre mission est de soutenir les communautés monastiques de Côte
          d&apos;Ivoire et d&apos;offrir au grand jour des produits authentiques, naturels et de qualité.
        </p>
      </div>

      <div className="about__features">
        <div className="about__feature-card">
          <Leaf className="about__feature-icon about__feature-icon--green" />
          <h3 className="about__feature-title">100% Naturel</h3>
          <p className="about__feature-desc">
            Tous nos produits sont fabriqués à partir d&apos;ingrédients naturels, sans additifs chimiques.
          </p>
        </div>
        <div className="about__feature-card">
          <Heart className="about__feature-icon about__feature-icon--red" />
          <h3 className="about__feature-title">Fait avec amour</h3>
          <p className="about__feature-desc">
            Chaque produit est confectionné avec soin par les moines et moniales dans le respect de la tradition.
          </p>
        </div>
        <div className="about__feature-card">
          <Users className="about__feature-icon about__feature-icon--amber" />
          <h3 className="about__feature-title">Soutien local</h3>
          <p className="about__feature-desc">
            Vos achats contribuent directement au financement des œuvres des monastères.
          </p>
        </div>
      </div>

      <div className="about__history">
        <h2 className="about__history-title">Notre histoire</h2>
        <p className="about__history-p">
          Né de la volonté de faire découvrir les savoir-faire monastiques de Côte d&apos;Ivoire,
          Monastic Wafrica a été fondé en 2024 avec l&apos;ambition de créer un pont entre les
          communautés monastiques et les amateurs de produits artisanaux authentiques.
        </p>
        <p className="about__history-p">
          Nous collaborons actuellement avec trois monastères situés à Abidjan et en région,
          produisant miel, confitures, tisanes, cosmétiques naturels et artisanat. Notre
          objectif est d&apos;étendre ce réseau à d&apos;autres monastères de Côte d&apos;Ivoire, puis
          dans toute l&apos;Afrique de l&apos;Ouest.
        </p>
      </div>
    </div>
  )
}

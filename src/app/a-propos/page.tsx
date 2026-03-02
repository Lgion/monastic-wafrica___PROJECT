import { Leaf, Heart, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">À propos de Monastic Wafrica</h1>

      <div className="prose prose-lg mx-auto mb-12">
        <p className="text-gray-600 leading-relaxed">
          Monastic Wafrica est une initiative qui met en valeur les produits artisanaux des monastères 
          d&apos;Afrique de l&apos;Ouest. Notre mission est de soutenir les communautés monastiques de Côte 
          d&apos;Ivoire et d&apos;offrir au grand jour des produits authentiques, naturels et de qualité.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center p-6 bg-amber-50 rounded-lg">
          <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">100% Naturel</h3>
          <p className="text-sm text-gray-600">
            Tous nos produits sont fabriqués à partir d&apos;ingrédients naturels, sans additifs chimiques.
          </p>
        </div>
        <div className="text-center p-6 bg-amber-50 rounded-lg">
          <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Fait avec amour</h3>
          <p className="text-sm text-gray-600">
            Chaque produit est confectionné avec soin par les moines et moniales dans le respect de la tradition.
          </p>
        </div>
        <div className="text-center p-6 bg-amber-50 rounded-lg">
          <Users className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Soutien local</h3>
          <p className="text-sm text-gray-600">
            Vos achats contribuent directement au financement des œuvres des monastères.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre histoire</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Né de la volonté de faire découvrir les savoir-faire monastiques de Côte d&apos;Ivoire, 
          Monastic Wafrica a été fondé en 2024 avec l&apos;ambition de créer un pont entre les 
          communautés monastiques et les amateurs de produits artisanaux authentiques.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Nous collaborons actuellement avec trois monastères situés à Abidjan et en région, 
          produisant miel, confitures, tisanes, cosmétiques naturels et artisanat. Notre 
          objectif est d&apos;étendre ce réseau à d&apos;autres monastères de Côte d&apos;Ivoire, puis 
          dans toute l&apos;Afrique de l&apos;Ouest.
        </p>
      </div>
    </div>
  )
}

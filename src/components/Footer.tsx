import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Monastic Wafrica</h3>
            <p className="text-amber-200 text-sm leading-relaxed">
              Produits artisanaux authentiques des monastères d'Abidjan et de Côte d'Ivoire. 
              Qualité, tradition et spiritualité dans chaque produit.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/boutique" className="text-amber-200 hover:text-white transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-amber-200 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-amber-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-amber-200">
                <MapPin className="w-4 h-4" />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
              <li className="flex items-center space-x-2 text-amber-200">
                <Phone className="w-4 h-4" />
                <span>+225 XX XX XX XX</span>
              </li>
              <li className="flex items-center space-x-2 text-amber-200">
                <Mail className="w-4 h-4" />
                <span>contact@monastic-wafrica.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-800 mt-8 pt-8 text-center text-sm text-amber-300">
          <p>&copy; {new Date().getFullYear()} Monastic Wafrica. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

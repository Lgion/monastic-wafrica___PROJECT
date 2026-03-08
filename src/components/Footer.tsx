import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          {/* About */}
          <div className="footer__section">
            <h3 className="footer__title">Monastic Wafrica</h3>
            <p className="footer__description">
              Produits artisanaux authentiques des monastères d'Abidjan et de Côte d'Ivoire.
              Qualité, tradition et spiritualité dans chaque produit.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h3 className="footer__title">Liens rapides</h3>
            <ul className="footer__link-list">
              <li className="footer__link-item">
                <Link href="/boutique" className="footer__link">
                  Boutique
                </Link>
              </li>
              <li className="footer__link-item">
                <Link href="/a-propos" className="footer__link">
                  À propos
                </Link>
              </li>
              <li className="footer__link-item">
                <Link href="/contact" className="footer__link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__section">
            <h3 className="footer__title">Contact</h3>
            <ul className="footer__contact-list">
              <li className="footer__contact-item">
                <MapPin className="footer__contact-icon" />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
              <li className="footer__contact-item">
                <Phone className="footer__contact-icon" />
                <span>+225 XX XX XX XX</span>
              </li>
              <li className="footer__contact-item">
                <Mail className="footer__contact-icon" />
                <span>contact@monastic-wafrica.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">&copy; {new Date().getFullYear()} Monastic Wafrica. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

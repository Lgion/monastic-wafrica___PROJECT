'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Menu, X, Search, User } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Boutique' },
    { href: '/monasteres', label: 'Monastères' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/admin', label: 'Admin' },
  ]

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__content">
          {/* Logo */}
          <Link href="/" className="header__logo">
            <span className="header__logo-text header__logo-text--primary">Monastic</span>
            <span className="header__logo-text header__logo-text--secondary">Wafrica</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="header__nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="header__nav-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="header__actions">
            <button className="header__action-btn">
              <Search className="header__action-icon" />
            </button>
            <Link
              href="/panier"
              className="header__action-btn header__action-btn--cart"
            >
              <ShoppingCart className="header__action-icon" />
            </Link>
            <button className="header__action-btn header__action-btn--desktop-only">
              <User className="header__action-icon" />
            </button>

            {/* Mobile menu button */}
            <button
              className="header__action-btn header__action-btn--mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="header__action-icon" /> : <Menu className="header__action-icon" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="header__mobile-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="header__mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

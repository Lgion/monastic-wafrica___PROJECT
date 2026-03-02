'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Menu, X, Search, User } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Boutique' },
    { href: '/a-propos', label: 'À propos' },
  ]

  return (
    <header className="bg-amber-50 border-b border-amber-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-amber-800">Monastic</span>
            <span className="text-2xl font-bold text-green-700">Wafrica</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-amber-700 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-amber-700 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/panier"
              className="p-2 text-gray-600 hover:text-amber-700 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <button className="hidden md:block p-2 text-gray-600 hover:text-amber-700 transition-colors">
              <User className="w-5 h-5" />
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-amber-700 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-amber-100">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-700 hover:text-amber-700 font-medium"
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

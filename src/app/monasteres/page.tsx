import React from 'react';
import { prisma } from '@/lib/prisma';
import { Home, MapPin, Phone, Mail, Package, ArrowRight, Compass } from 'lucide-react';
import Link from 'next/link';
import { MonasteryMap } from '@/components/map';

async function getMonasteries() {
    return await prisma.monastery.findMany({
        include: {
            products: {
                take: 3
            },
            _count: {
                select: { products: true }
            }
        },
        orderBy: { name: 'asc' }
    });
}

export default async function MonasteriesPage() {
    const monasteries = await getMonasteries();

    return (
        <div className="monasteries">
            {/* Hero Section */}
            <section className="monasteries__hero">
                <div className="monasteries__hero-container">
                    <h1 className="monasteries__hero-title">Nos Communautés</h1>
                    <p className="monasteries__hero-p">
                        Découvrez les lieux de prière et de travail qui donnent naissance à nos produits d&apos;exception.
                    </p>
                </div>
                <div className="monasteries__hero-blob monasteries__hero-blob--tr"></div>
                <div className="monasteries__hero-blob monasteries__hero-blob--bl"></div>
            </section>

            {/* Map Section */}
            <section className="monasteries__map-section">
                <MonasteryMap monasteries={monasteries} />
            </section>

            {/* List Section */}
            <section className="monasteries__list-section">
                <div className="monasteries__list-header">
                    <div className="monasteries__list-indicator"></div>
                    <h2 className="monasteries__list-title">Toutes les communautés</h2>
                </div>

                <div className="monasteries__grid">
                    {monasteries.map((m) => (
                        <div key={m.id} id={m.id} className="monasteries__card">
                            {/* Left: Info */}
                            <div className="monasteries__card-info">
                                <div className="monasteries__card-header">
                                    <span className="monasteries__card-eyebrow">
                                        <Compass className="w-4 h-4" />
                                        Communauté répertoriée
                                    </span>
                                    <h3 className="monasteries__card-title">{m.name}</h3>
                                </div>

                                <p className="monasteries__card-desc">
                                    &ldquo;{m.description}&rdquo;
                                </p>

                                <div className="monasteries__contact-grid">
                                    <div className="monasteries__contact-item">
                                        <div className="monasteries__contact-icon-wrapper">
                                            <MapPin className="monasteries__contact-icon" />
                                        </div>
                                        <div>
                                            <p className="monasteries__contact-label">Localisation</p>
                                            <p className="monasteries__contact-value">{m.location}</p>
                                        </div>
                                    </div>
                                    {m.phone && (
                                        <div className="monasteries__contact-item">
                                            <div className="monasteries__contact-icon-wrapper">
                                                <Phone className="monasteries__contact-icon" />
                                            </div>
                                            <div>
                                                <p className="monasteries__contact-label">Téléphone</p>
                                                <p className="monasteries__contact-value">{m.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                    {m.email && (
                                        <div className="monasteries__contact-item">
                                            <div className="monasteries__contact-icon-wrapper">
                                                <Mail className="monasteries__contact-icon" />
                                            </div>
                                            <div>
                                                <p className="monasteries__contact-label">Email</p>
                                                <p className="monasteries__contact-value monasteries__contact-value--truncate">{m.email}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Products Preview */}
                            <div className="monasteries__card-products">
                                <div className="monasteries__products-header">
                                    <h4 className="monasteries__products-title">
                                        <Package className="monasteries__products-icon" />
                                        Produits artisanaux ({m._count.products})
                                    </h4>
                                </div>

                                <div className="monasteries__product-list">
                                    {m.products.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/produit/${product.id}`}
                                            className="monasteries__product-item"
                                        >
                                            <div className="monasteries__product-left">
                                                <div className="monasteries__product-icon-wrapper">
                                                    <Package className="monasteries__product-icon-large" />
                                                </div>
                                                <div>
                                                    <p className="monasteries__product-name">{product.name}</p>
                                                    <p className="monasteries__product-category">{product.category}</p>
                                                </div>
                                            </div>
                                            <div className="monasteries__product-right">
                                                <span className="monasteries__product-price">{product.price.toLocaleString()} FCFA</span>
                                                <div className="monasteries__product-arrow-btn">
                                                    <ArrowRight className="monasteries__product-arrow-icon" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    {m.products.length === 0 && (
                                        <p className="monasteries__empty-text">Aucun produit listé pour cette communauté.</p>
                                    )}
                                </div>

                                {m._count.products > 3 && (
                                    <Link
                                        href={`/boutique?monastery=${m.id}`}
                                        className="monasteries__view-all-btn"
                                    >
                                        Voir tous les {m._count.products} produits
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

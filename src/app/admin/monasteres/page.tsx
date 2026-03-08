import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Home,
    MapPin,
    Phone,
    Mail,
    ExternalLink,
    Package
} from 'lucide-react';

async function getMonasteries() {
    return await prisma.monastery.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export default async function AdminMonasteriesPage() {
    const monasteries = await getMonasteries();

    return (
        <div className="admin-monasteries">
            <div className="admin-monasteries__header">
                <div>
                    <h1 className="admin-monasteries__title">Monastères</h1>
                    <p className="admin-monasteries__subtitle">Gérez les communautés chrétiennes et leurs informations</p>
                </div>
                <Link
                    href="/admin/monasteres/nouveau"
                    className="admin-monasteries__add-btn"
                >
                    <Plus className="w-5 h-5" />
                    Nouveau Monastère
                </Link>
            </div>

            <div className="admin-monasteries__controls">
                <div className="admin-monasteries__search">
                    <Search className="admin-monasteries__search-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher un monastère, un lieu..."
                        className="admin-monasteries__search-input"
                    />
                </div>
            </div>

            <div className="admin-monasteries__grid">
                {monasteries.map((m: any) => (
                    <div key={m.id} className="admin-monasteries__card">
                        <div className="admin-monasteries__card-body">
                            <div className="admin-monasteries__card-header">
                                <div className="admin-monasteries__card-icon-wrapper">
                                    <Home className="admin-monasteries__card-icon" />
                                </div>
                                <div className="admin-monasteries__card-actions">
                                    <Link href={`/admin/monasteres/${m.id}/modifier`} className="admin-monasteries__card-action-btn admin-monasteries__card-action-btn--edit">
                                        <Edit2 className="admin-monasteries__card-action-icon" />
                                    </Link>
                                    <button className="admin-monasteries__card-action-btn admin-monasteries__card-action-btn--delete">
                                        <Trash2 className="admin-monasteries__card-action-icon" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="admin-monasteries__card-title">{m.name}</h3>
                            <p className="admin-monasteries__card-desc">{m.description}</p>

                            <div className="admin-monasteries__card-info">
                                <div className="admin-monasteries__card-info-item">
                                    <MapPin className="admin-monasteries__card-info-icon" />
                                    <span>{m.location}</span>
                                </div>
                                {m.phone && (
                                    <div className="admin-monasteries__card-info-item">
                                        <Phone className="admin-monasteries__card-info-icon" />
                                        <span>{m.phone}</span>
                                    </div>
                                )}
                                {m.email && (
                                    <div className="admin-monasteries__card-info-item">
                                        <Mail className="admin-monasteries__card-info-icon" />
                                        <span>{m.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="admin-monasteries__card-footer">
                            <div className="admin-monasteries__card-products">
                                <Package className="admin-monasteries__card-products-icon" />
                                <span>{m._count.products} produits</span>
                            </div>
                            <Link href={`/monasteres#${m.id}`} className="admin-monasteries__card-link">
                                <ExternalLink className="admin-monasteries__card-link-icon" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {monasteries.length === 0 && (
                <div className="admin-monasteries__empty">
                    <div className="admin-monasteries__empty-icon-wrapper">
                        <Home className="admin-monasteries__empty-icon" />
                    </div>
                    <h3 className="admin-monasteries__empty-title">Aucun monastère trouvé</h3>
                    <p className="admin-monasteries__empty-subtitle">Commencez par ajouter votre première communauté.</p>
                    <Link
                        href="/admin/monasteres/nouveau"
                        className="admin-monasteries__add-btn"
                        style={{ margin: "0 auto", width: "fit-content" }}
                    >
                        <Plus className="w-5 h-5" />
                        Créer un monastère
                    </Link>
                </div>
            )}
        </div>
    );
}

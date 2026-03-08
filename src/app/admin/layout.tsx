import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  ChevronRight,
  LogOut,
  Bell,
  Home
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: ShoppingBag, label: 'Commandes', href: '/admin/commandes' },
    { icon: Package, label: 'Produits', href: '/admin/produits' },
    { icon: Home, label: 'Monastères', href: '/admin/monasteres' },
    { icon: Users, label: 'Clients', href: '/admin/clients' },
    { icon: Settings, label: 'Réglages', href: '/admin/settings' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__sidebar-header">
          <Link href="/admin" className="admin-layout__sidebar-brand">
            <div className="admin-layout__sidebar-logo">M</div>
            <span className="admin-layout__sidebar-title">Monastic Admin</span>
          </Link>
        </div>

        <nav className="admin-layout__nav">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="admin-layout__nav-link"
            >
              <div className="admin-layout__nav-group">
                <item.icon className="admin-layout__nav-icon" />
                <span className="admin-layout__nav-label">{item.label}</span>
              </div>
              <ChevronRight className="admin-layout__nav-chevron" />
            </Link>
          ))}
        </nav>

        <div className="admin-layout__sidebar-footer">
          <button className="admin-layout__logout-btn">
            <LogOut className="admin-layout__logout-icon" />
            <span className="admin-layout__logout-label">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-layout__wrapper">
        {/* Top Header */}
        <header className="admin-layout__header">
          <div className="admin-layout__header-msg">Bienvenue dans l'interface de gestion</div>
          <div className="admin-layout__header-actions">
            <button className="admin-layout__notif-btn">
              <Bell className="admin-layout__notif-icon" />
              <span className="admin-layout__notif-badge"></span>
            </button>
            <div className="admin-layout__header-divider"></div>
            <div className="admin-layout__profile">
              <div className="admin-layout__profile-info">
                <p className="admin-layout__profile-name">Admin User</p>
                <p className="admin-layout__profile-role">Super Admin</p>
              </div>
              <div className="admin-layout__profile-avatar">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="admin-layout__content">
          {children}
        </div>
      </main>
    </div>
  );
}

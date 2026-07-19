import React from 'react';
import { Flower, ShoppingCart, Shield, Sparkles, Navigation as MapPin, Phone, Database, UserCheck, Heart } from 'lucide-react';
import { Role } from '../types';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  cartCount: number;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  cartCount,
}: NavigationProps) {
  const tabs = [
    { id: 'shop', label: 'Boutique Shop', icon: Flower, roles: ['customer', 'admin', 'staff'] },
    { id: 'builder', label: 'Bouquet Designer', icon: Sparkles, roles: ['customer', 'admin', 'staff'] },
    { id: 'concierge', label: 'AI Concierge', icon: Sparkles, roles: ['customer', 'admin', 'staff'] },
    { id: 'delivery', label: 'Delivery Radar', icon: MapPin, roles: ['customer', 'rider', 'admin', 'staff'] },
    { id: 'procurement', label: 'Procurement PO', icon: Database, roles: ['admin', 'staff'] },
    { id: 'crm', label: 'CRM & Campaigns', icon: Phone, roles: ['admin', 'staff'] },
    { id: 'dashboard', label: 'Management Hub', icon: Shield, roles: ['admin', 'staff'] },
    { id: 'architecture', label: 'ERD & Architecture', icon: Database, roles: ['admin', 'staff', 'customer'] },
  ];

  const visibleTabs = tabs.filter(tab => tab.roles.includes(currentRole));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D4AF37]/10 bg-[#FCF9F6]/90 backdrop-blur-md">
      {/* Top micro-bar: Role Selector & Philosophy */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-6 py-2 bg-[#D4AF37]/5 border-b border-[#D4AF37]/5 text-[11px] text-gray-600">
        <div className="flex items-center gap-1.5 font-sans text-center sm:text-left">
          <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]/20 animate-pulse" />
          <span>"Flowers are expressions of emotion, hope, and connection." — <span className="font-serif italic font-semibold text-gray-800">Ana's Garden</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-gray-500 font-medium">
            <UserCheck className="w-3.5 h-3.5 text-[#9CAF88]" /> Simulation Persona:
          </span>
          <select
            value={currentRole}
            onChange={(e) => {
              const selectedRole = e.target.value as Role;
              setCurrentRole(selectedRole);
              // Auto switch active tab to match permissions
              if (selectedRole === 'rider') {
                setActiveTab('delivery');
              } else if (selectedRole === 'customer') {
                if (activeTab === 'dashboard' || activeTab === 'procurement' || activeTab === 'crm') {
                  setActiveTab('shop');
                }
              } else {
                setActiveTab('dashboard');
              }
            }}
            className="bg-white border border-[#D4AF37]/10 rounded-full px-3 py-0.5 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] font-medium cursor-pointer shadow-sm"
            id="role-selector"
          >
            <option value="customer">Customer (Fariz Hamdi)</option>
            <option value="admin">Founder & Owner (Aziliana Ying)</option>
            <option value="staff">Boutique Staff</option>
            <option value="rider">Delivery Rider (Ferry)</option>
          </select>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Identity */}
        <div 
          onClick={() => setActiveTab('shop')} 
          className="flex items-center gap-3.5 cursor-pointer group"
          id="brand-logo"
        >
          <div className="p-2.5 rounded-full bg-white border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#FCF9F6] transition-all duration-300 shadow-sm">
            <Flower className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-[#1A1A1A]">
              ANA’S GARDEN
            </h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#9CAF88] font-bold font-sans mt-0.5">
              Sabah's Smart Florist • Kota Kinabalu
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center justify-center gap-1.5 bg-white/40 p-1 rounded-full border border-gray-100">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white shadow-md shadow-black/5'
                    : 'text-gray-500 hover:text-[#D4AF37] hover:bg-gray-100/50'
                }`}
                id={`nav-tab-${tab.id}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action icons / Cart */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden xl:block">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Freshness Guarantee</p>
            <p className="text-xs font-bold text-[#D4AF37]">90-Min KK Delivery</p>
          </div>
          
          <button
            onClick={() => setActiveTab('shop')}
            className="relative p-2.5 rounded-full bg-white border border-gray-100 text-gray-600 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 hover:shadow-sm transition-all"
            id="cart-button"
            title="Cart & Orders"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#1A1A1A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

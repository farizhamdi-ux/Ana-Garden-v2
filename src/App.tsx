import React, { useState } from 'react';
import Navigation from './components/Navigation';
import CustomerShop from './components/CustomerShop';
import BouquetBuilder from './components/BouquetBuilder';
import AiConcierge from './components/AiConcierge';
import DeliveryTracker from './components/DeliveryTracker';
import Procurement from './components/Procurement';
import CrmCampaigns from './components/CrmCampaigns';
import Dashboard from './components/Dashboard';
import SystemArchitecture from './components/SystemArchitecture';
import { Role, Order, CartItem } from './types';
import { mockOrders } from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('shop');
  const [currentRole, setCurrentRole] = useState<Role>('customer');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(380);

  const handleAddCustomBouquetToCart = (customItem: CartItem) => {
    setCart([...cart, customItem]);
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'shop':
        return (
          <CustomerShop
            onAddCustomBouquetToCart={handleAddCustomBouquetToCart}
            onPlaceOrder={handlePlaceOrder}
            cart={cart}
            setCart={setCart}
            loyaltyPoints={loyaltyPoints}
            setLoyaltyPoints={setLoyaltyPoints}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        );
      case 'builder':
        return (
          <BouquetBuilder
            onAddCustomBouquetToCart={handleAddCustomBouquetToCart}
            setActiveTab={setActiveTab}
          />
        );
      case 'concierge':
        return <AiConcierge />;
      case 'delivery':
        return (
          <DeliveryTracker
            orders={orders}
            setOrders={setOrders}
            currentRole={currentRole}
          />
        );
      case 'procurement':
        return <Procurement />;
      case 'crm':
        return <CrmCampaigns />;
      case 'dashboard':
        return <Dashboard />;
      case 'architecture':
        return <SystemArchitecture />;
      default:
        return (
          <CustomerShop
            onAddCustomBouquetToCart={handleAddCustomBouquetToCart}
            onPlaceOrder={handlePlaceOrder}
            cart={cart}
            setCart={setCart}
            loyaltyPoints={loyaltyPoints}
            setLoyaltyPoints={setLoyaltyPoints}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F6] text-gray-900 selection:bg-[#9CAF88]/30 selection:text-gray-900">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />

      <main className="pb-24">
        {renderActiveView()}
      </main>

      <footer className="bg-gray-950 text-white py-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-gray-400">
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm tracking-wide">ANA'S GARDEN</h4>
            <p className="leading-relaxed">
              Sabah's Premium Smart Florist Shop. We handcraft luxury flower arrangements with precision temperature cold-chain logistics direct from Cameron Highlands farms.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Boutique Hub Location</h4>
            <p className="leading-relaxed">
              Lot 14, Damai Plaza Phase 3,<br />
              Jalan Damai, Luyang,<br />
              88300 Kota Kinabalu, Sabah, Malaysia.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Cold-Chain Logistics Map</h4>
            <p className="leading-relaxed">
              Farms: Brinchang & Ringlet, Cameron Highlands<br />
              Transit: Ranau Road & Kundasang Foothills<br />
              Delivery Coverage: Likas, Penampang, Damai, Lintas, Tanjung Aru.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Platform Core Integrity</h4>
            <p className="leading-relaxed">
              Secure payments powered by FPX and Stripe. AI-Personalized predictions running on Google Cloud Vertex AI LLMs.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-900/50 text-center text-[10px] text-gray-500">
          <p>© 2026 Ana's Garden (Kota Kinabalu). All Rights Reserved. Protected under PDPA Malaysia 2010. Powered by Google AI Studio.</p>
        </div>
      </footer>
    </div>
  );
}

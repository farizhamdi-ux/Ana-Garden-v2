import React, { useState } from 'react';
import { Database, Server, Cpu, Cloud, Globe, ShieldAlert, ArrowRight, Table } from 'lucide-react';

export default function SystemArchitecture() {
  const [activeSubTab, setActiveSubTab] = useState<'architecture' | 'erd' | 'api'>('architecture');

  const erdTables = [
    {
      name: 'users',
      desc: 'Customer and employee identities',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Unique identifier' },
        { name: 'role', type: 'VARCHAR(20)', key: '', desc: 'admin, staff, rider, customer, supplier' },
        { name: 'full_name', type: 'TEXT', key: '', desc: 'User full name' },
        { name: 'email', type: 'TEXT (UNIQUE)', key: '', desc: 'Authentication email' },
        { name: 'phone_number', type: 'TEXT', key: '', desc: 'Recipient notifications' },
        { name: 'loyalty_points', type: 'INT', key: '', desc: 'Cumulative rewards points' },
        { name: 'preferences', type: 'JSONB', key: '', desc: 'Allergies, anniversaries' }
      ]
    },
    {
      name: 'flowers',
      desc: 'Raw material floral stems sourced from Brinchang',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Unique identifier' },
        { name: 'name', type: 'TEXT', key: '', desc: 'Blossom name' },
        { name: 'origin', type: 'TEXT', key: '', desc: 'Cameron Highlands, Kundasang' },
        { name: 'seasonal_months', type: 'INT[]', key: '', desc: 'Active calendar months' },
        { name: 'base_price_per_stem', type: 'DECIMAL', key: '', desc: 'Wholesale acquisition cost' },
        { name: 'freshness_duration_days', type: 'INT', key: '', desc: 'Estimated lifespan from harvest' }
      ]
    },
    {
      name: 'products_bouquets',
      desc: 'Standard pre-made or custom configurations',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Unique identifier' },
        { name: 'name', type: 'TEXT', key: '', desc: 'Arrangement name' },
        { name: 'description', type: 'TEXT', key: '', desc: 'Botanical storytelling desc' },
        { name: 'price', type: 'DECIMAL', key: '', desc: 'Retail cost in RM' },
        { name: 'category', type: 'VARCHAR(30)', key: '', desc: 'Anniversary, Birthday, etc' },
        { name: 'is_custom', type: 'BOOLEAN', key: '', desc: 'User-designed indicator' },
        { name: 'image_url', type: 'TEXT', key: '', desc: 'Asset delivery path' }
      ]
    },
    {
      name: 'orders',
      desc: 'Transaction purchase and delivery ledgers',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Unique identifier' },
        { name: 'order_number', type: 'VARCHAR(20)', key: 'UNIQUE', desc: 'Formal reference invoice' },
        { name: 'customer_id', type: 'UUID', key: 'FK', desc: 'References users(id)' },
        { name: 'total_amount', type: 'DECIMAL', key: '', desc: 'Total Ringgit paid' },
        { name: 'payment_method', type: 'VARCHAR(20)', key: '', desc: 'FPX, Stripe, DuitNow' },
        { name: 'payment_status', type: 'VARCHAR(20)', key: '', desc: 'Paid, Pending, Failed' },
        { name: 'status', type: 'VARCHAR(20)', key: '', desc: 'Preparing, Out for Delivery, etc' },
        { name: 'delivery_address', type: 'TEXT', key: '', desc: 'KK Dropoff location text' },
        { name: 'delivery_lat_long', type: 'POINT', key: '', desc: 'Coordinates for Rider navigation' },
        { name: 'scheduled_at', type: 'TIMESTAMP', key: '', desc: 'Target delivery hour' },
        { name: 'bloom_memory_url', type: 'TEXT', key: '', desc: 'QR Cloud Storage attachment link' }
      ]
    },
    {
      name: 'suppliers',
      desc: 'Cameron Highlands high-altitude grower network',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Unique identifier' },
        { name: 'name', type: 'TEXT', key: '', desc: 'Grower company' },
        { name: 'location', type: 'TEXT', key: '', desc: 'Brinchang, Ringlet, Kundasang' },
        { name: 'moq', type: 'DECIMAL', key: '', desc: 'Minimum Order Quantity trigger' },
        { name: 'lead_time_days', type: 'INT', key: '', desc: 'Days from PO to dock' }
      ]
    }
  ];

  const apiSpecs = [
    { method: 'POST', endpoint: '/api/chat', desc: 'AI Bouquet Concierge. Feeds recipient relationship context, emotional mood, and Ringgit budgets into Gemini 3.5-flash text models to generate elegant customized pairings.' },
    { method: 'POST', endpoint: '/api/forecast', desc: 'AI Inventory Demand Forecaster. Aggregates weekly financial summaries, local stock logs, and Sabah holiday records (Kaamatan, Raya) to build exact wholesaling order guides.' },
    { method: 'POST', endpoint: '/api/generate-card', desc: 'AI Card Generator. Receives raw inputs like occasion, recipient name, tone, and outputs touchable alternate card greeting models.' },
    { method: 'POST', endpoint: '/api/generate-promo', desc: 'AI Marketer copy generator. Creates optimized, luxury WhatsApp and Email copy segments targeting premium users.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans" id="architecture-view">
      {/* Title */}
      <div className="mb-10 text-center sm:text-left">
        <span className="inline-block px-4 py-1.5 bg-[#9CAF88]/10 text-[#9CAF88] text-[10px] font-bold uppercase tracking-[0.25em] rounded-full mb-3">
          Sabah's Premium Florist Infrastructure
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight flex items-center justify-center sm:justify-start gap-2">
          <Server className="w-7 h-7 text-gray-900" /> Platform Architecture &amp; Database Design
        </h2>
        <p className="text-xs text-gray-500 mt-1.5">Full structural blueprint, relational database ERD schemas, and Vertex AI endpoints specifications.</p>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-gray-100 mb-8 justify-center sm:justify-start gap-1">
        <button
          onClick={() => setActiveSubTab('architecture')}
          className={`px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all duration-300 ${
            activeSubTab === 'architecture' ? 'border-[#D4AF37] text-gray-900 font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          System Architecture Map
        </button>
        <button
          onClick={() => setActiveSubTab('erd')}
          className={`px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all duration-300 ${
            activeSubTab === 'erd' ? 'border-[#D4AF37] text-gray-900 font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Relational Database ERD
        </button>
        <button
          onClick={() => setActiveSubTab('api')}
          className={`px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all duration-300 ${
            activeSubTab === 'api' ? 'border-[#D4AF37] text-gray-900 font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          API Endpoint Specs
        </button>
      </div>

      {activeSubTab === 'architecture' && (
        <div className="space-y-6">
          {/* Visual Architecture flowchart */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-gray-900 text-base border-b border-gray-50 pb-3">Google Cloud Platform (GCP) Serverless Microservices Topology</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-xs items-stretch relative">
              {/* Box 1: Client Layer */}
              <div className="bg-[#FCF9F6] border border-[#D4AF37]/10 rounded-[1.5rem] p-6 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#9CAF88]" />
                  <h4 className="font-bold text-gray-800">1. Client SPA Layer</h4>
                </div>
                <p className="text-gray-500 leading-relaxed text-[11px]">
                  Premium React + Tailwind SPA running in browser. Uses Geolocation APIs to query local rider offsets in Tanjung Aru/Lintas and renders HTML5 SVG-based map vectors.
                </p>
                <div className="text-[9px] bg-white border border-gray-100 px-2.5 py-1 rounded-full text-center text-gray-400 font-mono">
                  Port 3000 (ingress proxy)
                </div>
              </div>

              {/* Box 2: Server API Container */}
              <div className="bg-[#1A1A1A] text-white border border-gray-800 rounded-[1.5rem] p-6 flex flex-col justify-between space-y-3 shadow-md">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-[#D4AF37]" />
                  <h4 className="font-bold">2. Google Cloud Run</h4>
                </div>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  Express + Node.js backend container handles lazy-initialization of Google GenAI, parses JSON, and protects the GEMINI_API_KEY from exposure.
                </p>
                <div className="text-[9px] bg-white/10 border border-white/20 px-2.5 py-1 rounded-full text-center text-gray-300 font-mono">
                  Standard Node ESM Runtime
                </div>
              </div>

              {/* Box 3: AI Cognitive layer */}
              <div className="bg-gradient-to-br from-[#FCF9F6] to-[#F5F2ED] border border-[#D4AF37]/25 rounded-[1.5rem] p-6 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#D4AF37]" />
                  <h4 className="font-bold text-gray-800">3. Vertex AI Model Engine</h4>
                </div>
                <p className="text-gray-500 leading-relaxed text-[11px]">
                  Google Gemini 3.5-flash models ingest raw holiday calendars, stock values, and customer preferences. Auto-generates PO targets, text, and marketing copy.
                </p>
                <div className="text-[9px] bg-white border border-[#D4AF37]/20 px-2.5 py-1 rounded-full text-center text-[#856c1f] font-mono">
                  gemini-3.5-flash endpoint
                </div>
              </div>

              {/* Box 4: Database Storage */}
              <div className="bg-[#FCF9F6] border border-[#D4AF37]/10 rounded-[1.5rem] p-6 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#9CAF88]" />
                  <h4 className="font-bold text-gray-800">4. Cloud SQL (PostgreSQL)</h4>
                </div>
                <p className="text-gray-500 leading-relaxed text-[11px]">
                  High-availability relational ledger handles ACID transactions. Google Cloud Storage handles video "Bloom Memories" linked to QR indices on customer receipts.
                </p>
                <div className="text-[9px] bg-white border border-gray-100 px-2.5 py-1 rounded-full text-center text-gray-400 font-mono">
                  PG Vector &amp; JSONB columns
                </div>
              </div>
            </div>
            
            {/* Delivery guarantee USP callout */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FCF9F6] to-[#F5F2ED] border border-[#D4AF37]/15 text-xs text-gray-700 leading-relaxed flex items-start gap-3.5">
              <span className="text-xl leading-none">🚀</span>
              <p>
                <strong>Kota Kinabalu 90-Min delivery logistics:</strong> In progress, we integrate with Google Maps Routes API to calculate real-time transit matrix offsets from the boutique in Damai to destination coordinates (Peak Vista, DoubleTree Lintas, Sutera Harbour, etc.), taking advantage of local Sabah traffic peak models dynamically.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'erd' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-gray-900 text-base border-b border-gray-50 pb-3 flex items-center gap-2">
              <Table className="w-5 h-5 text-[#9CAF88]" /> Interactive Database Entity Relationship Diagram (ERD)
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              This relational database schema is configured under PostgreSQL. It features standard constraints and index triggers on UUID keys. Lines trace relationships between foreign-key dependencies:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {erdTables.map((table) => (
                <div key={table.name} className="border border-[#D4AF37]/10 rounded-2xl p-5 bg-[#FCF9F6] space-y-3.5 shadow-xs">
                  <div className="flex justify-between items-center bg-[#1A1A1A] text-white p-3 rounded-xl text-xs font-bold font-mono shadow-sm">
                    <span>{table.name}</span>
                    <span className="text-[9px] text-[#D4AF37] opacity-80 uppercase tracking-widest font-sans font-extrabold">Table</span>
                  </div>
                  <p className="text-[10px] text-gray-400 italic font-sans leading-relaxed">{table.desc}</p>
                  
                  <div className="space-y-1">
                    {table.columns.map((col, cIdx) => (
                      <div key={cIdx} className="flex justify-between text-[11px] font-mono p-1.5 border-b border-gray-50 last:border-0 hover:bg-white rounded transition-colors">
                        <span className="font-bold text-gray-800 flex items-center gap-1">
                          {col.key && <span className="bg-[#D4AF37]/10 text-[#8c742c] text-[8px] font-bold px-1.5 py-0.2 rounded-md uppercase">{col.key}</span>}
                          {col.name}
                        </span>
                        <span className="text-gray-400 text-[10px] text-right truncate max-w-[120px]" title={col.desc}>{col.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'api' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-gray-900 text-base border-b border-gray-50 pb-3">Server-Side Express Endpoints Specifications</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our Express server hosts API routes. These endpoints utilize lazy-initialization and communicate with Google Gemini using secure environmental parameters:
            </p>

            <div className="space-y-4">
              {apiSpecs.map((spec, i) => (
                <div key={i} className="border border-[#D4AF37]/10 bg-[#FCF9F6] rounded-2xl p-6 hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full font-mono">
                        {spec.method}
                      </span>
                      <strong className="text-xs font-mono text-gray-800">{spec.endpoint}</strong>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {spec.desc}
                    </p>
                  </div>

                  <div className="bg-[#9CAF88]/15 border border-[#9CAF88]/15 text-[10px] text-[#546247] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider shrink-0 shadow-xs font-sans">
                    application/json
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

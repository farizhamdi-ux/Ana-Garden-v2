import React, { useState } from 'react';
import { Database, FileText, CheckCircle2, TrendingUp, Sparkles, Send, ShieldAlert, Plus, Trash2 } from 'lucide-react';
import { Supplier, PurchaseOrder } from '../types';
import { mockSuppliers, mockFlowers } from '../mockData';

export default function Procurement() {
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'po-1',
      poNumber: 'PO-2026-CH001',
      supplierId: 'sup-1',
      supplierName: 'Cameron Highlands Highlands Flora',
      items: [
        { flowerId: 'fl-1', flowerName: 'Cameron Red Rose', quantity: 300, pricePerStem: 3.5, subtotal: 1050.00 },
        { flowerId: 'fl-2', flowerName: 'Cameron Blush Rose', quantity: 200, pricePerStem: 3.8, subtotal: 760.00 }
      ],
      totalAmount: 1810.00,
      status: 'Shipped',
      createdAt: '2026-07-16T12:00:00Z',
      expectedDeliveryDate: '2026-07-19T08:00:00Z'
    },
    {
      id: 'po-2',
      poNumber: 'PO-2026-KD002',
      supplierId: 'sup-2',
      supplierName: 'Kinabalu Highland Orchids & Lilies',
      items: [
        { flowerId: 'fl-3', flowerName: 'Kundasang White Lily', quantity: 100, pricePerStem: 6.5, subtotal: 650.00 },
        { flowerId: 'fl-5', flowerName: 'Sabah Blue Hydrangea', quantity: 50, pricePerStem: 9.0, subtotal: 450.00 }
      ],
      totalAmount: 1100.00,
      status: 'Received',
      createdAt: '2026-07-15T10:00:00Z',
      expectedDeliveryDate: '2026-07-16T15:00:00Z'
    }
  ]);

  // PO Creator State
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('sup-1');
  const [poItems, setPoItems] = useState<{ flowerId: string; flowerName: string; quantity: number; pricePerStem: number }[]>([
    { flowerId: 'fl-1', flowerName: 'Cameron Red Rose', quantity: 150, pricePerStem: 3.5 }
  ]);

  const [poCreatedSuccess, setPoCreatedSuccess] = useState<boolean>(false);

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  // Helper to add item to PO form
  const addFlowerToPo = (flowerId: string) => {
    const flower = mockFlowers.find(f => f.id === flowerId);
    if (!flower) return;
    
    // Check if already in list
    if (poItems.some(item => item.flowerId === flowerId)) return;

    setPoItems([...poItems, {
      flowerId: flower.id,
      flowerName: flower.name,
      quantity: 100, // default moq-friendly
      pricePerStem: flower.basePricePerStem * 0.75 // wholesale price is 25% lower
    }]);
  };

  const removeFlowerFromPo = (flowerId: string) => {
    setPoItems(poItems.filter(item => item.flowerId !== flowerId));
  };

  const updatePoItemQty = (flowerId: string, qty: number) => {
    setPoItems(poItems.map(item => item.flowerId === flowerId ? { ...item, quantity: Math.max(1, qty) } : item));
  };

  const calculatePoTotal = () => {
    return poItems.reduce((sum, item) => sum + (item.quantity * item.pricePerStem), 0);
  };

  const handleGeneratePo = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculatePoTotal();

    if (total < selectedSupplier.moq) {
      alert(`Wholesale Total is RM${total.toFixed(2)}, which is below Supplier Minimum Order Quantity (MOQ) of RM${selectedSupplier.moq}. Please add more items.`);
      return;
    }

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${selectedSupplierId === 'sup-1' ? 'CH' : 'KD'}00${purchaseOrders.length + 1}`,
      supplierId: selectedSupplierId,
      supplierName: selectedSupplier.name,
      items: poItems.map(item => ({
        ...item,
        subtotal: item.quantity * item.pricePerStem
      })),
      totalAmount: total,
      status: 'Sent',
      createdAt: new Date().toISOString(),
      expectedDeliveryDate: new Date(Date.now() + selectedSupplier.leadTimeDays * 24 * 60 * 60 * 1000).toISOString()
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    setPoCreatedSuccess(true);
    setPoItems([{ flowerId: 'fl-1', flowerName: 'Cameron Red Rose', quantity: 150, pricePerStem: 3.5 }]);
    
    setTimeout(() => {
      setPoCreatedSuccess(false);
    }, 4000);
  };

  const getStatusBadgeColor = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'Sent': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Approved': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Shipped': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Received': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans" id="procurement-view">
      {/* Title */}
      <div className="mb-10 text-center sm:text-left">
        <span className="inline-block px-4 py-1.5 bg-[#9CAF88]/10 text-[#9CAF88] text-[10px] font-bold uppercase tracking-[0.25em] rounded-full mb-3">
          Sabah-Cameron B2B Logistics
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight flex items-center justify-center sm:justify-start gap-2">
          <Database className="w-7 h-7 text-gray-900" /> Supplier Procurement Portal
        </h2>
        <p className="text-xs text-gray-500 mt-1.5">Automatic wholesale catalog syncing, lead time prediction, and direct PO pipeline to Cameron Highlands growers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Supplier Database catalog (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-gray-900 text-sm pb-3 border-b border-gray-50 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#D4AF37]" /> Connected Gifting Suppliers
            </h3>
            
            <div className="space-y-4">
              {suppliers.map(sup => (
                <div key={sup.id} className="p-5 rounded-2xl bg-[#FCF9F6] border border-[#D4AF37]/10 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800 text-xs leading-none">{sup.name}</h4>
                    <span className="bg-[#9CAF88]/15 text-[#546247] text-[9px] font-bold px-2.5 py-1 rounded-full border border-[#9CAF88]/10 uppercase tracking-wider">
                      Lead Time: {sup.leadTimeDays}d
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400">Location: {sup.location}</p>
                  <p className="text-[10px] text-gray-500 italic leading-relaxed">"{sup.seasonalityNotes}"</p>
                  <div className="flex justify-between text-[10px] pt-2 text-gray-400 border-t border-dashed border-[#D4AF37]/10">
                    <span>Contact: {sup.contactPerson}</span>
                    <span>Min Order MOQ: <strong>RM {sup.moq}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Wholesale flower index */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-gray-900 text-sm pb-3 border-b border-gray-50">
              Select Raw Materials to order
            </h3>
            <p className="text-[10px] text-gray-400 leading-relaxed">Add fresh floral stems to your current PO builder below:</p>
            <div className="grid grid-cols-2 gap-2.5">
              {mockFlowers.map(flower => (
                <button
                  key={flower.id}
                  onClick={() => addFlowerToPo(flower.id)}
                  className="p-3 rounded-full border border-[#D4AF37]/10 bg-[#FCF9F6] hover:bg-white text-center hover:border-[#D4AF37] text-xs font-bold text-gray-700 truncate transition-all duration-300"
                >
                  + {flower.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Automated PO Creator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-gray-50 pb-4">
              <h3 className="font-serif font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#9CAF88]" /> Create Wholesaler Purchase Order (PO)
              </h3>
              <span className="text-[9px] bg-[#9CAF88]/10 text-[#546247] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Invoice Generator
              </span>
            </div>

            <form onSubmit={handleGeneratePo} className="space-y-5 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Target Wholesaler Supplier</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => {
                    setSelectedSupplierId(e.target.value);
                    // Reset items when supplier shifts
                    if (e.target.value === 'sup-1') {
                      setPoItems([{ flowerId: 'fl-1', flowerName: 'Cameron Red Rose', quantity: 150, pricePerStem: 3.5 }]);
                    } else {
                      setPoItems([{ flowerId: 'fl-3', flowerName: 'Kundasang White Lily', quantity: 80, pricePerStem: 6.5 }]);
                    }
                  }}
                  className="w-full bg-[#FCF9F6] border border-[#D4AF37]/15 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (MOQ: RM{s.moq})</option>
                  ))}
                </select>
              </div>

              {/* Items Table */}
              <div className="space-y-3">
                <p className="font-semibold text-gray-800">Floral stems inside order:</p>
                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider">
                        <th className="p-3 font-bold">Species</th>
                        <th className="p-3 font-bold">Wholesale Stem Price</th>
                        <th className="p-3 font-bold">Quantity (Stems)</th>
                        <th className="p-3 text-right font-bold">Sum (RM)</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {poItems.map((item, index) => (
                        <tr key={item.flowerId} className="border-b border-gray-50 last:border-0 text-xs text-gray-700 hover:bg-gray-50/40">
                          <td className="p-3 font-semibold">{item.flowerName}</td>
                          <td className="p-3 text-gray-400 font-mono">RM {item.pricePerStem.toFixed(2)}</td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updatePoItemQty(item.flowerId, Number(e.target.value))}
                              className="w-16 bg-[#FCF9F6] border border-gray-200 rounded p-1 text-center font-bold font-mono focus:outline-none"
                            />
                          </td>
                          <td className="p-3 text-right font-bold text-gray-900 font-mono">
                            RM {(item.quantity * item.pricePerStem).toFixed(2)}
                          </td>
                          <td className="p-3 text-center">
                            {poItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFlowerFromPo(item.flowerId)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary and MOQ check */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gradient-to-br from-[#FCF9F6] to-[#F5F2ED] border border-[#D4AF37]/20 rounded-2xl gap-3">
                <div className="space-y-0.5">
                  <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Wholesale Order Total</p>
                  <p className="text-2xl font-serif font-bold text-[#1A1A1A]">RM {calculatePoTotal().toFixed(2)}</p>
                </div>
                
                {calculatePoTotal() < selectedSupplier.moq ? (
                  <div className="bg-red-50 border border-red-100 text-red-700 px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5 shadow-sm">
                    <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
                    <span>Below MOQ target of RM {selectedSupplier.moq}</span>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-[#9CAF88]/20 text-emerald-700 px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#9CAF88]" />
                    <span>Meets Wholesaler MOQ</span>
                  </div>
                )}
              </div>

              {poCreatedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-center font-semibold">
                  ✓ Purchase Order successfully generated and transmitted to supplier's ERP!
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-[#D4AF37] text-white py-3.5 rounded-full font-bold uppercase tracking-widest transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm"
                id="transmit-po-btn"
              >
                <Send className="w-4 h-4 text-[#D4AF37]" /> Generate &amp; Transmit PO Invoice
              </button>
            </form>
          </div>

          {/* Active PO List */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-gray-900 text-sm pb-3 border-b border-gray-50">
              Active Procurement Shipments (Transit Log)
            </h3>
            
            <div className="space-y-3.5">
              {purchaseOrders.map((po) => (
                <div key={po.id} className="border border-[#D4AF37]/15 bg-[#FCF9F6] rounded-2xl p-5 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-800 tracking-tight">{po.poNumber}</h4>
                      <span className={`px-2.5 py-1 rounded-full text-[8px] font-bold border uppercase tracking-wider ${getStatusBadgeColor(po.status)}`}>
                        {po.status}
                      </span>
                    </div>
                    <p className="text-gray-400 font-medium">Supplier: {po.supplierName}</p>
                    <div className="flex gap-4 pt-1 text-[10px] text-gray-500 font-sans">
                      <span>Total Value: <strong className="text-gray-800 font-mono">RM {po.totalAmount.toFixed(2)}</strong></span>
                      <span>ETA: <strong className="text-gray-800">{new Date(po.expectedDeliveryDate).toLocaleDateString('en-MY')}</strong></span>
                    </div>
                  </div>

                  {po.status !== 'Received' && (
                    <button
                      onClick={() => {
                        setPurchaseOrders(purchaseOrders.map(p => p.id === po.id ? { ...p, status: 'Received' } : p));
                        alert('Flowers successfully checked into stock. Expiration counters and FIFO shelf location activated.');
                      }}
                      className="bg-white hover:bg-[#D4AF37] hover:text-white border border-[#D4AF37]/20 text-[#1A1A1A] font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-full self-center transition-all duration-300 shadow-sm shrink-0"
                    >
                      Audit Receive
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

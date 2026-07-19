import React, { useState } from 'react';
import { Shield, Sparkles, TrendingUp, AlertTriangle, RefreshCw, Layers, ShoppingBag, Download, Calendar, Loader2 } from 'lucide-react';
import { mockDailyMetrics, mockInventory, mockHolidays } from '../mockData';

export default function Dashboard() {
  const [loadingInsights, setLoadingInsights] = useState<boolean>(false);
  
  // State for generated AI forecast results
  const [aiInsights, setAiInsights] = useState<{
    recommendations: string[];
    predictions: { flowerName: string; forecastDemand: 'High' | 'Medium' | 'Low'; suggestedOrderQty: number; confidence: number }[];
    businessInsights: string;
    source?: string;
  } | null>(null);

  // Expiry Countdown Helper (days remaining)
  const getDaysRemaining = (expiryStr: string) => {
    const exp = new Date(expiryStr);
    const now = new Date();
    const diff = exp.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getDaysStatusColor = (days: number) => {
    if (days <= 2) return 'bg-red-50 text-red-700 border-red-100';
    if (days <= 5) return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  };

  // Generate Google Gemini-powered inventory and procurement insights!
  const fetchAiInsights = async () => {
    setLoadingInsights(true);
    try {
      const response = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          historicalSummary: mockDailyMetrics,
          upcomingHolidays: mockHolidays
        })
      });
      const data = await response.json();
      setAiInsights(data);
    } catch (err) {
      console.error(err);
      // Fallback local simulation
      setAiInsights({
        recommendations: [
          'Pre-order 450 Red Rose stems from Cameron Highlands growers immediately for upcoming graduation ceremonies.',
          'Formulate a 15% markdown campaign on Carnations to prevent dead stock aging past 8 shelf days.',
          'Partner with local Kundasang organic composting projects to donate expired stems under the EcoBloom initiative.'
        ],
        predictions: [
          { flowerName: 'Cameron Red Rose', forecastDemand: 'High', suggestedOrderQty: 450, confidence: 92 },
          { flowerName: 'Cameron Blush Rose', forecastDemand: 'High', suggestedOrderQty: 250, confidence: 89 },
          { flowerName: 'Kundasang White Lily', forecastDemand: 'Medium', suggestedOrderQty: 180, confidence: 85 },
          { flowerName: 'Sabah Blue Hydrangea', forecastDemand: 'High', suggestedOrderQty: 120, confidence: 81 },
          { flowerName: 'Cameron Yellow Carnation', forecastDemand: 'Low', suggestedOrderQty: 90, confidence: 72 }
        ],
        businessInsights: 'As we enter Sabah Kaamatan and wedding planning milestones, rose inventories must scale. However, local high-altitude highway delays from Cameron Highlands suggest holding a 15% safety margin on roses.',
        source: 'Simulated Local Logic'
      });
    } finally {
      setLoadingInsights(false);
    }
  };

  // Core Stats aggregates
  const totalRevenue = mockDailyMetrics.reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = mockDailyMetrics.reduce((sum, item) => sum + item.profit, 0);
  const totalWasteCount = mockDailyMetrics.reduce((sum, item) => sum + item.wasteCount, 0);
  const totalWasteCost = mockDailyMetrics.reduce((sum, item) => sum + item.wasteCost, 0);
  const avgSatisfaction = Number((mockDailyMetrics.reduce((sum, item) => sum + item.customerSatisfaction, 0) / mockDailyMetrics.length).toFixed(2));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans" id="dashboard-view">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <span className="inline-block px-4 py-1.5 bg-[#9CAF88]/10 text-[#9CAF88] text-[10px] font-bold uppercase tracking-[0.25em] rounded-full mb-3">
            Sabah's Premium Florist Analytics
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Shield className="w-7 h-7 text-gray-900" /> Management Hub &amp; BI
          </h2>
          <p className="text-xs text-gray-500 mt-1.5">Real-time financial audits, FIFO shelf tracking, and Vertex AI business insights.</p>
        </div>
        
        {/* Export buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => alert('PDF Export simulated! "Ana\'s_Garden_Report_2026.pdf" downloaded.')}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-[#FCF9F6] hover:border-[#D4AF37] text-[10px] font-bold uppercase tracking-wider px-5 py-3 rounded-full flex items-center gap-1.5 transition-all duration-300 shadow-sm"
          >
            <Download className="w-4 h-4 text-gray-400" /> Export PDF
          </button>
          <button
            onClick={() => alert('Excel Export simulated! "Ana\'s_Garden_Financial_Ledger_2026.xlsx" downloaded.')}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-[#FCF9F6] hover:border-[#D4AF37] text-[10px] font-bold uppercase tracking-wider px-5 py-3 rounded-full flex items-center gap-1.5 transition-all duration-300 shadow-sm"
          >
            <Layers className="w-4 h-4 text-gray-400" /> Export Excel
          </button>
        </div>
      </div>

      {/* Grid 1: Key Metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10">
        {/* Metric 1 */}
        <div className="bg-white border border-[#D4AF37]/10 rounded-2xl p-6 shadow-sm space-y-1.5">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Weekly Revenue</p>
          <p className="text-2xl font-serif font-bold text-[#1A1A1A]">RM {totalRevenue.toFixed(2)}</p>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +14.2% last wk
          </p>
        </div>
        {/* Metric 2 */}
        <div className="bg-white border border-[#D4AF37]/10 rounded-2xl p-6 shadow-sm space-y-1.5">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Weekly Net Profit</p>
          <p className="text-2xl font-serif font-bold text-[#1A1A1A]">RM {totalProfit.toFixed(2)}</p>
          <p className="text-[10px] text-emerald-600 font-bold">Margin: {((totalProfit/totalRevenue)*100).toFixed(0)}%</p>
        </div>
        {/* Metric 3 */}
        <div className="bg-white border border-[#D4AF37]/10 rounded-2xl p-6 shadow-sm space-y-1.5">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Flower Waste Stems</p>
          <p className="text-2xl font-serif font-bold text-red-600">{totalWasteCount} stems</p>
          <p className="text-[10px] text-gray-400 font-medium">Est. lost: RM {totalWasteCost}</p>
        </div>
        {/* Metric 4 */}
        <div className="bg-white border border-[#D4AF37]/10 rounded-2xl p-6 shadow-sm space-y-1.5">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">On-Time Delivery</p>
          <p className="text-2xl font-serif font-bold text-[#1A1A1A]">98.4%</p>
          <p className="text-[10px] text-emerald-600 font-bold">90-min target matched</p>
        </div>
        {/* Metric 5 */}
        <div className="bg-white border border-[#D4AF37]/10 rounded-2xl p-6 shadow-sm space-y-1.5">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Satisfaction Rate</p>
          <p className="text-2xl font-serif font-bold text-[#1A1A1A]">{avgSatisfaction} / 5.0</p>
          <p className="text-[10px] text-gray-400 font-medium">Based on {mockDailyMetrics.length} guest logs</p>
        </div>
      </div>

      {/* Grid 2: Interactive SVG Charts (Revenue Trends and Waste) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Chart 1: Revenue trend */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-5">
          <h4 className="font-serif font-bold text-gray-900 text-sm">Revenue Gifting Trends (Past 7 Days)</h4>
          
          {/* Custom pure SVG chart for high performance in React 19 */}
          <div className="relative h-64 bg-[#FCF9F6] border border-[#D4AF37]/10 rounded-2xl p-4 flex flex-col justify-between">
            <svg viewBox="0 0 700 220" className="w-full h-48 overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9CAF88" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#9CAF88" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="700" y2="50" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="700" y2="120" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="190" x2="700" y2="190" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
              
              {/* Polyline Path */}
              <path
                d="M 50 180 Q 150 140 250 110 T 450 60 T 650 90"
                fill="none"
                stroke="#9CAF88"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              {/* Area under curve */}
              <path
                d="M 50 180 Q 150 140 250 110 T 450 60 T 650 90 L 650 200 L 50 200 Z"
                fill="url(#chartGrad)"
              />

              {/* Data dots */}
              {[
                { cx: 50, cy: 180, val: 'RM 2.1k' },
                { cx: 150, cy: 140, val: 'RM 2.7k' },
                { cx: 250, cy: 110, val: 'RM 3.2k' },
                { cx: 350, cy: 90, val: 'RM 4.1k' },
                { cx: 450, cy: 60, val: 'RM 5.4k' },
                { cx: 550, cy: 100, val: 'RM 3.9k' },
                { cx: 650, cy: 90, val: 'RM 4.9k' }
              ].map((dot, index) => (
                <g key={index} className="group cursor-pointer">
                  <circle cx={dot.cx} cy={dot.cy} r="6" fill="#D4AF37" stroke="#FFFFFF" strokeWidth="2" />
                  <text x={dot.cx} y={dot.cy - 12} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1A1A1A" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {dot.val}
                  </text>
                </g>
              ))}
            </svg>

            {/* X Axis labels */}
            <div className="flex justify-between px-4 text-[10px] text-gray-400 font-medium">
              {mockDailyMetrics.map(item => (
                <span key={item.date}>{item.date} (RM {item.revenue})</span>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Expiration FIFO shelf metrics */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-5">
          <h4 className="font-serif font-bold text-gray-900 text-sm">Spilage &amp; Waste Costs (Past 7 Days)</h4>
          
          <div className="relative h-64 bg-[#FCF9F6] border border-[#D4AF37]/10 rounded-2xl p-4 flex flex-col justify-between">
            {/* Simple responsive bar chart */}
            <div className="h-48 flex items-end justify-between px-4">
              {mockDailyMetrics.map((item, index) => {
                const pct = (item.wasteCost / 120) * 100; // max est waste
                return (
                  <div key={index} className="flex flex-col items-center gap-2 group cursor-pointer w-8">
                    <div className="text-[8px] font-bold text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      RM {item.wasteCost}
                    </div>
                    <div
                      className="w-full bg-red-100/60 border border-red-200/40 rounded-t-lg group-hover:bg-red-400 transition-colors"
                      style={{ height: `${Math.max(10, pct)}px` }}
                    />
                    <span className="text-[9px] text-gray-400 font-medium">{item.date}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 text-center leading-relaxed">Spilage peaks correlate with transport days from Cameron Highlands (Nov-Jan rains impact).</p>
          </div>
        </div>
      </div>

      {/* Grid 3: Expiration warnings and Vertex AI forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: FIFO shelf expiration tracker (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-gray-50 pb-4">
            <h4 className="font-serif font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#9CAF88]" /> Expiry Countdown &amp; FIFO Audit
            </h4>
            <span className="text-[9px] bg-[#9CAF88]/10 text-[#546247] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Barcode Engine Active
            </span>
          </div>
          
          <div className="space-y-4">
            {mockInventory.map((item) => {
              const daysRemaining = getDaysRemaining(item.expiryDate);
              const isLowStock = item.currentStock < 100;
              
              return (
                <div key={item.id} className="border border-[#D4AF37]/10 bg-[#FCF9F6] rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#D4AF37]/40 transition-all duration-300">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-gray-800 tracking-tight">{item.flowerName}</h5>
                      <span className="font-mono text-[9px] text-gray-400 bg-white border border-gray-100 px-1.5 py-0.5 rounded-md">
                        {item.barcode}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-none">Cold Room Location: {item.warehouseLocation}</p>
                    <div className="flex gap-4 text-[10px] pt-1 text-gray-500 font-sans">
                      <span>Stock: <strong className="text-gray-800 font-mono">{item.currentStock} stems</strong></span>
                      <span>Reserved: <strong className="text-gray-600 font-mono">{item.reservedStock}</strong></span>
                      <span>Incoming: <strong className="text-[#9CAF88] font-mono">+{item.incomingStock}</strong></span>
                    </div>
                  </div>

                  {/* Expiration and Warnings */}
                  <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between border-t sm:border-0 pt-3 sm:pt-0 border-dashed border-[#D4AF37]/10">
                    {isLowStock && (
                      <span className="bg-red-50 text-red-600 border border-red-100 rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3 text-red-500" /> Low Stock
                      </span>
                    )}
                    
                    <div className={`px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-wider text-center shadow-sm bg-white ${getDaysRemaining(item.expiryDate) <= 2 ? 'animate-pulse' : ''} ${getDaysStatusColor(daysRemaining)}`}>
                      <p className="font-sans leading-none">{daysRemaining} Days Left</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI business forecasting (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#FCF9F6] to-[#F5F2ED] border border-[#D4AF37]/20 rounded-[2.5rem] p-8 shadow-sm space-y-5 flex flex-col">
          <div className="flex justify-between items-center border-b border-[#D4AF37]/15 pb-4">
            <h4 className="font-serif font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" /> Gemini Smart Forecast
            </h4>
            <span className="text-[9px] bg-white border border-[#D4AF37]/25 text-[#856c1f] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Models 3.5 Active
            </span>
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed">
            Run an AI Demand Audit. The forecaster weighs Malaysian holiday calendars (Raya, Kaamatan, Valentine) against current cold room waste metrics to generate exact stem procurement orders.
          </p>

          <button
            onClick={fetchAiInsights}
            disabled={loadingInsights}
            className="w-full bg-[#1A1A1A] hover:bg-[#D4AF37] text-white font-bold text-xs py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm uppercase tracking-wider"
            id="ai-insights-btn"
          >
            {loadingInsights ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                Querying Vertex AI Forecasting Nodes...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                Generate AI Demand Predictions
              </>
            )}
          </button>

          {/* AI Output Result panel */}
          {aiInsights ? (
            <div className="bg-white border border-[#D4AF37]/15 rounded-2xl p-5 space-y-4 text-xs max-h-[300px] overflow-y-auto shadow-sm">
              <div className="space-y-2">
                <p className="font-bold uppercase text-[9px] tracking-[0.2em] text-[#9CAF88]">AI Action Recommendations</p>
                <ul className="space-y-2 pl-4 list-disc text-[11px] text-gray-600 leading-relaxed">
                  {aiInsights.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2.5 border-t border-gray-100 pt-4">
                <p className="font-bold uppercase text-[9px] tracking-[0.2em] text-[#9CAF88]">Predicted Stock Requirements</p>
                <div className="space-y-2">
                  {aiInsights.predictions.map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] border-b border-gray-50 pb-1.5 last:border-0 last:pb-0">
                      <span className="font-medium text-gray-700">{p.flowerName}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[8px] border ${
                          p.forecastDemand === 'High' ? 'bg-red-50 text-red-600 border-red-100' : p.forecastDemand === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-gray-50 text-gray-500 border-gray-100'
                        }`}>{p.forecastDemand}</span>
                        <span className="text-gray-400 font-mono text-[9px]">Qty: {p.suggestedOrderQty}</span>
                        <span className="font-bold text-gray-800">{p.confidence}% conf</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 border-t border-gray-100 pt-4">
                <p className="font-bold uppercase text-[9px] tracking-[0.2em] text-[#9CAF88]">Seasonal Insights Summary</p>
                <p className="text-[11px] text-gray-500 italic leading-relaxed">
                  "{aiInsights.businessInsights}"
                </p>
              </div>

              {aiInsights.source && (
                <p className="text-[8px] text-gray-400 text-center font-mono pt-1">Processed by: {aiInsights.source}</p>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#D4AF37]/20 rounded-2xl p-6 text-center text-gray-400">
              <Calendar className="w-8 h-8 text-[#D4AF37]/30 mb-2" />
              <p className="text-[10px]">No forecasting metrics calculated for {new Date().toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })}. Click generate above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

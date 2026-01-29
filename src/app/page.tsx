"use client";

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import regularData from '../data/dashboard_data.json';
import franchiseData from '../data/franchise_data.json';

// --- TYPE DEFINITION ---
type StoreData = {
  id: string;
  name: string;
  daily_sales: number;
  growth?: number;
  manager: string;
  category?: string;
  // Field Detail
  apc?: number;
  mtd_sales?: number;
  stock?: number;
  // Field Peta
  lat?: number;
  lng?: number;
};

// --- ICONS ---
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// --- DYNAMIC COMPONENTS (NO SSR) ---
const SalesChart = dynamic(() => import('../components/SalesChart'), { 
  ssr: false, 
  loading: () => <div className="h-[300px] w-full bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Loading Chart...</div>
});

const StoreMap = dynamic(() => import('../components/StoreMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Memuat Peta Sebaran...</div>
});

// --- MAIN PAGE ---
export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'REGULAR' | 'FRANCHISE'>('REGULAR');
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);

  // Switch Data Source
  const currentData = activeTab === 'REGULAR' ? regularData : franchiseData;

  // Search Logic
  const filteredData = useMemo(() => {
    if (!currentData) return [];
    return (currentData as StoreData[]).filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.manager && item.manager.toLowerCase().includes(query))
      );
    });
  }, [searchQuery, currentData]);

  // Metrics Logic
  const totalSales = filteredData.reduce((acc, curr) => acc + (curr.daily_sales || 0), 0);
  const leaderboard = [...filteredData]
    .sort((a, b) => (b.daily_sales || 0) - (a.daily_sales || 0))
    .slice(0, 10);

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Alfamidi <span className="text-blue-600">AI</span> 🚀</h1>
            <p className="text-gray-500 text-sm mt-1">Integrated Intelligent Monitoring System</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow shadow-sm group-hover:shadow"
              placeholder="Cari Toko atau Manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl mb-8 w-fit shadow-inner">
          <button onClick={() => setActiveTab('REGULAR')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'REGULAR' ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}>
            🏢 Regular Stores
          </button>
          <button onClick={() => setActiveTab('FRANCHISE')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'FRANCHISE' ? 'bg-white text-purple-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}>
            🤝 Franchise
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Sales ({activeTab})</h3>
            <p className={`text-3xl font-bold mt-2 ${activeTab === 'REGULAR' ? 'text-blue-600' : 'text-purple-600'}`}>
              Rp {totalSales.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Outlet</h3>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-bold text-gray-800">{filteredData.length}</p>
              <span className="text-sm text-gray-400">Unit</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Top Performer</h3>
            <p className="text-xl font-bold text-green-600 mt-2 truncate">{leaderboard[0]?.name || "-"}</p>
            <p className="text-xs text-gray-400">Rp {leaderboard[0]?.daily_sales?.toLocaleString('id-ID') || 0}</p>
          </div>
        </div>

        {/* GRID LAYOUT: CHART & MAP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* CHART */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1">
             {filteredData.length > 0 ? <SalesChart data={filteredData} /> : <div className="h-full flex items-center justify-center text-gray-400">No Data</div>}
          </div>

          {/* MAP (Only for Regular) */}
          {activeTab === 'REGULAR' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4 px-2">
                 <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                   📍 Peta Sebaran
                 </h2>
                 <span className="text-[10px] px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100">Geospatial AI</span>
              </div>
              {filteredData.length > 0 ? <StoreMap data={filteredData} /> : <div className="h-[300px] flex items-center justify-center text-gray-400">No Data for Map</div>}
            </div>
          )}
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
             <h2 className="text-lg font-bold text-gray-800">🏆 Leaderboard: {activeTab}</h2>
             <p className="text-xs text-gray-400 mt-1">*Klik baris untuk melihat detail performa & stok</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="p-4 w-16 text-center">#</th>
                  <th className="p-4">Nama Toko</th>
                  <th className="p-4">Manager</th>
                  <th className="p-4 text-right">Sales Harian</th>
                  {activeTab === 'REGULAR' && <th className="p-4 text-center">AI Category</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaderboard.map((store, index) => (
                  <tr 
                    key={index} 
                    onClick={() => setSelectedStore(store)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="p-4 text-center font-bold text-gray-400 group-hover:text-blue-500">{index + 1}</td>
                    <td className="p-4 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{store.name}</td>
                    <td className="p-4">{store.manager}</td>
                    <td className="p-4 text-right font-mono font-bold text-blue-600">
                      Rp {store.daily_sales ? store.daily_sales.toLocaleString('id-ID') : 0}
                    </td>
                    {activeTab === 'REGULAR' && (
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-medium border ${
                          store.category?.includes('Sultan') ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          store.category?.includes('Standar') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-orange-50 text-orange-700 border-orange-200'
                        }`}>
                          {store.category || '-'}
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* === MODAL DETAIL TOKO (POPUP) === */}
        {selectedStore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Overlay click to close */}
            <div className="absolute inset-0" onClick={() => setSelectedStore(null)}></div>
            
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{selectedStore.name}</h2>
                  <p className="opacity-90 text-sm mt-1 font-mono">ID: {selectedStore.id} | AM: {selectedStore.manager}</p>
                </div>
                <button 
                  onClick={() => setSelectedStore(null)}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* AI Badge */}
                {selectedStore.category && (
                   <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                      <div className="text-4xl shadow-sm bg-white rounded-full p-2">
                        {selectedStore.category.includes('Sultan') ? '👑' : selectedStore.category.includes('Standar') ? '⭐' : '⚠️'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">AI Performance Analysis</h4>
                        <p className="text-gray-500 text-sm">
                          Cluster: <span className="font-semibold text-blue-600">{selectedStore.category}</span>
                        </p>
                      </div>
                   </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Sales Hari Ini</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      Rp {selectedStore.daily_sales?.toLocaleString('id-ID')}
                    </p>
                  </div>
                  
                  <div className="p-4 border border-blue-100 bg-blue-50/30 rounded-xl hover:border-blue-300 transition-colors">
                    <p className="text-xs text-blue-600 uppercase font-semibold">Sales Bulan Ini (MTD)</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">
                      {selectedStore.mtd_sales ? `Rp ${selectedStore.mtd_sales.toLocaleString('id-ID')}` : 'N/A'}
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Basket Size (APC)</p>
                    <p className="text-xl font-semibold text-gray-800 mt-1">
                      {selectedStore.apc ? `Rp ${selectedStore.apc.toLocaleString('id-ID')}` : '-'}
                    </p>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Stock Value</p>
                    <p className="text-xl font-semibold text-gray-800 mt-1">
                      {selectedStore.stock ? `Rp ${selectedStore.stock.toLocaleString('id-ID')}` : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                 <button 
                  onClick={() => setSelectedStore(null)}
                  className="text-gray-500 hover:text-gray-800 font-medium text-sm transition-colors"
                 >
                   Tutup Detail
                 </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
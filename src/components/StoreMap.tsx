"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// --- 1. SETUP ICON WARNA-WARNI ---
// Kita buat fungsi helper biar codingan rapi
const createIcon = (color: string) => {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Definisi Icon berdasarkan Kategori AI
const iconSultan = createIcon('violet'); // Ungu untuk Sultan (Elite)
const iconStandar = createIcon('blue');  // Biru untuk Standar (Aman)
const iconWarning = createIcon('red');   // Merah untuk Perlu Perhatian (Bahaya)
const iconFranchise = createIcon('gold'); // Emas (kalau nanti mau dipakai)

type MapProps = {
  data: any[];
};

export default function StoreMap({ data }: MapProps) {
  
  // Fix bug icon Leaflet di Next.js (Wajib ada)
  useEffect(() => {
    // Kita hapus default getter agar tidak bentrok dengan custom icon kita
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    });
  }, []);

  // Pusat Peta (Medan)
  const center: [number, number] = [3.5952, 98.6722];

  // Helper untuk memilih icon berdasarkan data toko
  const getIconForStore = (category?: string) => {
    if (!category) return iconStandar;
    if (category.includes('Sultan')) return iconSultan;
    if (category.includes('Perlu')) return iconWarning;
    return iconStandar;
  };

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 relative z-0">
      <MapContainer center={center} zoom={11} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {data.map((store, idx) => (
          // Render Marker hanya jika ada koordinat
          store.lat && store.lng ? (
            <Marker 
              key={idx} 
              position={[store.lat, store.lng]} 
              icon={getIconForStore(store.category)} // <--- Logika warna di sini
            >
              <Popup>
                <div className="p-1 min-w-[150px]">
                  <h3 className="font-bold text-gray-800 text-sm">{store.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{store.manager}</p>
                  
                  <div className="text-sm font-semibold text-blue-600 border-t pt-1 mt-1">
                    Rp {store.daily_sales?.toLocaleString('id-ID')}
                  </div>
                  
                  {/* Badge Label di Popup */}
                  {store.category && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border mt-2 inline-block font-medium ${
                        store.category.includes('Sultan') ? 'bg-purple-100 border-purple-200 text-purple-700' :
                        store.category.includes('Standar') ? 'bg-blue-50 border-blue-200 text-blue-700' :
                        'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      {store.category}
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}

        {/* Legenda Peta (Pojok Kanan Atas) */}
        <div className="leaflet-top leaflet-right">
          <div className="leaflet-control leaflet-bar bg-white p-3 rounded shadow-md m-4 border border-gray-200">
             <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-2">Legenda</h4>
             <div className="flex items-center gap-2 mb-1">
               <span className="w-3 h-3 rounded-full bg-[#9c27b0]"></span>
               <span className="text-xs text-gray-600">Sultan</span>
             </div>
             <div className="flex items-center gap-2 mb-1">
               <span className="w-3 h-3 rounded-full bg-[#2979ff]"></span>
               <span className="text-xs text-gray-600">Standar</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-[#ff0000]"></span>
               <span className="text-xs text-gray-600">Warning</span>
             </div>
          </div>
        </div>

      </MapContainer>
    </div>
  );
}
"use client"
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from "@/services/supabase";

// --- PARTE EXACTA 0: EL FIX PARA LOS ICONOS (Importar y definir imágenes por defecto) ---
// Leaflet y Next.js tienen este problema común. Borramos la ruta predeterminada y apuntamos a un CDN estable.
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

// --- PARTE EXACTA A: CREAR TU PROPIO ICONO JUKUMARI ---
// Esto creará un marcador circular verde neubrutalista con tu oso Jukumari dentro.
// Se usa en lugar del marcador azul genérico para tus centros de acopio.
const jukumariIcon = typeof window !== 'undefined' ? L.divIcon({
  className: 'custom-jukumari-icon', // Puedes añadir más estilos CSS en globals.css
  html: `
    <div style="
      background-color: #D9ED92; 
      width: 32px; 
      height: 32px; 
      border-radius: 50%; 
      border: 3px solid #2D4635; 
      box-shadow: 4px 4px 0px rgba(45,70,53,1); 
      display: flex; 
      align-items: center; 
      justify-content: center;
      transition: transform 0.2s;
    ">
      <img src="/jukumari-avatar.png" alt="Jukum" style="width: 22px; height: 22px;">
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32], // Ancla la punta inferior del círculo
  popupAnchor: [0, -32] // Dónde aparece el popup relativo al icono
}) : undefined;

// Componente para centrar el mapa cuando seleccionas un centro
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

export default function MapWrapper() {
  const [centros, setCentros] = useState<any[]>([]);
  const [selectedCentro, setSelectedCentro] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    setMounted(true);
    async function fetchCentros() {
      const { data } = await supabase.from('centros_acopio').select('*');
      if (data) setCentros(data.filter(c => c.latitud && c.longitud));
    }
    fetchCentros();
  }, []);

  // Efecto para obtener tu ubicación real
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error("Error obteniendo ubicación:", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative h-screen w-full bg-[#FDFBF7]">
      <MapContainer
        center={[-16.5038, -68.1284]} // Centro inicial en La Paz
        zoom={14}
        style={{ height: '100%', width: '100%', borderRadius: '32px' }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Marcador de tu ubicación (El punto azul) */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="background-color: #3B82F6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            })}
          />
        )}

        {centros.map((centro) => (
          <Marker
            key={centro.id}
            position={[Number(centro.latitud), Number(centro.longitud)]}
            // --- PARTE EXACTA B: USAR EL ICONO JUKUMARI ---
            // Simplemente añade `icon={jukumariIcon}`
            icon={jukumariIcon}
            eventHandlers={{
              click: () => setSelectedCentro(centro),
            }}
          />
        ))}

        {selectedCentro && (
          <ChangeView center={[selectedCentro.latitud, selectedCentro.longitud]} />
        )}
      </MapContainer>

      {/* --- FICHA FLOTANTE NEUBRUTALISTA (Adaptada mobile-first centrada) --- */}
      {selectedCentro && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-[1000] bg-white border-4 border-[#2D4635] rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(45,70,53,1)] animate-in slide-in-from-bottom">
          <button
            onClick={() => setSelectedCentro(null)}
            className="absolute top-4 right-4 text-[#2D4635] font-bold"
          >✕</button>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-[#D9ED92] rounded-2xl flex items-center justify-center border-2 border-[#2D4635]">
              <img src="/jukumari-avatar.png" alt="Jukum" className="w-12" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#2D4635] uppercase">{selectedCentro.nombre}</h3>
              <p className="text-sm text-gray-600 italic">"{selectedCentro.horarios}"</p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <p className="font-bold text-[#2D4635] text-sm mb-1">Precios por kg:</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(selectedCentro.precios_por_material || {}).map(([mat, precio]) => (
                <div key={mat} className="bg-[#FDFBF7] border-2 border-[#2D4635] p-2 rounded-xl text-xs font-bold">
                  {mat}: <span className="text-green-700">{precio as string}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full bg-[#2D4635] text-[#D9ED92] font-black py-3 rounded-2xl border-b-4 border-black active:translate-y-1 active:border-b-0 transition-all">
            COORDINAR ENTREGA
          </button>
        </div>
      )}
    </div>
  );
}
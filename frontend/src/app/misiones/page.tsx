"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from "@/services/supabase";
import { MapPin, Target, Award, Clock, CheckCircle } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

// Haversine formula to calculate distance between two lat/lng points in km
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; 
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Mock mission corresponding to user request
const WEEKLY_MISSION = {
  id: 1,
  title: "Visita el Centro Jukumari y recicla 2kg de PET",
  rewardPts: 50,
  targetLat: -16.5000, // Coordenadas del target (Centro Jukumari)
  targetLng: -68.1200,
  radiusKm: 2.0 // Flexibilizado a 2km para facilitar pruebas
};

export default function MisionesPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(true);
  
  const [validating, setValidating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);

  useEffect(() => {
    // Obtener Perfil del usuario autenticado
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('perfiles').select('id').eq('user_id', user.id).single();
        if (data) setProfileId(data.id);
      }
    }
    fetchProfile();

    // Obtener Geolocalización
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation({ lat, lng });
          
          const dist = getDistanceFromLatLonInKm(lat, lng, WEEKLY_MISSION.targetLat, WEEKLY_MISSION.targetLng);
          setDistance(dist);
          setLoadingLoc(false);
        },
        (err) => {
          console.error("No se pudo obtener la ubicación", err);
          setLoadingLoc(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLoadingLoc(false);
    }
  }, []);

  const isNearby = distance !== null && distance <= WEEKLY_MISSION.radiusKm;

  const handleValidate = async () => {
    if (!profileId) {
      alert("No se pudo identificar tu perfil. Inicia sesión nuevamente.");
      return;
    }
    
    setValidating(true);
    try {
      // Obtener puntos actuales
      const { data: profile } = await supabase.from('perfiles').select('puntos_totales').eq('id', profileId).single();
      const currentPoints = profile?.puntos_totales || 0;
      
      // Sumar recompensa
      const { error } = await supabase.from('perfiles').update({ puntos_totales: currentPoints + WEEKLY_MISSION.rewardPts }).eq('id', profileId);
      
      if (error) throw error;
      
      setSuccess(true);
      // Opcional: Registrar misión completada en otra tabla 'misiones_completadas'
    } catch (error) {
      console.error("Error al validar misión:", error);
      alert("Hubo un error al validar tu visita. Inténtalo más tarde.");
    } finally {
      setValidating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] p-6 max-w-md mx-auto relative overflow-hidden">
      
      {/* Círculo decorativo */}
      <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-[#D9ED92] rounded-full border-[4px] border-[#2D4635] z-0 opacity-50"></div>

      <header className="mb-8 mt-6 relative z-10">
        <h1 className="text-4xl font-black text-[#2D4635] mb-2 uppercase tracking-tight">EcoMisiones</h1>
        <p className="text-[#2D4635] font-bold opacity-80 border-b-[3px] border-[#2D4635]/20 pb-4 inline-block">Misiones semanales</p>
      </header>

      <div className="relative z-10 space-y-6">
        {/* Mission Card Neubrutalist */}
        <div className={`rounded-[32px] p-6 border-[4px] border-[#2D4635] bg-white transition-all duration-500 ${success ? 'shadow-[0px_0px_0px_0px_#2D4635] translate-y-2 bg-[#D9ED92]/20' : 'shadow-[10px_10px_0px_0px_#2D4635]'}`}>
          
          <div className="flex justify-between items-start mb-4">
             <div className="bg-[#D9ED92] border-[3px] border-[#2D4635] px-3 py-1 rounded-full text-xs font-black text-[#2D4635] uppercase tracking-wider flex items-center gap-1 shadow-[2px_2px_0px_0px_#2D4635]">
               <Clock size={14} strokeWidth={3} /> Semana 1
             </div>
             <div className="flex flex-col items-center justify-center bg-[#2D4635] w-14 h-14 rounded-full border-[3px] border-[#FDFBF7] shadow-[2px_2px_0px_0px_#2D4635]">
               <Award size={18} color="#D9ED92" strokeWidth={3} />
               <span className="text-[#D9ED92] font-black text-xs leading-none">+{WEEKLY_MISSION.rewardPts}</span>
             </div>
          </div>

          <h2 className="text-2xl font-black text-[#2D4635] leading-tight mb-4">
            {WEEKLY_MISSION.title}
          </h2>

          <div className="bg-[#FDFBF7] border-[3px] border-[#2D4635] rounded-[20px] p-4 mb-6 relative overflow-hidden">
            {/* Animación Jukumari */}
            <div className="absolute -right-2 -bottom-2 text-4xl opacity-20 transform -rotate-12">🐻</div>
            
            <p className="text-sm font-bold text-[#2D4635] mb-2 flex items-center gap-2">
              <Target size={18} strokeWidth={3} /> Ubicación de la misión
            </p>
            
            {loadingLoc ? (
               <p className="text-xs font-bold font-mono text-[#2D4635]/60 animate-pulse">Obteniendo tu GPS...</p>
            ) : userLocation ? (
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#0088FF] animate-ping relative">
                    <div className="absolute inset-0 rounded-full bg-[#0088FF] border border-white"></div>
                 </div>
                 <p className="text-xs font-bold font-mono text-[#2D4635]">
                   A {distance ? distance.toFixed(2) : '0'} km de ti
                 </p>
               </div>
            ) : (
               <p className="text-xs font-bold text-red-500">Error de GPS. Activa tu ubicación.</p>
            )}
          </div>

          <div className="relative">
             {!success ? (
               <button 
                 onClick={handleValidate} 
                 disabled={!isNearby || validating}
                 className={`w-full py-4 px-6 text-lg font-black uppercase tracking-wide border-[4px] rounded-[32px] transition-all flex items-center justify-center gap-2 ${
                   isNearby 
                     ? 'bg-[#D9ED92] border-[#2D4635] text-[#2D4635] shadow-[6px_6px_0px_0px_#2D4635] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#2D4635] active:translate-y-2 active:translate-x-2 active:shadow-none' 
                     : 'bg-gray-200 border-gray-400 text-gray-500 shadow-none cursor-not-allowed'
                 }`}
               >
                 {validating ? 'Verificando...' : isNearby ? 'Validar Visita' : 'Acércate al centro'}
               </button>
             ) : (
               <div className="w-full py-4 text-lg font-black uppercase text-[#2D4635] flex items-center justify-center gap-2">
                 <CheckCircle size={28} strokeWidth={3} className="text-[#2D4635]" /> ¡Misión Cumplida!
               </div>
             )}
          </div>
          
        </div>

        {/* Misión completada bloqueada o próxima */}
        <div className="rounded-[32px] p-6 border-[4px] border-[#2D4635]/20 bg-[#FDFBF7] opacity-60 grayscale filter flex items-center justify-between">
           <div>
             <div className="text-xs font-black text-[#2D4635] uppercase mb-1">Música y Reciclaje</div>
             <h3 className="font-bold text-[#2D4635]">Asiste a LAKA Play Eco</h3>
           </div>
           <Award size={24} className="text-[#2D4635]" />
        </div>

      </div>

    </main>
  );
}

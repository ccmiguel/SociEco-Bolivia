"use client"
import dynamic from 'next/dynamic';

const MapWrapper = dynamic(() => import('@/components/MapWrapper'), {
  ssr: false,
  loading: () => <div className="flex-1 bg-[#FDFBF7] flex items-center justify-center font-bold">Cargando mapa SOCIECO...</div>
});

export default function MapaPage() {
  return (
    /* h-[calc(100vh-6rem)] resta el espacio del BottomNav para que no haya scroll */
    <main className="flex flex-col h-[calc(100vh-6rem)] bg-[#FDFBF7] overflow-hidden">
      <div className="flex-1 relative">
        <MapWrapper />
      </div>
    </main>
  );
}
"use client"
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/Card";
import { MapPin, Search } from 'lucide-react';

export default function MarketPage() {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  }, []);

  const offers = [
    { id: 1, name: "EcoCentro Downtown", distance: "0.8 km", price: "$5.00/kg PET" },
    { id: 2, name: "Punto Limpio Norte", distance: "2.1 km", price: "$4.50/kg PET" },
    { id: 3, name: "Recicladora Industrial", distance: "5.4 km", price: "$6.00/kg (Mayorista)" }
  ];

  return (
    <main className="p-6 max-w-md mx-auto min-h-screen">
      <h1 className="text-2xl font-bold text-socieco-dark mb-2 mt-6">Mercado de Materiales</h1>
      <div className="flex flex-col gap-2 mb-6">
         <p className="text-sm text-socieco-muted flex items-center gap-1">
           <MapPin size={16} /> 
           {location ? "Calculado desde tu ubicación" : "Buscando ubicación satelital..."}
         </p>
         <div className="relative mt-2">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input className="w-full bg-white rounded-full py-4 pl-12 pr-6 shadow-soft border border-gray-100 outline-none focus:border-socieco-primary" placeholder="Buscar comprador de aluminio, vidrio..." />
         </div>
      </div>

      <div className="space-y-4">
        {offers.map(offer => (
          <Card key={offer.id} className="flex gap-4 items-center">
            <div className="bg-socieco-primary/20 p-4 rounded-xl text-socieco-dark">
               <MapPin />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-socieco-text text-md">{offer.name}</h3>
              <p className="text-xs text-socieco-muted">{offer.distance} de distancia</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-socieco-dark bg-socieco-primary px-3 py-1 rounded-full whitespace-nowrap">{offer.price}</span>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}

"use client"
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Leaf, Award, Droplet, Wind, Flame } from 'lucide-react';
import Link from 'next/link';
// import { supabase } from "@/services/supabase"; // Use to fetch real data

export default function Home() {
  const [impact, setImpact] = useState({ co2: 0, agua: 0, puntos: 0, nivel: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImpact() {
      // 1. Aquí se llamaría a supabase: supabase.from('perfiles').select('co2_ahorrado, agua_ahorrada')
      // 2. Simulamos la consulta
      setTimeout(() => {
         setImpact({ co2: 12.5, agua: 450, puntos: 1540, nivel: 4 });
         setLoading(false);
      }, 800);
    }
    fetchImpact();
  }, []);

  return (
    <main className="p-6 max-w-md mx-auto min-h-screen">
      <header className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-socieco-dark mb-2">¡Hola, Usuario!</h1>
        <p className="text-socieco-muted">Resumen de tu impacto ambiental</p>
      </header>

      {/* Racha / Nivel */}
      <Card variant="dark" className="mb-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-socieco-primary text-socieco-dark p-2 rounded-full shadow-lg">
              <Flame size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-socieco-primary">Racha de 5 días</h2>
              <p className="text-sm font-light text-socieco-bg opacity-80">¡Sigue así! 🔥</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4 mt-2">
          <div className="flex justify-between items-center mb-2">
             <div className="flex items-center gap-2">
                <Award size={18} className="text-socieco-secondary" />
                <span className="font-semibold text-socieco-bg">Nivel {impact.nivel}</span>
             </div>
             <span className="text-xs text-socieco-bg opacity-80">{loading ? '...' : impact.puntos}/2000 pts</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-2.5">
            <div className={`bg-socieco-primary h-2.5 rounded-full`} style={{ width: loading ? '0%' : '75%', transition: 'width 1s' }}></div>
          </div>
        </div>
      </Card>

      <h3 className="text-xl font-semibold text-socieco-dark mb-4">Tu Impacto Real</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="flex flex-col items-center text-center justify-center p-4 border border-teal-100 bg-teal-50">
           <div className="bg-teal-200 p-3 rounded-full mb-2">
              <Wind size={28} className="text-teal-700"/>
           </div>
           <h4 className="font-bold text-socieco-text text-lg">{loading ? '...' : impact.co2} kg</h4>
           <p className="text-xs text-socieco-muted">CO2 Ahorrado</p>
        </Card>

        <Card className="flex flex-col items-center text-center justify-center p-4 border border-blue-100 bg-blue-50">
           <div className="bg-blue-200 p-3 rounded-full mb-2">
              <Droplet size={28} className="text-blue-600"/>
           </div>
           <h4 className="font-bold text-socieco-text text-lg">{loading ? '...' : impact.agua} L</h4>
           <p className="text-xs text-socieco-muted">Agua Ahorrada</p>
        </Card>
      </div>
      
      <div className="mt-8 mb-4">
         <Link href="/scanner" className="block w-full">
            <Button>Quiero reciclar</Button>
         </Link>
      </div>
    </main>
  );
}

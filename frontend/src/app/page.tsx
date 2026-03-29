"use client"
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Leaf, Award, Droplet, Wind, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from "@/services/supabase";

export default function Home() {
  const router = useRouter();
  const [impact, setImpact] = useState({ co2: 0, peso: 0, puntos: 0, nivel: 1 });
  const [profile, setProfile] = useState({ nombre: 'Usuario', racha: 0 });
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleRecycleClick = async () => {
    setConnecting(true);
    try {

      // 1. Obtener el token de la sesión activa
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Test de conexión con el backend de Inteligencia Artificial (Flask)
      const res = await fetch('http://localhost:5000/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}) // Enviamos vacío para solo testear si levanta
      });

      // Si devuelve ok o error 400 (Falta imagen), significa que conectó con éxito a Flask
      if (res.ok || res.status === 400 || res.status === 405) {
        router.push('/scanner');
      } else {
        alert("El backend de la Cámara IA indicó un código inesperado.");
      }
    } catch (err) {
      console.error(err);
      alert("Error: No se pudo detectar el servidor de inteligencia artificial. ¿Corriste 'python app.py' en /backend-ai?");
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    async function fetchImpact() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Buscamos el perfil usando 'user_id' (que es el ID de Auth)
        const { data: profileData, error: pError } = await supabase
          .from('perfiles')
          .select('id, nombre, puntos_totales, co2_ahorrado') // USA 'nombre'
          .eq('user_id', user.id) // USA 'user_id' para filtrar por el ID de Auth
          .single();

        if (profileData) {
          setProfile({
            nombre: profileData.nombre ? profileData.nombre.split(' ')[0] : 'Miguel',
            racha: 0
          });

          // 2. Usamos el ID del PERFIL para buscar sus transacciones
          const { data: txData } = await supabase
            .from('transacciones_reciclaje')
            .select('peso, co2_ahorrado')
            .eq('usuario_id', profileData.id); // ID del perfil (10dd...)

          let totalPeso = 0;
          let totalCo2 = profileData.co2_ahorrado || 0;

          if (txData) {
            txData.forEach(tx => {
              totalPeso += (tx.peso || 0);
            });
          }

          setImpact({
            co2: totalCo2,
            peso: totalPeso,
            puntos: profileData.puntos_totales,
            nivel: 4
          });
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchImpact();
  }, []);

  return (
    <main className="p-6 max-w-md mx-auto min-h-screen">
      <header className="mb-8 mt-4">
        <div>
          <h1 className="text-3xl font-bold text-socieco-dark mb-2">
            ¡Hola, {loading ? 'Cargando...' : profile.nombre}!
          </h1>
          <p className="text-socieco-muted">Resumen de tu impacto ambiental</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>Salir</Button>
      </header>

      {/* Racha / Nivel */}
      <Card variant="dark" className="mb-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-socieco-primary text-socieco-dark p-2 rounded-full shadow-lg">
              <Flame size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-socieco-primary">Racha de {profile.racha} días</h2>
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
            <Wind size={28} className="text-teal-700" />
          </div>
          <h4 className="font-bold text-socieco-text text-lg">{loading ? '...' : impact.co2} kg</h4>
          <p className="text-xs text-socieco-muted">CO2 Ahorrado</p>
        </Card>

        <Card className="flex flex-col items-center text-center justify-center p-4 border border-emerald-100 bg-emerald-50">
          <div className="bg-emerald-200 p-3 rounded-full mb-2">
            <Leaf size={28} className="text-emerald-700" />
          </div>
          <h4 className="font-bold text-socieco-text text-lg">{loading ? '...' : impact.peso} kg</h4>
          <p className="text-xs text-socieco-muted">Peso Reciclado</p>
        </Card>
      </div>

      <div className="mt-8 mb-4">
        <Button onClick={handleRecycleClick} disabled={connecting} className="w-full block">
          {connecting ? "Conectando al Scanner AI..." : "Quiero reciclar"}
        </Button>
      </div>
    </main>
  );
}

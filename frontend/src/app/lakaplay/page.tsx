"use client"
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { PlayCircle, GraduationCap } from 'lucide-react';
import { supabase } from "@/services/supabase";
import { ethers } from 'ethers';

export default function LakaPlayPage() {
  const [complete, setComplete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('cursos_lakaplay')
        .select('*')
        .order('categoria', { ascending: true });

      if (data) setCourses(data);
      if (error) console.error("Error cargando cursos:", error);
    };
    fetchCourses();
  }, []);

  const handleFinishVideo = async (courseId: string, points: number) => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined' && !(window as any).ethereum) {
        alert("Instala Metamask para mintear tus recompensas.");
        setLoading(false);
        return;
      }
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);

      // Simulación de interacción con Traceability.sol
      await new Promise(resolve => setTimeout(resolve, 2000));

      setComplete(courseId);
      alert(`¡Blockchain confirmada! +${points} puntos SocioEco añadidos.`);
    } catch (err) {
      console.error(err);
      alert('Error con la billetera.');
    } finally {
      setLoading(false);
    }
  };

  // Agrupamos los cursos por categoría para el diseño del video
  const categories = Array.from(new Set(courses.map(c => c.categoria)));

  return (
    <main className="p-6 max-w-md mx-auto min-h-screen bg-[#FDFBF7]">
      <header className="mb-8 mt-6">
        <h1 className="text-3xl font-black text-[#2D4635] uppercase italic">LakaPlay</h1>
        <p className="text-sm text-[#2D4635]/70 font-medium">Aprende y gana tokens verificados on-chain.</p>
      </header>

      {categories.map(cat => (
        <section key={cat} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={20} className="text-[#2D4635]" />
            <h2 className="text-lg font-bold text-[#2D4635] uppercase tracking-tighter">{cat}</h2>
          </div>

          <div className="space-y-4">
            {courses.filter(c => c.categoria === cat).map(course => (
              <Card key={course.id} className="border-2 border-[#2D4635] shadow-[4px_4px_0px_0px_rgba(45,70,53,1)] overflow-hidden">
                <div className="p-1">
                  <h3 className="font-black text-[#2D4635] text-lg">{course.titulo}</h3>
                  <p className="text-xs font-bold text-gray-500 mb-4">{course.duracion} de video</p>

                  {complete === course.id ? (
                    <div className="bg-[#D9ED92] border-2 border-[#2D4635] text-[#2D4635] p-3 rounded-xl text-center font-black text-xs uppercase">
                      ✅ Completado - Puntos en Wallet
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full flex justify-center items-center gap-2 py-4 border-2 border-[#2D4635] hover:bg-[#D9ED92] transition-colors"
                      onClick={() => handleFinishVideo(course.id, course.puntos_otorgados)}
                      disabled={loading}
                    >
                      {loading ? 'Firmando Transacción...' : (
                        <span className="flex items-center gap-2 font-black text-xs uppercase">
                          <PlayCircle size={16} /> Ver y ganar +{course.puntos_otorgados} pts
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
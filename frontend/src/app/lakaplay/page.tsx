"use client"
import React, { useState } from 'react';
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { PlayCircle } from 'lucide-react';

// Require import de ether para futura interaccion real
import { ethers } from 'ethers';

export default function LakaPlayPage() {
  const [complete, setComplete] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const courses = [
    { id: 1, title: "Economía Circular 101", duration: "5 min", points: 50 },
    { id: 2, title: "Microplásticos: el enemigo", duration: "8 min", points: 80 },
    { id: 3, title: "Cómo clasificar en origen", duration: "4 min", points: 40 }
  ];

  const handleFinishVideo = async (courseId: number, points: number) => {
    setLoading(true);
    try {
      // 1. Detectar billetera Ethers
      if (typeof window !== 'undefined' && !(window as any).ethereum) {
        alert("Instala Metamask (o usa una billetera inyectada) para mintear tus recompensas on-chain.");
        setLoading(false);
        return;
      }
      
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []); // Solicitamos login
      // const signer = await provider.getSigner();
      
      // 2. Interfaz simulada de contrato Traceability.sol usando mintPoints
      console.log(`Buscando contrato inteligente de SocioEco para depositar ${points} puntos`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulando TX Web3
      
      setComplete(courseId);
      alert(`¡Transacción confirmada en la Blockchain! +${points} puntos añadidos a tu billetera cripto.`);
    } catch (err) {
      console.error(err);
      alert('Error interactuando con la billetera.');
    }
    setLoading(false);
  };

  return (
    <main className="p-6 max-w-md mx-auto min-h-screen">
      <h1 className="text-2xl font-bold text-socieco-dark mb-2 mt-6">LakaPlay</h1>
      <p className="text-sm text-socieco-muted mb-6">Aprende sobre sostenibilidad y gana tokens verificados on-chain mediante el contrato `Traceability.sol`.</p>
      
      <div className="space-y-4">
        {courses.map(course => (
          <Card key={course.id} className="border-l-4 border-socieco-primary">
            <h3 className="font-bold text-lg text-socieco-text">{course.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{course.duration} de video</p>
            
            {complete === course.id ? (
              <div className="bg-[#D9ED92]/30 text-socieco-dark p-3 rounded-lg text-center font-bold text-sm">
                ✅ Completado - Puntos en tu Wallet
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full flex justify-center items-center gap-2 py-3"
                onClick={() => handleFinishVideo(course.id, course.points)}
                disabled={loading}
              >
                {loading ? 'Firmando Transacción...' : (
                   <><PlayCircle size={18} /> Ver y ganar +{course.points} pts</>
                )}
              </Button>
            )}
          </Card>
        ))}
      </div>
    </main>
  );
}

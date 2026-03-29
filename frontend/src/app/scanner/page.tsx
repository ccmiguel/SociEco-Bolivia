"use client"
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/Button";
import { Camera, UploadCloud, RefreshCcw, Leaf, MapPin } from 'lucide-react';
import { Card } from "@/components/Card";
import { supabase } from '@/services/supabase';

export default function ScannerPage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch('http://localhost:5000/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ image_base64: image })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el servidor');
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error al conectar con el servidor IA.');
    }
    setLoading(false);
  };

  return (
    <main className="p-6 max-w-md mx-auto min-h-screen bg-[#FDFBF7]">
      <h1 className="text-3xl font-black text-[#2D4635] mb-6 mt-6 uppercase italic tracking-tighter">
        Escáner IA
      </h1>

      {!result ? (
        <div className="space-y-6">
          <button
            onClick={() => !image && fileInputRef.current?.click()}
            className="w-full flex-col border-4 border-dashed border-[#2D4635] rounded-[32px] bg-white flex items-center justify-center min-h-[400px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(45,70,53,1)] transition-transform active:scale-95"
          >
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-[#2D4635] flex flex-col items-center p-8">
                <Camera size={80} strokeWidth={1.5} className="mb-4 opacity-20" />
                <p className="font-black text-xl uppercase italic">Toca para escanear</p>
                <p className="text-sm font-medium mt-2 opacity-70">Detectaremos el material al instante</p>
              </div>
            )}
            <input type="file" accept="image/*" capture="environment" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
          </button>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 border-2 border-[#2D4635] py-6 rounded-2xl font-bold" onClick={() => fileInputRef.current?.click()}>
              <UploadCloud className="inline mr-2" size={20} /> Galería
            </Button>
            <Button className="flex-1 bg-[#2D4635] text-[#D9ED92] py-6 rounded-2xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" onClick={handleScan} disabled={!image || loading}>
              {loading ? 'Analizando...' : 'Identificar'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-12">
          {/* Tarjeta de Éxito Jukumari */}
          <Card className="border-4 border-[#2D4635] shadow-[8px_8px_0px_0px_rgba(45,70,53,1)] bg-[#D9ED92] p-6 text-center rounded-[32px]">
            <div className="bg-white w-20 h-20 rounded-full mx-auto mb-4 border-2 border-[#2D4635] flex items-center justify-center overflow-hidden">
              <img src="/jukumari-avatar.png" alt="Jukumari" className="w-14" />
            </div>
            <h2 className="text-xl font-black text-[#2D4635] uppercase italic">¡Lo logramos!</h2>
            <p className="text-[#2D4635] font-bold text-2xl mb-1">Detecté {result.material_detected}</p>
            <div className="flex justify-center gap-3 mt-3">
              <span className="bg-white/60 px-3 py-1 rounded-full text-[10px] font-black border border-[#2D4635] uppercase">
                +10 pts
              </span>
              <span className="bg-white/60 px-3 py-1 rounded-full text-[10px] font-black border border-[#2D4635] uppercase">
                +{(result.estimated_weight_kg * 0.5).toFixed(2)}kg $CO_2$
              </span>
            </div>
          </Card>

          {/* Tarjeta de Consejos y Decisiones */}
          <div className="bg-white border-4 border-[#2D4635] rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(45,70,53,1)]">
            <h3 className="font-black text-[#2D4635] uppercase text-xs mb-4 flex items-center gap-2 tracking-widest">
              <Leaf size={16} /> Consejo de Jukumari
            </h3>
            <p className="text-[#2D4635]/80 text-sm italic leading-relaxed mb-6 font-medium">
              "¡Excelente elección! El {result.material_detected} puede tardar cientos de años en degradarse. ¿Sabías que con esto puedes hacer una {result.creative_recycling[0]?.title || 'nueva creación'}?"
            </p>

            <div className="space-y-3">
              <Button
                className="w-full bg-[#2D4635] text-[#D9ED92] py-7 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                onClick={() => router.push('/mapa')}
              >
                <MapPin size={18} /> Vender / Entregar
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 border-[#2D4635] py-7 rounded-2xl font-black uppercase text-xs text-[#2D4635]"
                onClick={() => { setResult(null); setImage(null); }}
              >
                <RefreshCcw size={18} className="mr-2" /> Escanear otro
              </Button>
            </div>
          </div>

          {/* Ideas de Reciclaje Creativo */}
          {result.creative_recycling && result.creative_recycling.length > 0 && (
            <div className="pt-2">
              <h3 className="font-black text-[#2D4635] uppercase text-xs mb-4 tracking-widest pl-2">Tutorial Jukumari</h3>
              {result.creative_recycling.map((idea: any) => (
                <Card key={idea.id} className="mb-4 border-2 border-[#2D4635] rounded-3xl bg-white p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-black text-[#2D4635] text-base">{idea.title}</h4>
                    <span className="text-[9px] bg-[#D9ED92] border border-[#2D4635] text-[#2D4635] px-2 py-1 rounded-lg uppercase font-black tracking-tighter">
                      {idea.difficulty}
                    </span>
                  </div>
                  <ul className="text-xs text-[#2D4635]/80 font-bold space-y-2">
                    {idea.steps.map((step: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#2D4635] opacity-30">{i + 1}.</span> {step}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
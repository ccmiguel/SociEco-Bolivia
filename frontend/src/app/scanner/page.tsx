"use client"
import React, { useState, useRef } from 'react';
import { Button } from "@/components/Button";
import { Camera, UploadCloud, RefreshCcw } from 'lucide-react';
import { Card } from "@/components/Card";

export default function ScannerPage() {
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
      const response = await fetch('http://localhost:5000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: image })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Asegúrate de tener el backend de Flask corriendo en el puerto 5000.');
    }
    setLoading(false);
  };

  return (
    <main className="p-6 max-w-md mx-auto min-h-screen">
      <h1 className="text-2xl font-bold text-socieco-dark mb-4 mt-6">Escáner IA</h1>
      
      {!result ? (
        <div className="space-y-6">
          <button 
             onClick={() => !image && fileInputRef.current?.click()}
             className="w-full flex-col border-dashed border-2 border-gray-300 rounded-[24px] bg-gray-50 flex items-center justify-center min-h-[350px] overflow-hidden"
          >
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-500 flex flex-col items-center p-6">
                <Camera size={64} className="mb-4 text-gray-300" />
                <p className="font-medium text-lg text-socieco-text">Toca para abrir la cámara</p>
                <p className="text-sm mt-2">Identifica tu residuo automáticamente</p>
              </div>
            )}
            <input type="file" accept="image/*" capture="environment" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
          </button>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()}>
              <UploadCloud className="inline mr-2" /> Galería
            </Button>
            <Button className="flex-1" onClick={handleScan} disabled={!image || loading}>
              {loading ? 'Analizando...' : 'Escanear'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card variant="dark">
            <h2 className="text-xl font-bold text-socieco-primary mb-2">¡Material Detectado!</h2>
            <p className="text-white text-2xl font-black capitalize">{result.material_detected}</p>
            <p className="text-gray-300 text-sm mt-1">Precisión IA: {(result.confidence * 100).toFixed(0)}%</p>
          </Card>

          {result.creative_recycling && result.creative_recycling.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-4 text-socieco-dark">Ideas de Reciclaje Creativo</h3>
              {result.creative_recycling.map((idea: any) => (
                <Card key={idea.id} className="mb-4 shadow-sm border border-gray-100 bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-socieco-text">{idea.title}</h4>
                    <span className="text-[10px] bg-socieco-bg border border-socieco-dark text-socieco-dark px-2 py-1 rounded-full uppercase font-bold">{idea.difficulty}</span>
                  </div>
                  <ul className="text-sm text-socieco-muted list-disc pl-5 mt-3 space-y-1">
                    {idea.steps.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          )}

          <Button variant="outline" onClick={() => { setResult(null); setImage(null); }}>
            <RefreshCcw className="inline mr-2" size={18} /> Escanear otro residuo
          </Button>
        </div>
      )}
    </main>
  );
}

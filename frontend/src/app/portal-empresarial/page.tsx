"use client"
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Building2, ShieldCheck, Box, Wind, Users, BarChart3, Download } from 'lucide-react';

export default function CorporatePortalPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      setMetrics({
        campaign: "Campaña Universitaria 2024",
        totalKg: 14520,
        totalCo2: 32000,
        participants: 1240,
        monthlyTrend: [
          { month: 'Oct', value: 1200 },
          { month: 'Nov', value: 2100 },
          { month: 'Dic', value: 1800 },
          { month: 'Ene', value: 2500 },
          { month: 'Feb', value: 3200 },
          { month: 'Mar', value: 3720 },
        ],
        contractHash: "0x8f2a1b9c9f41a8eF92b8d14E5f22caBe1F4d32a9"
      });
      setLoading(false);
    }, 1500);
  }, []);

  const maxValue = metrics ? Math.max(...metrics.monthlyTrend.map((t: any) => t.value)) : 1;

  return (
    // Limitamos el ancho a max-w-md para que parezca app de celular
    <main className="min-h-screen bg-[#FDFBF7] pb-32 max-w-md mx-auto font-sans relative">

      {/* Header Corporativo Ajustado a Móvil */}
      <div className="bg-socieco-dark text-white p-6 pt-10 pb-12 rounded-b-[40px] shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-socieco-primary/20 p-2 rounded-xl">
              <Building2 size={28} className="text-socieco-primary" />
            </div>
            <h1 className="text-xl font-black tracking-tight">
              Portal ESG Corporativo
            </h1>
          </div>
          <p className="text-gray-300 font-light text-xs leading-relaxed">
            Medición descentralizada en tiempo real de sostenibilidad e impacto ambiental.
          </p>
          <Button variant="outline" className="w-full border-socieco-primary text-socieco-primary bg-transparent rounded-2xl py-6 font-bold flex gap-2">
            <Download size={18} /> Exportar Reporte PDF
          </Button>
        </div>
      </div>

      <div className="px-6 -mt-6">
        {loading || !metrics ? (
          <Card className="text-center py-16 shadow-xl border-none bg-white/80 backdrop-blur">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-socieco-primary mx-auto mb-4"></div>
            <p className="text-socieco-muted font-bold text-xs uppercase tracking-widest">Sincronizando Blockchain...</p>
          </Card>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="flex flex-col gap-1">
              <span className="bg-[#D9ED92]/40 text-socieco-dark text-[10px] font-black px-3 py-1 rounded-full uppercase w-fit flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-socieco-dark animate-pulse"></span>
                Campaña en curso
              </span>
              <h2 className="text-xl font-black text-socieco-dark">{metrics.campaign}</h2>
            </div>

            {/* KPIs Verticales para Móvil */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="border-l-4 border-socieco-primary flex items-center gap-4 py-4">
                <div className="bg-socieco-primary/20 p-3 rounded-full">
                  <Box className="text-socieco-dark" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-socieco-muted">PET Reciclado</p>
                  <p className="text-2xl font-black text-socieco-dark">{metrics.totalKg.toLocaleString()} kg</p>
                </div>
              </Card>

              <Card className="border-l-4 border-teal-400 flex items-center gap-4 py-4">
                <div className="bg-teal-50 p-3 rounded-full">
                  <Wind className="text-teal-700" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-socieco-muted">CO2 Mitigado</p>
                  <p className="text-2xl font-black text-teal-800">{metrics.totalCo2.toLocaleString()} kg</p>
                </div>
              </Card>

              <Card className="border-l-4 border-[#F9A482] flex items-center gap-4 py-4">
                <div className="bg-[#F9A482]/10 p-3 rounded-full">
                  <Users className="text-[#c65e34]" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-socieco-muted">Voluntarios</p>
                  <p className="text-2xl font-black text-[#af4f29]">{metrics.participants.toLocaleString()}</p>
                </div>
              </Card>
            </div>

            {/* Gráfico Compacto */}
            <Card className="shadow-lg border-none p-5">
              <h3 className="font-black text-sm text-socieco-dark flex items-center gap-2 mb-6">
                <BarChart3 size={18} className="text-socieco-primary" />
                Tendencia de Acopio
              </h3>

              <div className="flex items-end h-40 gap-2">
                {metrics.monthlyTrend.map((data: any, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center group/bar">
                    <div className="w-full relative flex justify-end flex-col h-full bg-gray-50 rounded-t-md overflow-hidden">
                      <div
                        className="bg-socieco-dark w-full rounded-t-md transition-all duration-1000"
                        style={{ height: `${(data.value / maxValue) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 mt-2 uppercase">{data.month}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Blockchain Card Ajustada */}
            <Card className="bg-gradient-to-br from-[#F2FBE0] to-white border-none shadow-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-[#D9ED92] p-3 rounded-xl shadow-sm border border-white">
                  <ShieldCheck size={24} className="text-socieco-dark" />
                </div>
                <h3 className="font-black text-lg text-socieco-dark">Certificado on-chain</h3>
              </div>
              <p className="text-xs text-socieco-muted mb-6 leading-relaxed">
                Impacto inyectado en <strong>Traceability.sol</strong>. Auditoría ESG transparente e inmutable.
              </p>

              <div className="bg-white/50 p-3 rounded-xl border border-gray-100 mb-4">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Hash del Contrato</p>
                <p className="text-[10px] font-mono font-bold text-socieco-dark break-all">{metrics.contractHash}</p>
              </div>

              <Button className="w-full bg-socieco-dark text-socieco-primary rounded-xl py-4 font-bold text-xs uppercase tracking-tight">
                Ver en PolygonScan
              </Button>
            </Card>

          </div>
        )}
      </div>
    </main>
  );
}
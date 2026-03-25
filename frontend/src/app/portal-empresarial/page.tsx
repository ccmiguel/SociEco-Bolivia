"use client"
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Building2, ShieldCheck, Box, Wind, Users, BarChart3 } from 'lucide-react';

export default function CorporatePortalPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    // Simulando una consulta agregada robusta a Supabase:
    // const { data, error } = await supabase.rpc('get_campaign_impact_aggregate', { campaign_id: '123' });
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
        contractHash: "0x8f2a1b9c9f41a8eF92b8d14E5f22caBe1F4d32a9" // Hash apuntando a Traceability.sol
      });
      setLoading(false);
    }, 1500);
  }, []);

  const maxValue = metrics ? Math.max(...metrics.monthlyTrend.map((t: any) => t.value)) : 1;

  return (
    <main className="min-h-screen bg-[#FDFBF7] pb-12 font-sans">
      {/* Header Corporativo (Diseño Premium ESG) */}
      <div className="bg-socieco-dark text-white p-8 pt-12 pb-16 rounded-b-[40px] shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3 tracking-tight">
              <Building2 size={32} className="text-socieco-primary" />
              Portal ESG Corporativo
            </h1>
            <p className="mt-2 text-gray-300 font-light text-sm max-w-sm">Medición descentralizada en tiempo real de sostenibilidad e impacto ambiental.</p>
          </div>
          <Button variant="outline" className="border-socieco-primary text-socieco-primary bg-transparent hover:bg-socieco-primary hover:text-socieco-dark hidden md:block rounded-full px-6 py-3 font-bold transition-colors">
            Exportar Reporte
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8">
        {loading || !metrics ? (
          <Card className="text-center py-16 shadow-xl border-none">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-socieco-primary border-b-socieco-dark mx-auto mb-4"></div>
            <p className="text-socieco-muted font-bold tracking-wide text-sm uppercase">Sincronizando la Blockchain...</p>
          </Card>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-2xl font-black text-socieco-dark">{metrics.campaign}</h2>
              <span className="bg-[#D9ED92]/40 text-socieco-dark text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-socieco-dark animate-pulse"></span>
                 En curso
              </span>
            </div>

            {/* Widgets de KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-socieco-primary flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="bg-socieco-primary/30 p-4 rounded-full">
                  <Box className="text-socieco-dark" size={32} strokeWidth={2.5}/>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-socieco-muted mb-1">PET Reciclado</p>
                  <p className="text-3xl font-black text-socieco-dark">{metrics.totalKg.toLocaleString()} kg</p>
                </div>
              </Card>

              <Card className="border-l-4 border-teal-400 flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="bg-teal-100 p-4 rounded-full">
                  <Wind className="text-teal-700" size={32} strokeWidth={2.5}/>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-socieco-muted mb-1">CO2 Mitigado</p>
                  <p className="text-3xl font-black text-teal-800">{metrics.totalCo2.toLocaleString()} kg</p>
                </div>
              </Card>

              <Card className="border-l-4 border-[#F9A482] flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="bg-[#F9A482]/20 p-4 rounded-full">
                  <Users className="text-[#c65e34]" size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-socieco-muted mb-1">Voluntarios</p>
                  <p className="text-3xl font-black text-[#af4f29]">{metrics.participants.toLocaleString()}</p>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              
              {/* Gráfico de Tendencia Mensualizado */}
              <Card className="lg:col-span-2 shadow-lg border-none overflow-hidden group">
                <div className="flex justify-between mb-8 border-b pb-4">
                  <h3 className="font-black text-lg text-socieco-dark flex items-center gap-2">
                    <BarChart3 size={24} className="text-socieco-primary" strokeWidth={3} />
                    Tendencia de Acopio (Últimos 6 meses)
                  </h3>
                </div>

                <div className="flex items-end h-56 gap-3 md:gap-5">
                  {metrics.monthlyTrend.map((data: any, i: number) => (
                    <div key={i} className="flex-1 flex flex-col items-center group/bar cursor-pointer">
                      <div className="w-full relative flex justify-end flex-col h-full bg-gray-100 rounded-t-lg overflow-hidden">
                        <div 
                           className="bg-socieco-dark w-full rounded-t-lg transition-all duration-1000 ease-out group-hover/bar:bg-socieco-primary"
                           style={{ height: `${(data.value / maxValue) * 100}%` }}
                        ></div>
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-black text-socieco-dark opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white px-2 py-1 rounded shadow-sm">
                          {data.value.toLocaleString()}kg
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 mt-3 uppercase tracking-widers">{data.month}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Sello de Verificación y Blockchain */}
              <Card className="flex flex-col justify-between shadow-lg border-none bg-gradient-to-b from-[#F2FBE0] to-white">
                <div>
                  <div className="bg-[#D9ED92] w-14 h-14 rounded-2xl flex items-center justify-center mb-5 rotate-3 shadow-sm border-2 border-white">
                    <ShieldCheck size={28} className="text-socieco-dark" strokeWidth={2.5}/>
                  </div>
                  <h3 className="font-black text-xl text-socieco-dark mb-2 leading-tight">Certificado on-chain</h3>
                  <p className="text-sm text-socieco-muted mb-6 leading-relaxed">
                    Todo el impacto de tu campaña está inyectado directamente en <strong>Traceability.sol</strong>, impidiendo la manipulación de datos y habilitando auditoría ESG en tiempo real.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-inner">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contrato Inteligente</p>
                  <p className="text-xs font-mono font-bold text-socieco-dark break-all bg-gray-50 p-2 rounded">{metrics.contractHash}</p>
                </div>
                
                <Button className="w-full mt-5 bg-socieco-dark text-socieco-primary rounded-xl py-4 hover:scale-[1.02] active:scale-95 transition-transform flex justify-center items-center gap-2">
                  Ver en PolygonScan
                </Button>
              </Card>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}

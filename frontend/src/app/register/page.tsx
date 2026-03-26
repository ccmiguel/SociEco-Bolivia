"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supabase';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data?.user?.identities?.length === 0) {
         setError("Este correo ya está registrado.");
         return;
      }

      setSuccess("¡Registro exitoso! Por favor revisa tu correo para confirmar tu cuenta y luego inicia sesión.");
      // Opcional: router.push('/login') después de unos segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado al registrar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto min-h-screen flex flex-col justify-center">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-socieco-dark mb-2">Crear Cuenta</h1>
        <p className="text-socieco-muted">Únete para empezar a impactar el ambiente</p>
      </header>

      <Card className="p-6">
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm">
              {success}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="fullName" className="text-sm font-medium text-socieco-dark">
              Nombre Completo
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-socieco-primary focus:border-transparent text-gray-900"
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-socieco-dark">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-socieco-primary focus:border-transparent text-gray-900"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label htmlFor="password" className="text-sm font-medium text-socieco-dark">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-socieco-primary focus:border-transparent text-gray-900"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Registrando...' : 'Registrarme'}
          </Button>
          
          <div className="mt-4 text-center text-sm text-socieco-muted">
            ¿Ya tienes una cuenta?{' '}
            <button 
              type="button" 
              onClick={() => router.push('/login')}
              className="text-socieco-primary hover:underline focus:outline-none"
            >
              Inicia sesión
            </button>
          </div>
        </form>
      </Card>
    </main>
  );
}

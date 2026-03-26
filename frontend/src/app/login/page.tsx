"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supabase';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Intentando iniciar sesión para:", email); // DEBUG 1

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      console.log("Login exitoso, datos de usuario:", data.user);
      window.location.href = '/';

    } catch (err: any) {
      setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto min-h-screen flex flex-col justify-center">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-socieco-dark mb-2">Iniciar Sesión</h1>
        <p className="text-socieco-muted">Ingresa tus credenciales para continuar</p>
      </header>

      <Card className="p-6">
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

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
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </Button>

          <div className="mt-6 text-center text-sm">
            <span className="text-socieco-muted">¿No tienes una cuenta? </span>
            <button
              onClick={() => router.push('/register')}
              className="text-socieco-primary font-bold hover:underline"
            >
              Regístrate aquí
            </button>
          </div>
        </form>
      </Card>
    </main>
  );
}

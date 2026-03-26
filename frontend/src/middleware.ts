import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    // IMPORTANTE: Usamos getUser() que es más seguro para el Middleware
    const { data: { user } } = await supabase.auth.getUser()

    // Proteger la ruta de Inicio y el Scanner
    const isProtectedRoute = request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/scanner')

    if (!user && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}

// Configuración del Matcher
export const config = {
    matcher: [
        /*
         * Coincidir con todas las rutas excepto las que empiecen con:
         * - api (rutas de API)
         * - _next/static (archivos estáticos)
         * - _next/image (optimización de imágenes)
         * - favicon.ico (archivo de icono)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
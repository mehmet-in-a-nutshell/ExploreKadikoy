import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // refresh session if expired - required for Server Components
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect the admin routes - ONLY for admin@explorekadikoy.com
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user || user.email?.toLowerCase() !== 'admin@explorekadikoy.com') {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }

    // Protect the user profile routes
    if (request.nextUrl.pathname.startsWith('/profile') && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // If user is already logged in, redirect them based on their role
    if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && user) {
        const url = request.nextUrl.clone()
        if (user.email?.toLowerCase() === 'admin@explorekadikoy.com') {
            url.pathname = '/admin'
        } else {
            url.pathname = '/profile'
        }
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

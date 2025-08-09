import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Role-based route protection
    const roleRoutes = {
      admin: ['/admin'],
      doctor: ['/doctor'],
      reception: ['/reception'],
      lab: ['/lab'],
      pharmacy: ['/pharmacy'],
      patient: ['/patient']
    }

    // Check if user has access to the route
    if (token?.role) {
      const userRole = token.role as keyof typeof roleRoutes
      const allowedRoutes = roleRoutes[userRole] || []
      
      const hasAccess = allowedRoutes.some(route => pathname.startsWith(route))
      
      if (!hasAccess) {
        // Redirect to appropriate dashboard based on role
        return NextResponse.redirect(new URL(`/${userRole}`, req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login and public pages
        if (req.nextUrl.pathname === '/' ||
            req.nextUrl.pathname.startsWith('/login') || 
            req.nextUrl.pathname.startsWith('/forgot-password') ||
            req.nextUrl.pathname.startsWith('/auth') ||
            req.nextUrl.pathname.startsWith('/api/auth') ||
            req.nextUrl.pathname.startsWith('/reset-password')) {
          return true
        }
        
        // Require authentication for all other pages
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
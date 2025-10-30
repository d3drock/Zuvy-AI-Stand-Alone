import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const roleAccessMap: Record<string, string[]> = {
  admin: [
    '/admin/admin-assessment-management',
    '/admin/questionbank',
    '/admin/analytics',
  ],
  student: ['/student', '/student/studentAssessment'],
}

const publicRoutes = ['/', '/login']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1️⃣ Allow all public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // 2️⃣ Get encoded user role
  const encodedRole = req.cookies.get('secure_typeuser')?.value
  if (!encodedRole) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 3️⃣ Decode the stored role (stored as btoa(JSON.stringify(role)))
  let role = ''
  try {
    role = JSON.parse(atob(encodedRole))
  } catch (err) {
    console.error('Invalid role cookie:', err)
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 4️⃣ Verify role exists
  if (!roleAccessMap[role]) {
    return NextResponse.redirect(new URL('/403', req.url))
  }

  // 5️⃣ Check route access
  const allowedPaths = roleAccessMap[role]
  const isAllowed = allowedPaths.some(path => pathname.startsWith(path))

  if (!isAllowed) {
    return NextResponse.redirect(new URL('/403', req.url))
  }

  // 6️⃣ Allow request to continue
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)'],
}

import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT as DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
      tenantId: string
      permissions: string[]
      accessToken: string
      tenant: {
        id: string
        name: string
        logo?: string
        primaryColor: string
        secondaryColor: string
        address: string
        phone: string
      }
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role: string
    tenantId: string
    permissions: string[]
    accessToken: string
    tenant: any
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: string
    tenantId: string
    permissions: string[]
    accessToken: string
    tenant: any
  }
}
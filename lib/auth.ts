import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'
import usersData from './users.json'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'admin' | 'doctor' | 'reception' | 'lab' | 'pharmacy' | 'patient'
  tenantId: string
  permissions: string[]
  avatar?: string
}

export interface Tenant {
  id: string
  name: string
  logo?: string
  primaryColor: string
  secondaryColor: string
  address: string
  phone: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        phone: { label: 'Phone', type: 'tel' },
        otp: { label: 'OTP', type: 'text' },
        tenantId: { label: 'Tenant ID', type: 'text' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email && !credentials?.phone) return null

          // Check against users.json data
          const user = usersData.users.find(u => 
            (credentials.email && u.email === credentials.email && u.password === credentials.password) ||
            (credentials.phone && u.phone === credentials.phone && credentials.otp === '123456')
          )

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              tenantId: user.tenantId,
              permissions: user.permissions,
              accessToken: 'mock-jwt-token-' + user.id,
              tenant: usersData.tenant
            }
          }

          return null
        } catch (error) {
          console.error('NextAuth authorize error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.role = user.role
          token.tenantId = user.tenantId
          token.permissions = user.permissions
          token.accessToken = user.accessToken
          token.tenant = user.tenant
        }
        return token
      } catch (error) {
        console.error('NextAuth JWT callback error:', error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (token && session.user) {
          session.user.id = token.sub!
          session.user.role = token.role as string
          session.user.tenantId = token.tenantId as string
          session.user.permissions = token.permissions as string[]
          session.user.accessToken = token.accessToken as string
          session.user.tenant = token.tenant as Tenant
        }
        return session
      } catch (error) {
        console.error('NextAuth session callback error:', error)
        return session
      }
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error'
  },
  session: { 
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata)
    },
    warn(code) {
      console.warn('NextAuth Warning:', code)
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('NextAuth Debug:', code, metadata)
      }
    }
  }
}

// Remove default export for app router compatibility
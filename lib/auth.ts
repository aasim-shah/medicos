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
            phone: user.phone,
            role: user.role,
            tenantId: user.tenantId,
            permissions: user.permissions,
            avatar: user.avatar,
            accessToken: 'mock-jwt-token-' + user.id,
            tenant: usersData.tenant
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.tenantId = user.tenantId
        token.permissions = user.permissions
        token.accessToken = user.accessToken
        token.tenant = user.tenant
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.tenantId = token.tenantId as string
        session.user.permissions = token.permissions as string[]
        session.user.accessToken = token.accessToken as string
        session.user.tenant = token.tenant as Tenant
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error'
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)
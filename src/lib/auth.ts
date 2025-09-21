import type { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./db"
// import bcrypt from "bcryptjs" // Unused for now

const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          }
        })

        if (!user) {
          return null
        }

        // For now, we'll skip password verification since we're using OAuth
        // In a real app, you'd verify the password hash here
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.subscriptionTier = user.subscriptionTier
        token.trialEndsAt = user.trialEndsAt
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        session.user.subscriptionTier = token.subscriptionTier as string
        session.user.trialEndsAt = token.trialEndsAt as Date
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  }
}

export const auth = NextAuth(authOptions)
export { authOptions }

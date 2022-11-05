import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      const newSession = {
        ...session,
        user: { ...session.user, id: user.id, role_id: user.role_id },
        ...token,
      }
      return newSession
    },
  },
}

export default NextAuth(authOptions)

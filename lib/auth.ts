import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: { 
            id: true,
            email: true,
            username: true,
            avatar: true,
            isPremium: true, 
            password: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("No user found");
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

       
        return {
          id: user.id,
          email: user.email,
          name: user.username,
          avatar: user.avatar || "/images/avatars/dummy-avatar.png",
          username: user.username,
          isPremium: user.isPremium, 
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.avatar = user.avatar || "/images/avatars/dummy-avatar.png";
        token.username = user.username;
        token.name = user.name;
        token.isPremium = user.isPremium; 
        token.accessToken = "your-generated-access-token"; 
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.avatar = token.avatar as string;
        session.user.username = token.username as string;
        session.user.name = token.name as string;
        session.user.isPremium = token.isPremium as boolean; 
        session.accessToken = token.accessToken as string; 
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
export const { auth } = NextAuth(authOptions);
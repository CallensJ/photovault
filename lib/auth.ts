import { NextAuthOptions } from "next-auth";
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
        });

        if (!user || !user.password) {
          throw new Error("No user found");
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        // Assure-toi que le champ 'username' est dans l'objet retourné.
        return {
          id: user.id,
          email: user.email,
          name: user.username,  // Ici on mappe 'username' à 'name' comme attendu par 'next-auth'
          avatar: user.avatar || "/images/avatars/dummy-avatar.png",
          username: user.username, // Ajoute le champ 'username'
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
        token.username = user.username; // Assure-toi d'inclure 'username' dans le JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.avatar = token.avatar as string;
        session.user.username = token.username as string; // Ajoute 'username' à la session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

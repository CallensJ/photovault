import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

// Définition de la configuration NextAuth
const authHandler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: { email: string; password: string } | undefined) {
        // Validation des informations de connexion
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("No user found");
        }

        // Comparaison du mot de passe
        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          avatar: user.avatar || "/images/avatars/dummy-avatar.png", // Utilise l'avatar ou un avatar par défaut
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Utilisation du JWT pour la session
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Ajout de l'ID de l'utilisateur dans le token
        token.avatar = user.avatar || "/images/avatars/dummy-avatar.png"; // Ajout de l'avatar
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.avatar = token.avatar as string; // Ajout de l'avatar à la session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Clé secrète pour signer le JWT
});

export { authHandler as GET, authHandler as POST };

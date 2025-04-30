
import "next-auth/jwt";

// Étend les types par défaut de NextAuth
declare module "next-auth" {
  // Étend le type Session pour y inclure l'id de l'utilisateur
  interface Session {
    user: {
      id: string;  // Ajoute l'ID de l'utilisateur
      email: string;
      name: string;
    };
  }

  // Étend le type JWT pour y inclure l'ID de l'utilisateur
  interface JWT {
    id: string;
  }
}

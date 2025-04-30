import "next-auth/jwt";

// Étend les types de NextAuth pour ajouter l'id et l'avatar à la session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      avatar: string; // Ajoute l'avatar ici
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    avatar: string; // Ajoute l'avatar ici
  }
}

// Étend aussi le type JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    avatar: string; // Ajoute l'avatar ici
  }
}

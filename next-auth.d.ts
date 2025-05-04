import "next-auth/jwt";

// Étend les types de NextAuth pour ajouter l'id, l'avatar, le username, isPremium et l'accessToken à la session
declare module "next-auth" {
  interface Session {
    accessToken?: string; // Ajoute accessToken ici
    
    user: {
      id: string;
      email: string;
      name: string;
      avatar: string;
      username: string; // Ajoute le username ici
      isPremium: boolean;  // Ajoute la propriété isPremium ici
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    avatar: string;
    username: string; // Ajoute le username ici
    isPremium: boolean;  // Ajoute la propriété isPremium ici
  }
}

// Étend aussi le type JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    avatar: string;
    username: string; // Ajoute le username ici
    accessToken?: string; // Ajoute accessToken ici
    isPremium: boolean;  // Ajoute la propriété isPremium ici
  }
}

import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    
    user: {
      id: string;
      email: string;
      name: string;
      avatar: string;
      username: string; 
      isPremium: boolean;  
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    avatar: string;
    username: string;
    isPremium: boolean; 
  }
}

// Étend aussi le type JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    avatar: string;
    username: string; 
    accessToken?: string; 
    isPremium: boolean;  
  }
}

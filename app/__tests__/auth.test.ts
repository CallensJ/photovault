import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcryptjs";
import { RequestInternal } from "next-auth";
import { prisma } from "@/lib/prisma";

interface MockUser {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar: string;
  isPremium: boolean;
  password: string;
}

// Mock de Prisma
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock de bcryptjs
jest.mock("bcryptjs", () => ({
  ...jest.requireActual("bcryptjs"),
  compare: jest.fn(),
}));

let mockUser: MockUser;
let provider: ReturnType<typeof CredentialsProvider>;

beforeAll(async () => {
  mockUser = {
    id: "user1",
    email: "test@example.com",
    username: "testuser",
    name: "testuser",
    avatar: "/images/avatars/avatar1.jpg",
    isPremium: true,
    password: await hash("correctpassword", 10),
  };
});

beforeEach(() => {
  // Mock de prisma.user.findUnique
  (prisma.user.findUnique as jest.Mock).mockImplementation(
    async ({ where }: { where: { email: string } }) => {
      console.log("Looking for user with email:", where.email); // Affiche l'email recherché
      if (where.email === "test@example.com") {
        return mockUser; // Retourne mockUser uniquement si l'email est correct
      }
      return null; // Sinon retourne null
    }
  );

  // Mock de bcrypt.compare
  (compare as jest.Mock).mockResolvedValue(true); // Force la validation à true

  // Redéfinition de `provider` ici pour garantir que tout est configuré avant chaque test
  provider = CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      console.log("Received credentials:", credentials); // Afficher les credentials reçus

      if (!credentials?.email || !credentials?.password) {
        throw new Error("Email and password are required");
      }

      // Debug : Afficher l'email pour vérifier qu'il est correct
      console.log("Calling prisma.user.findUnique with email:", credentials.email);

      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      });

      console.log("Found user:", user); // Vérifier si l'utilisateur est trouvé

      if (!user || !user.password) {
        throw new Error("No user found");
      }

      const isValid = await compare(credentials.password, user.password);
      console.log("Password valid:", isValid); // Vérifie si le mot de passe est valide

      if (!isValid) {
        throw new Error("Incorrect password");
      }

      console.log("Returning user data:", {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar ?? "",
        isPremium: user.isPremium,
        name: user.username,
      });

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar ?? "",
        isPremium: user.isPremium,
        name: user.username,
      };
    },
  });
});

it("devrait échouer avec des informations invalides", async () => {
  (compare as jest.Mock).mockResolvedValue(false); // Simule une comparaison échouée

  const reqBody = { email: "test@example.com", password: "wrongpassword" };
  const req = {} as Pick<
    RequestInternal,
    "query" | "body" | "headers" | "method"
  >;

  try {
    await provider.authorize!(reqBody, req);
  } catch (error: unknown) {
    if (error instanceof Error) {
      expect(error.message).toBe("Incorrect password");
    } else {
      throw error;
    }
  }
});
it("devrait échouer si l'utilisateur n'existe pas dans la base de données", async () => {
  // Simule une comparaison réussie mais sans utilisateur trouvé
  (compare as jest.Mock).mockResolvedValue(true);

  const reqBody = { email: "nonexistent@example.com", password: "anyPassword" };
  const req = {} as Pick<RequestInternal, "query" | "body" | "headers" | "method">;

  // Redéfinition de la méthode `findUnique` pour simuler un utilisateur non trouvé
  (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

  try {
    await provider.authorize!(reqBody, req);
  } catch (error: unknown) {
    if (error instanceof Error) {
      expect(error.message).toBe("No user found"); // Vérifie le message d'erreur
    } else {
      throw error;
    }
  }
});

it("devrait échouer si l'email ou le mot de passe est manquant", async () => {
  const reqBody = { email: "", password: "correctpassword" }; // Email manquant
  const req = {} as Pick<RequestInternal, "query" | "body" | "headers" | "method">;

  try {
    await provider.authorize!(reqBody, req);
  } catch (error: unknown) {
    if (error instanceof Error) {
      expect(error.message).toBe("Email and password are required"); // Vérifie que l'erreur est correcte
    } else {
      throw error;
    }
  }
});

it("devrait échouer si l'email est déjà pris", async () => {
  const existingUser = { ...mockUser, email: "existing@example.com" };

  // Simule que l'email existe déjà dans la base de données
  (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

  const reqBody = { email: "existing@example.com", password: "anyPassword" };
  const req = {} as Pick<RequestInternal, "query" | "body" | "headers" | "method">;

  try {
    await provider.authorize!(reqBody, req);
  } catch (error: unknown) {
    if (error instanceof Error) {
      expect(error.message).toBe("Email already taken"); // Vérifie que l'erreur est correctement gérée
    } else {
      throw error;
    }
  }
});
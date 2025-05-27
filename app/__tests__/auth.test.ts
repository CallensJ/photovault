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

// simulation de Prisma (prisma.user.findUnique)
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

//simulation de bcrypt
jest.mock("bcryptjs", () => ({
  ...jest.requireActual("bcryptjs"),
  compare: jest.fn(),
}));

let mockUser: MockUser;
let provider: ReturnType<typeof CredentialsProvider>;

// on cree un dummy user
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

// excution avant chaque test
// preparation de l'environnement de test
beforeEach(() => {
  // Mock de prisma.user.findUnique
  (prisma.user.findUnique as jest.Mock).mockImplementation(
    async ({ where }: { where: { email: string } }) => {
      if (where.email === "test@example.com") {
        return mockUser;
      }
      return null;
    }
  );

  (compare as jest.Mock).mockResolvedValue(true);

  provider = CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      // console.log("credentials:", credentials);

      if (!credentials?.email || !credentials?.password) {
        throw new Error("email ou mdp required");
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      });

      // console.log("user trouve:", user);

      if (!user || !user.password) {
        throw new Error("aucun user trouve");
      }

      const isValid = await compare(credentials.password, user.password);
      console.log("password valid:", isValid);

      if (!isValid) {
        throw new Error("mdp incorrect");
      }

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

// debut des tests|
//test 1

it("Information Invalides", async () => {
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
      expect(error.message).toBe("mdp incorrect");
    } else {
      throw error;
    }
  }
});

//test 2
it("User non existant dans la Bdd", async () => {
  // Simule une comparaison reussie mais sans utilisateur trouve
  (compare as jest.Mock).mockResolvedValue(true);

  const reqBody = { email: "nonexistent@example.com", password: "anyPassword" };
  const req = {} as Pick<
    RequestInternal,
    "query" | "body" | "headers" | "method"
  >;

  (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

  try {
    await provider.authorize!(reqBody, req);
  } catch (error: unknown) {
    if (error instanceof Error) {
      expect(error.message).toBe("User non trouve");
    } else {
      throw error;
    }
  }
});

//test 3

it("Email ou MDP est manquant", async () => {
  const reqBody = { email: "", password: "correctpassword" };
  const req = {} as Pick<
    RequestInternal,
    "query" | "body" | "headers" | "method"
  >;

  try {
    await provider.authorize!(reqBody, req);
  } catch (error: unknown) {
    if (error instanceof Error) {
      expect(error.message).toBe("email and password are required");
    } else {
      throw error;
    }
  }
});

//test 4
it("Email est deja utilise", async () => {
  const existingUser = { ...mockUser, email: "existing@example.com" };

  (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

  const reqBody = { email: "existing@example.com", password: "anyPassword" };
  const req = {} as Pick<
    RequestInternal,
    "query" | "body" | "headers" | "method"
  >;

  try {
    await provider.authorize!(reqBody, req);
  } catch (error: unknown) {
    if (error instanceof Error) {
      expect(error.message).toBe("l'email est deja pris");
    } else {
      throw error;
    }
  }
});

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assure-toi que Prisma est bien configuré dans /lib/prisma
import bcrypt from "bcryptjs"; // On utilise bcryptjs pour hasher le mot de passe
import { z } from "zod"; // Pour valider les données

// Schéma de validation avec zod
const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3, "Le pseudo doit comporter au moins 3 caractères"),
  password: z
    .string()
    .min(6, "Le mot de passe doit comporter au moins 6 caractères"),
});

// Route d'API pour l'inscription
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation des données avec Zod
    const validatedData = signupSchema.parse(body);

    const { email, username, password } = validatedData;

    // Vérifie si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Cet email est déjà utilisé." },
        { status: 400 }
      );
    }

    // Vérifie si le pseudo existe déjà
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { message: "Ce pseudo est déjà pris." },
        { status: 400 }
      );
    }

    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crée un nouvel utilisateur sans affecter de variable à l'utilisateur créé
    await prisma.user.create({
      data: {
        email,
        username,
        nickname: username, // Utilise le pseudo comme valeur par défaut pour nickname
        password: hashedPassword,
      },
    });

    // Réponse de succès
    return NextResponse.json(
      { message: "Utilisateur créé avec succès !" },
      { status: 201 }
    );
  } catch (error) {
    // Si une erreur survient
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: "Erreur lors de la création de l'utilisateur",
          error: error.message, // Affichage de l'erreur
        },
        { status: 500 }
      );
    } else {
      // Si l'erreur n'est pas de type Error
      return NextResponse.json(
        {
          message: "Erreur inconnue lors de la création de l'utilisateur",
          error: "Une erreur inconnue est survenue.",
        },
        { status: 500 }
      );
    }
  }
}

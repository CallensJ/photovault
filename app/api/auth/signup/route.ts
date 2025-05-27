import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcryptjs"; 
import { z } from "zod"; 

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



    // Vérifie si email existe deja
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Cet email est déjà utilisé." },
        { status: 400 }
      );
    }

    // Verifie si le pseudo existe deja
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

    // Cree un nouvel utilisateur sans affecter de variable à l'utilisateur cree
    await prisma.user.create({
      data: {
        email,
        username,
        nickname: username, 
        password: hashedPassword,
      },
    });

    // Réponse de succes
    return NextResponse.json(
      { message: "Utilisateur créé avec succès !" },
      { status: 201 }
    );
  } catch (error) {
    // si erreur
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: "Erreur lors de la création de l'utilisateur",
          error: error.message, 
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

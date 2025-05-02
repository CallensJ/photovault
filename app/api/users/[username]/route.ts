// app/api/users/[username]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adapte ce chemin selon ton projet

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        nickname: true, // Remplacer `name` par `nickname` ici
        avatar: true,   // Si tu veux aussi l'avatar de l'utilisateur
        description: true,      // Utiliser les champs définis dans ton modèle
        city: true,
        country: true,
        photos: {
          select: {
            id: true,
            url: true,
            title: true,
            description: true,
            isPremium: true, // Inclure `isPremium`
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[API ERROR]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

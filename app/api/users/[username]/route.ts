// app/api/users/[username]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  // Maintenant, nous attendons correctement la résolution de params
  const { username } = await params; // Nous attendons explicitement les params

  try {
    if (!username) {
      return NextResponse.json({ error: "Nom d'utilisateur manquant" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        nickname: true, 
        avatar: true,
        description: true,      
        city: true,
        country: true,
        photos: {
          select: {
            id: true,
            url: true,
            title: true,
            description: true,
            isPremium: true,
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

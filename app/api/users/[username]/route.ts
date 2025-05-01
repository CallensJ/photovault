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
      include: {
        photos: true, // assure-toi que cette relation existe dans ton schéma Prisma
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

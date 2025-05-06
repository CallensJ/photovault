// gere les photos likees 

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";  // Assure-toi que prisma est bien configuré
//  récupére toutes les photos qu'un utilisateur a likées, en fonction de son username.

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  const username = params.username;

  // Vérifier si l'utilisateur existe
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true }, // Tu peux sélectionner plus de champs si nécessaire
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
  }

  // Récupérer les photos likées par l'utilisateur
  const likedPhotos = await prisma.photoLike.findMany({
    where: {
      userId: user.id,
    },
    include: {
      photo: {
        select: {
          id: true,
          url: true,
          title: true,
        },
      },
    },
  });

  // On renvoie uniquement les informations de photo
  return NextResponse.json(likedPhotos.map(item => item.photo));
}

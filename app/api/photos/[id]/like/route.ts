import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 
//  gère l'ajout d'un "like" à une photo spécifique, en fonction de l'ID de la photo passée dans l'URL.

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { userEmail } = await req.json();

    if (!id || !userEmail) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    // Assure-toi que la photo existe dans la base de données
    const photo = await prisma.photography.findUnique({
      where: { id },
    });

    if (!photo) {
      return new NextResponse('Photo not found', { status: 404 });
    }

    // Ajoute le like (vérifie que l'utilisateur n'a pas déjà liké)
    await prisma.photoLike.create({
      data: {
        user: { connect: { email: userEmail } },
        photo: { connect: { id } },
      },
    });
    // Met à jour le nombre de likes dans la photo
    await prisma.photography.update({
      where: { id },
      data: { likes: photo.likes + 1 },
    });

    return NextResponse.json({ likes: photo.likes + 1 }); // Réponse avec le nombre mis à jour de likes
  } catch (error) {
    console.error('Erreur lors de la gestion du like:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// /app/api/users/[username]/liked-photos/route.ts

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  const { username } = params;

  if (!username) {
    return new NextResponse("Nom d'utilisateur manquant", { status: 400 });
  }

  try {
    // Utilise correctement Prisma pour récupérer les photos likées par l'utilisateur
    const likedPhotos = await prisma.photoLike.findMany({
      where: {
        user: {
          username: username, // Assure-toi que ton modèle 'User' contient bien un champ 'username'
        },
      },
      include: {
        photo: true, // Inclure les informations sur la photo
      },
    });

    if (likedPhotos.length === 0) {
      return new NextResponse("Aucune photo likée trouvée", { status: 404 });
    }

    // On renvoie les données des photos likées
    const photos = likedPhotos.map((like) => like.photo);

    return new NextResponse(JSON.stringify(photos), { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des photos likées:", error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
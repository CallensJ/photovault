import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // adapte le chemin si nécessaire

// GET – vérifier si l'utilisateur a liké cette photo
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const photoId = params.id;
    const userEmail = req.nextUrl.searchParams.get('userEmail');
  
    if (!userEmail) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }
  
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
  
    console.log('Recherche du like pour la photoId:', photoId);  // Ajoute un log
  
    const existingLike = await prisma.photoLike.findUnique({
      where: {
        userId_photoId: {
          userId: user.id,
          photoId,
        },
      },
    });
  
    if (!existingLike) {
      console.log('Aucun like trouvé pour cette photo par cet utilisateur');
    }
  
    return NextResponse.json({ liked: !!existingLike });
  }



// POST – liker une photo
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const photoId = params.id;
  const { userEmail } = await req.json();

  console.log('Photo ID:', photoId);  // Ajout d'un log pour vérifier l'id de la photo
  console.log('User Email:', userEmail);  // Vérifie également l'email

  if (!userEmail) {
    return NextResponse.json({ error: 'Email requis' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
  }

  try {
    await prisma.photoLike.create({
      data: {
        userId: user.id,
        photoId,
      },
    });

    await prisma.photography.update({
      where: { id: photoId },
      data: { likes: { increment: 1 } },
    });

    return NextResponse.json({ liked: true });
  } catch (err) {
    // En cas de doublon (déjà liké), on ignore
    return NextResponse.json({ liked: true });
  }
}

// DELETE – unliker une photo
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const photoId = params.id;
  const { userEmail } = await req.json();

  if (!userEmail) {
    return NextResponse.json({ error: 'Email requis' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
  }

  try {
    await prisma.photoLike.delete({
      where: {
        userId_photoId: {
          userId: user.id,
          photoId,
        },
      },
    });

    await prisma.photography.update({
      where: { id: photoId },
      data: { likes: { decrement: 1 } },
    });

    return NextResponse.json({ liked: false });
  } catch (err) {
    // Ignore s'il n'y avait pas de like à retirer
    return NextResponse.json({ liked: false });
  }
}

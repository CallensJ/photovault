import {NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 


//  gere l'ajout d'un "like" a une photo specifique, en fonction de l'id de la photo passee dans l'URL.

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { userEmail } = await req.json();

    if (!id || !userEmail) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    // verifie que la photo existe dans la bdd
    const photo = await prisma.photography.findUnique({
      where: { id },
    });

    //si photo pas trouvee then error 404

    if (!photo) {
      return new NextResponse('Photo not found', { status: 404 });
    }

    // Ajoute le like (verifie si user a deja like la photo ou non)
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



//verifie si l'user a deja like une photo.
export async function GET(req: Request, { params }: { params: { id: string } }) {
  //recup l'id
  const { id } = params;
  const url = new URL(req.url);
  const userEmail = url.searchParams.get("userEmail");

  //verifie si id de la photo ,useremail
  if (!id || !userEmail) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  //check dans la bdd si le like existe
  //https://github.com/prisma/prisma/discussions/12642
  try {
    const existingLike = await prisma.photoLike.findFirst({
      where: {
        user: { email: userEmail },
        photo: { id },
      },
    });


    return NextResponse.json({ liked: !!existingLike });
  } catch (error) {
    console.error("Erreur de coonection:", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}



// unlike une photo ( Delete )
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { userEmail } = await req.json();

    if (!id || !userEmail) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    // Vérifie si le like existe
    const existingLike = await prisma.photoLike.findFirst({
      where: {
        user: { email: userEmail },
        photo: { id },
      },
    });

    if (!existingLike) {
      return new NextResponse('Like non trouvé', { status: 404 });
    }

    // Supprime le like
    await prisma.photoLike.delete({
      where: {
        id: existingLike.id,
      },
    });

    // Met à jour le nombre de likes de la photo
    const photo = await prisma.photography.findUnique({ where: { id } });
    if (!photo) {
      return new NextResponse('photo non trouvee', { status: 404 });
    }

    const updatedPhoto = await prisma.photography.update({
      where: { id },
      data: {
        likes: Math.max(photo.likes - 1, 0), // pour éviter les likes négatifs
      },
    });

    return NextResponse.json({ likes: updatedPhoto.likes });
  } catch (error) {
    console.error('erreur lors du unlike :', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

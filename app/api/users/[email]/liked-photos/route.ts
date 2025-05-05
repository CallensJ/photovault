import { NextResponse } from "next/server";

const usersLikedPhotos: Record<string, Set<string>> = {}; // email → Set of photoIds

// Récupérer les photos likées par un utilisateur
export async function GET(req: Request, { params }: { params: { email: string } }) {
  const email = params.email;
  const likedPhotos = usersLikedPhotos[email] || [];
  return NextResponse.json(likedPhotos);
}

// Ajouter une photo aux photos likées de l'utilisateur
export async function POST(req: Request, { params }: { params: { email: string } }) {
  const email = params.email;
  const { photoId } = await req.json();
  
  if (!usersLikedPhotos[email]) {
    usersLikedPhotos[email] = new Set();
  }

  usersLikedPhotos[email].add(photoId);

  return NextResponse.json({ success: true });
}

// Retirer une photo des photos likées de l'utilisateur
export async function DELETE(req: Request, { params }: { params: { email: string } }) {
  const email = params.email;
  const { photoId } = await req.json();
  
  if (usersLikedPhotos[email]) {
    usersLikedPhotos[email].delete(photoId);
  }

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";

const likesDB: Record<string, Set<string>> = {}; // photoId → Set of userEmails

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;  // params est déjà synchronisé ici
  const { userEmail } = await req.json();

  if (!likesDB[id]) likesDB[id] = new Set();
  likesDB[id].add(userEmail);

  return NextResponse.json({ liked: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Modifie l'accès aux params ici, cela peut être la source de ton erreur.
  const id = params.id;  // Pas besoin de await ici, car params.id est déjà prêt

  const { userEmail } = await req.json();

  // Si l'ID existe dans le likesDB, on supprime l'utilisateur.
  likesDB[id]?.delete(userEmail);

  return NextResponse.json({ liked: false });
}

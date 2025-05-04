import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const photoId = params.id;

  try {
    await prisma.photography.update({
      where: { id: photoId },
      data: {
        downloads: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ message: "Download enregistré" }, { status: 200 });
  } catch (error) {
    console.error("Erreur en enregistrant le téléchargement :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

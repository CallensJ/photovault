import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma"; // Assure-toi que prisma est bien importé
import { existsSync } from "fs";

// Cette route prend l'id du fichier (UUID)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // Chercher le nom de fichier dans la base de données
  const photo = await prisma.photography.findUnique({
    where: { id: id }, // Assure-toi que la colonne 'id' dans la table correspond bien à l'UUID
  });

  if (!photo) {
    return NextResponse.json({ error: 'Image non trouvée dans la base de données' }, { status: 404 });
  }

  const imageFilename = photo.url.split('/').pop(); // Récupère le nom du fichier depuis l'URL stockée dans la base de données (par exemple, "1746364698697-F45GGDS3.jpeg")

  // Vérification si imageFilename est défini
  if (!imageFilename) {
    return NextResponse.json({ error: 'Nom de fichier non trouvé dans l\'URL de l\'image' }, { status: 404 });
  }

  const imagePath = path.join(process.cwd(), 'app/uploads/images/user-uploads', imageFilename); // Chemin complet du fichier image

  // Vérifier si l'image existe
  if (!existsSync(imagePath)) {
    return NextResponse.json({ error: 'Image non trouvée sur le serveur' }, { status: 404 });
  }

  // Lire le fichier image
  try {
    const file = await fs.promises.readFile(imagePath);

    // Déterminer l'extension du fichier pour définir le type de contenu
    const ext = path.extname(imageFilename).toLowerCase(); // Ici imageFilename est garanti d'être une chaîne de caractères
    const contentTypeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
    };

    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    // Retourner l'image avec les bons headers
    return new Response(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // 1 an de cache
      },
    });
  } catch (error) {
    console.error("Erreur de lecture de l'image :", error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import formidable, { File } from "formidable";
import path from "path";
import fs from "fs";
import { Readable } from "stream";
import { IncomingMessage } from "http";

// Pas nécessaire ici (App Router n’utilise pas `api.bodyParser`) mais gardé pour info
export const config = {
  api: {
    bodyParser: false,
  },
};

// Convertir une Request Web en IncomingMessage pour formidable
function webRequestToNodeRequest(req: Request): IncomingMessage {
  const reader = req.body?.getReader();
  if (!reader) {
    throw new Error("Request body is missing or not readable.");
  }

  // Créer un stream de lecture basé sur les données du corps de la requête
  const stream = new Readable({
    async read() {
      while (true) {
        const { done, value } = await reader.read(); // Lire les données en chunks
        if (done) break; // Fin de stream
        this.push(value); // Push chunk dans le stream
      }
      this.push(null); // Signaler la fin du stream
    }
  });

  // Ajouter les informations du req originel (headers, method, url) à notre stream
  const nodeReq = Object.assign(stream, {
    headers: Object.fromEntries(req.headers),
    method: req.method,
    url: req.url,
  });

  // Retourner l'IncomingMessage, prêt pour être utilisé par formidable
  return nodeReq as IncomingMessage;
}

// GET — infos utilisateur
export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  if (!username) {
    return NextResponse.json({ error: "Nom d'utilisateur manquant" }, { status: 400 });
  }

  try {
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
    console.error("[GET USER ERROR]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST — upload avatar
export async function POST(
  req: Request,
  context: { params: { username: string } }
) {
  const { params } = context;
  const username = params?.username;  // On accède ici à `params.username`
  
  if (!username) {
    return NextResponse.json({ error: "Nom d'utilisateur manquant" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "images", "avatars");
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    filter: (part) => part.mimetype?.startsWith("image/") || false,
  });

  try {
    // Convertir la requête web en format Node pour formidable
    const nodeReq = webRequestToNodeRequest(req);

    // Traiter le formulaire
    const { files } = await new Promise<{ files: formidable.Files }>((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ files });
      });
    });

    const avatarFile = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar;
    
    if (!avatarFile || !(avatarFile as File).newFilename) {
      return NextResponse.json({ error: "Fichier invalide" }, { status: 400 });
    }

    const avatarPath = `/images/avatars/${(avatarFile as File).newFilename}`;

    await prisma.user.update({
      where: { username },
      data: { avatar: avatarPath },
    });

    return NextResponse.json({ message: "Avatar mis à jour", avatarPath });
  } catch (error) {
    console.error("[UPLOAD ERROR]", error);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}

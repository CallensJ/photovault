import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import formidable, { File } from "formidable";
import path from "path";
import fs from "fs";
import { Readable } from "stream";
import { IncomingMessage } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

function webRequestToNodeRequest(req: Request): IncomingMessage {
  const reader = req.body?.getReader();
  if (!reader) {
    throw new Error("Request body is missing or not readable.");
  }

  const stream = new Readable({
    async read() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break; // Fin de stream
        this.push(value);
      }
      this.push(null);
    },
  });

  const nodeReq = Object.assign(stream, {
    headers: Object.fromEntries(req.headers),
    method: req.method,
    url: req.url,
  });

  return nodeReq as IncomingMessage;
}

// GET — infos utilisateur
export async function GET(
  req: Request,
  context: { params: { username: string } }
) {
  const { username } = context.params;
  if (!username) {
    return NextResponse.json(
      { error: "Nom d'utilisateur manquant" },
      { status: 400 }
    );
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
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
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
  // const { params } = context;
  const { username } = context.params;


  if (!username) {
    return NextResponse.json(
      { error: "Nom d'utilisateur manquant" },
      { status: 400 }
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "images", "avatars");

  fs.mkdirSync(uploadDir, { recursive: true });
  //upload de fichier
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
    const { files } = await new Promise<{ files: formidable.Files }>(
      (resolve, reject) => {
        form.parse(nodeReq, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ files });
        });
      }
    );

    const avatarFile = Array.isArray(files.avatar)
      ? files.avatar[0]
      : files.avatar;

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
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}

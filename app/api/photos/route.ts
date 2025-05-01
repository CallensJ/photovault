import { NextResponse, NextRequest } from "next/server";
import { writeFile, readFile, ensureDir } from "fs-extra"; // Utiliser fs-extra
import { join } from "path";
import formidable from "formidable";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { IncomingMessage } from "http";
import { Socket } from "net";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET() {
  const photos = await prisma.photography.findMany({
    include: { categories: true },
  });
  return NextResponse.json(photos);
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.email) {
    console.error("Token invalide ou email manquant");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const webStream = req.body as ReadableStream<Uint8Array>;
  const nodeStream = new Readable();
  nodeStream._read = () => {};

  const reader = webStream.getReader();

  const pump = async () => {
    const { done, value } = await reader.read();
    if (done) {
      nodeStream.push(null);
      return;
    }
    nodeStream.push(value);
    pump();
  };

  pump().catch((err) => nodeStream.emit('error', err));

  const incomingMessage = new IncomingMessage(new Socket());
  incomingMessage.headers = Object.fromEntries(req.headers.entries());
  incomingMessage.url = req.url;

  const form = formidable({
    multiples: false,
    uploadDir: "./public/images/user-uploads",
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  return new Promise((resolve, reject) => {
    form.parse(incomingMessage, async (err, fields, files) => {
      if (err) {
        return reject(
          NextResponse.json({ error: "Erreur lors du parsing du formulaire" }, { status: 400 })
        );
      }

      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const categoriesRaw = Array.isArray(fields.categories) ? fields.categories[0] : fields.categories;
      const file = files.image ? (Array.isArray(files.image) ? files.image[0] : files.image) : undefined;
      const isPremium = fields.isPremium && fields.isPremium[0] === 'true';

      if (!title || !file) {
        return reject(
          NextResponse.json({ error: "Titre ou image manquant" }, { status: 400 })
        );
      }

      const filename = `${Date.now()}-${file.originalFilename}`;
      const filepath = join(process.cwd(), "public/images/user-uploads", filename);

      try {
        await ensureDir(join(process.cwd(), "public/images/user-uploads")); // Assurez-vous que le répertoire existe
        const bufferData = await readFile(file.filepath);
        await writeFile(filepath, bufferData);
      } catch (error) {
        console.error("Erreur lors de l'écriture du fichier", error);
        return reject(
          NextResponse.json({ error: "Erreur lors de la lecture ou de l'écriture du fichier" }, { status: 500 })
        );
      }

      const categoryNames = categoriesRaw
        ? categoriesRaw.split(",").map((c) => c.trim()).filter(Boolean)
        : [];

      const categoryRecords = await Promise.all(
        categoryNames.map((name) =>
          prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
          })
        )
      );

      const user = await prisma.user.findUnique({
        where: { email: token.email as string },
      });

      if (!user) {
        return reject(
          NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
        );
      }

      const photo = await prisma.photography.create({
        data: {
          title,
          description,
          url: `/images/user-uploads/${filename}`,
          userId: user.id,
          isPremium,  // Assurez-vous d'inclure le champ premium
          categories: {
            connect: categoryRecords.map((cat) => ({ id: cat.id })),
          },
        },
      });

      return resolve(NextResponse.json(photo, { status: 201 }));
    });
  });
}

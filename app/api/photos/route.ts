import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getToken } from "next-auth/jwt";


export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString() || "";
  const categoriesRaw = formData.get("categories")?.toString() || "";
  const isPremium = formData.get("isPremium") === "true";
  const image = formData.get("image") as File;

  if (!title || !image) {
    return NextResponse.json({ error: "Titre ou image manquant" }, { status: 400 });
  }

  const buffer = Buffer.from(await image.arrayBuffer());
  const filename = `${Date.now()}-${image.name}`;
  const folderPath = join(process.cwd(), "public/images/user-uploads");
  const filePath = join(folderPath, filename);

  await mkdir(folderPath, { recursive: true });
  await writeFile(filePath, buffer);

  const categoryNames = categoriesRaw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

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
    where: { email: token.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const photo = await prisma.photography.create({
    data: {
      title,
      description,
      url: `/images/user-uploads/${filename}`,
      userId: user.id,
      isPremium,
      categories: {
        connect: categoryRecords.map((cat) => ({ id: cat.id })),
      },
    },
  });

  return NextResponse.json(photo, { status: 201 });
}

export async function GET() {
  const photos = await prisma.photography.findMany({
    where: {
      isPremium: false, // 💡 n'affiche que les non-premium
    },
    include: {
      user: true,
      categories: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(photos);
}

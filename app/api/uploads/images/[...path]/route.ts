import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import mime from 'mime';

export async function GET(
  req: NextRequest,
  context: { params: { path: string[] } }
) {

  //recupere variable PATH
  const { params } = context; 
  console.log("API HIT:", params.path);

  //verifie le chemin, if aucun chemin then error 400. 
  if (!params.path || params.path.length === 0) {
    return new NextResponse('image path is missing', { status: 400 });
  }

  //si chemin existe  on join avec /app/uploads/images/
  const imagePath = path.join(
    process.cwd(),
    'app',
    'uploads',
    'images',
    ...params.path
  );
  // console.log('Resolved image path:', imagePath);

  //si fichier existe pas then error 404
  if (!fs.existsSync(imagePath)) {
    return new NextResponse('Image not found', { status: 404 });
  }

  //lecture du fichier en memoire(buffer) et on deduit le type ( MIME)
  const fileBuffer = fs.readFileSync(imagePath);
  const contentType = mime.getType(imagePath) || 'application/octet-stream';

  //retourne 
  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': fileBuffer.length.toString(),
    },
  });
}

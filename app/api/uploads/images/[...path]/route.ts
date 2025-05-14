import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import mime from 'mime';

export async function GET(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  const { params } = context; 
  console.log("API HIT:", params.path);

  if (!params.path || params.path.length === 0) {
    return new NextResponse('Image path is missing', { status: 400 });
  }

  const imagePath = path.join(
    process.cwd(),
    'app',
    'uploads',
    'images',
    ...params.path
  );
  console.log('Resolved image path:', imagePath);

  if (!fs.existsSync(imagePath)) {
    return new NextResponse('Image not found', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(imagePath);
  const contentType = mime.getType(imagePath) || 'application/octet-stream';

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': fileBuffer.length.toString(),
    },
  });
}

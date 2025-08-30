import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'legal', 'notice-legale.md');
    const content = fs.readFileSync(filePath, 'utf8');
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Erreur lecture notice:', error);
    return NextResponse.json(
      { error: 'Notice légale non trouvée' }, 
      { status: 404 }
    );
  }
}
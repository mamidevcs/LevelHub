import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Tüm etiketleri getirir
export async function GET() {
  const tags = await prisma.tag.findMany();
  return NextResponse.json(tags);
}

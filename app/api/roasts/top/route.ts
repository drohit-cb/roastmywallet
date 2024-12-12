import { NextResponse } from 'next/server';
import { Database } from '../../../../lib/db';
import { baseSepolia } from 'viem/chains';

export async function GET() {
    try {
        const db = new Database(process.env.DATABASE_URL);

        const roasts = await db.getTopRoasts(baseSepolia.name);
        return NextResponse.json(roasts);
    } catch (error) {
        console.error('Failed to fetch top roasts:', error);
        return NextResponse.json({ error: 'Failed to fetch roasts' }, { status: 500 });
    }
} 
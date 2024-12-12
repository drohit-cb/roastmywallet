import { NextResponse } from 'next/server';
import { Database } from '../../../../lib/db';
import { baseSepolia } from 'viem/chains';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;

    try {
        const db = new Database();
        const [roasts, total] = await Promise.all([
            db.getTopRoasts(baseSepolia.name, page, limit),
            db.getTotalRoasts(baseSepolia.name)
        ]);

        return NextResponse.json({
            roasts,
            hasMore: page * limit < total
        });
    } catch (error) {
        console.error('Failed to fetch roasts:', error);
        return NextResponse.json({ error: 'Failed to fetch roasts' }, { status: 500 });
    }
}
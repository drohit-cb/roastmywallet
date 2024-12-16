import { NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { baseSepolia } from 'viem/chains';

export async function GET(
    _request: Request,
    context: { params: Promise<{ address: string }> }
) {
    try {
        const { address } = await context.params;

        if (!address) {
            return NextResponse.json({
                error: 'Address parameter is required'
            }, {
                status: 400
            });
        }

        const db = new Database();
        const roasts = await db.getRoastsByWallet(baseSepolia.name, address);

        return NextResponse.json({ roasts });
    } catch (error) {
        console.error('Failed to fetch roasts:', error);
        return NextResponse.json({
            error: 'Failed to fetch roasts',
            details: error instanceof Error ? error.message : String(error)
        }, {
            status: 500
        });
    }
} 
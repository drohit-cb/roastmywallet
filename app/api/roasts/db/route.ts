import { NextResponse } from 'next/server';
import { Database } from '@/lib/db';

export async function POST(req: Request) {
    const db = new Database();
    const { type, data } = await req.json();

    try {
        switch (type) {
            case 'mint':
                await db.upsertRoast({
                    token_id: data.tokenId,
                    network: data.network,
                    wallet_address: data.wallet,
                    roast_text: data.text,
                    block_timestamp: new Date().toISOString()
                });
                break;

            case 'like':
                await Promise.all([
                    db.incrementLikes(data.network, data.tokenId),
                    db.trackLiker(data.network, data.tokenId, data.liker)
                ]);
                break;
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DB update failed:', error);
        return NextResponse.json({ error: 'Failed to update DB' }, { status: 500 });
    }
} 
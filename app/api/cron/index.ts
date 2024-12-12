import { NextResponse } from 'next/server';
import { indexNewBlocks } from '../../../lib/indexer/worker';

// Only allow Vercel cron to trigger this
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    const config = {
        databaseUrl: process.env.DATABASE_URL!,
        rpcUrl: process.env.BASE_SEPOLIA_RPC_URL!,
    };

    await indexNewBlocks(config);
    return NextResponse.json({ success: true });
} 
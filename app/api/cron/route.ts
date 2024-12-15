import { NextResponse } from 'next/server';
import { indexNewBlocks } from '../../../lib/indexer/worker';

// Only allow Vercel cron to trigger this
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    console.log('Cron job triggered');

    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.error('Unauthorized cron attempt:', authHeader);
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const config = {
            databaseUrl: process.env.DATABASE_URL!,
            rpcUrl: process.env.BASE_SEPOLIA_RPC_URL!,
        };

        await indexNewBlocks(config);
        console.log('Indexing complete');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Cron job failed:', error);
        return NextResponse.json({ error: 'Indexing failed' }, { status: 500 });
    }
} 
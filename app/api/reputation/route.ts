import { NextResponse } from 'next/server';
import { CDPClient } from '../../../lib/cdp';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');
    const network = searchParams.get('network');

    if (!address || !network) {
        return NextResponse.json({ error: 'Missing address or network' }, { status: 400 });
    }

    try {
        const cdp = new CDPClient();
        const reputation = await cdp.getWalletReputation(network, address);
        return NextResponse.json(reputation);
    } catch (error) {
        console.error('CDP API error:', error);
        return NextResponse.json({ error: 'Failed to fetch reputation' }, { status: 500 });
    }
} 
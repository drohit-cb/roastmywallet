/* eslint-disable @typescript-eslint/no-unused-vars */

import { generateRoastForWallet } from '../../../../lib/services/roast';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { address, network } = await req.json();
    const { roast } = await generateRoastForWallet(address, network);
    return NextResponse.json({ roast });
  } catch (error) {
    console.error('Roast generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate roast' }, { status: 500 });
  }
} 
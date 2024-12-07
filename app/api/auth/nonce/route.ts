import { getIronSession } from 'iron-session';
import { generateNonce } from 'siwe';
import { cookies } from 'next/headers';
import { ironOptions } from '@/app/config/iron-session';
import { SessionData } from '@/types/session';

export async function GET() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, ironOptions);
  
  session.nonce = generateNonce();
  await session.save();
  
  return new Response(session.nonce);
} 
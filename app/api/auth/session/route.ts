import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { ironOptions } from '@/app/config/iron-session';
import { SessionData } from '@/types/session';

export async function GET() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, ironOptions);

  return Response.json({
    isValid: !!session.siwe
  });
} 
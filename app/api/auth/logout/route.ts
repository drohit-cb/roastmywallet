import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { ironOptions } from '@/app/config/iron-session';
import { SessionData } from '@/types/session';

export async function POST() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, ironOptions);
  
  session.destroy();
  
  return Response.json({ ok: true });
}
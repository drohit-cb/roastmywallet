import { createPublicClient, http } from 'viem'
import { mainnet, base, Chain } from 'viem/chains'
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SiweMessage } from 'siwe';
import { ironOptions } from '@/app/config/iron-session';
import { SessionData } from '@/types/session';

function getChainById(chainId: number): Chain | undefined {
  if (chainId === 1) {
    return {
      ...mainnet,
      rpcUrls: {
        ...mainnet.rpcUrls,
        default: {
          http: [process.env.MAINNET_RPC_URL!]
        }
      }
    }
  }

  const supportedChains: Record<number, Chain> = {
    [base.id]: base,
  }
  
  return supportedChains[chainId];
}

export async function POST(req: Request) {
  try {
    const { chainId, address, message, signature } = await req.json();
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, ironOptions);

    // First verify message with viem
    const chain = getChainById(chainId);
    if (!chain) {
      return Response.json({ ok: false, error: 'Unsupported chain' });
    }

    const publicClient = createPublicClient({
      chain: chain,
      transport: http(),
    })

    const isValid = await publicClient.verifyMessage({
      address: address as `0x${string}`,
      message: message,
      signature: signature as `0x${string}`,
    })

    if (isValid) {
      // Parse and save SIWE message
      const siweMessage = new SiweMessage(message);
      session.siwe = siweMessage;
      await session.save();
    }

    return Response.json({ ok: isValid });
  } catch (error) {
    console.error('Verification error:', error);
    return Response.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : 'Invalid signature' 
    });
  }
} 
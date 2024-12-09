import { WalletStats } from '@/lib/mockWalletStats';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { walletStats } = await req.json();
    const prompt = createPrompt(walletStats);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a witty crypto expert who creates funny roasts about wallet activity. Keep responses short, funny, and reference specific details from their wallet."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    const roast = completion.choices[0].message.content;
    return NextResponse.json({ roast });
    
  } catch (error) {
    console.error('Roast generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate roast' },
      { status: 500 }
    );
  }
}

function createPrompt(stats: WalletStats): string {
  return `Generate a funny and creative roast for a crypto wallet based on these stats:

Ethereum:
- Balance: ${stats.eth.balance} ETH
- NFTs: ${stats.eth.nftCount}
- Failed Transactions: ${stats.eth.failedTxCount}
- Dust Tokens: ${stats.eth.dustTokenCount}
- Top Tokens: ${stats.eth.topTokens.map(t => `${t.balance} ${t.symbol}`).join(', ')}

Base:
- Balance: ${stats.base.balance} ETH
- NFTs: ${stats.base.nftCount}
- Transactions: ${stats.base.transactionCount}

The roast should be:
- Funny but not mean-spirited
- Reference specific details from their wallet
- One or two sentences maximum
- Creative and original
- Crypto-themed

Generate a roast:`;
} 
import { OpenAI } from 'openai';
import { CDPClient } from '../cdp';

export async function generateRoastForWallet(address: string, network: string) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const cdp = new CDPClient();
    const reputation = await cdp.getWalletReputation(network, address);

    const prompt = `Generate a funny roast for a crypto wallet with these stats:
- Total transactions: ${reputation.metadata.total_transactions || 'unknown'}
- Active days: ${reputation.metadata.unique_days_active || 'unknown'}
- Longest streak: ${reputation.metadata.longest_active_streak || 'unknown'} days
- Token swaps: ${reputation.metadata.token_swaps_performed || 'unknown'}
- Bridge transactions: ${reputation.metadata.bridge_transactions_performed || 'unknown'}
- Smart contracts deployed: ${reputation.metadata.smart_contract_deployments || 'unknown'}`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a witty crypto expert who creates funny roasts about wallet activity."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        max_tokens: 100,
        temperature: 0.8,
    });

    return {
        reputation,
        roast: completion.choices[0].message.content
    };
} 
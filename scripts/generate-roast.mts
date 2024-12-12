import { config } from 'dotenv';
import { join } from 'path';
import { generateRoastForWallet } from '../lib/services/roast';

console.log('Generating roast...');

async function roast(address: string, network: string) {
    try {
        // Load environment variables from .env.local
        const envPath = join(process.cwd(), '.env.local');
        console.log('Loading environment variables from:', envPath);
        config({ path: envPath });

        if (!process.env.OPENAI_API_KEY) {
            throw new Error('Missing OPENAI_API_KEY environment variable');
        }
        if (!process.env.CDP_KEY_NAME || !process.env.CDP_KEY_SECRET) {
            throw new Error('Missing CDP credentials in environment variables');
        }

        console.log(`Generating roast for ${address} on ${network}...`);
        const { reputation, roast } = await generateRoastForWallet(address, network);

        console.log('\nWallet Stats:');
        console.log(JSON.stringify(reputation, null, 2));
        console.log('\nRoast:');
        console.log(roast);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Get command line arguments
const address = process.argv[2];
const network = process.argv[3] || 'base-mainnet';

if (!address) {
    console.log('Usage: yarn roast <address> [network]');
    console.log('Example: yarn roast 0x123... base-sepolia');
    process.exit(1);
}

roast(address, network);
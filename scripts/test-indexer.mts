import { config } from 'dotenv';
import { join } from 'path';
import { indexNewBlocks } from '../lib/indexer/worker';

async function main() {
    try {
        // Load environment variables
        const envPath = join(process.cwd(), '.env.local');
        console.log('Loading environment variables from:', envPath);
        config({ path: envPath });

        // Check required env vars
        const required = ['DATABASE_URL', 'BASE_SEPOLIA_RPC_URL', 'INITIAL_BLOCK'] as const;
        for (const key of required) {
            if (!process.env[key]) {
                throw new Error(`Missing required env var: ${key}`);
            }
        }

        console.log('Starting test indexer...');
        await indexNewBlocks({
            databaseUrl: process.env.DATABASE_URL!,
            rpcUrl: process.env.BASE_SEPOLIA_RPC_URL!,
            startFromBlock: BigInt(process.env.INITIAL_BLOCK!)
        });
        console.log('Indexing complete');
        process.exit(0);
    } catch (error) {
        console.error('Indexer failed:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

main(); 
import { config } from 'dotenv';
import { join } from 'path';
import { migrate } from '../lib/db/migrate';

async function main() {
    try {
        // Load environment variables from .env.local
        const envPath = join(process.cwd(), '.env.local');
        console.log('Loading environment variables from:', envPath);
        config({ path: envPath });

        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            throw new Error('DATABASE_URL not found in .env.local');
        }

        await migrate({ databaseUrl });
        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

// Run the migration
main(); 
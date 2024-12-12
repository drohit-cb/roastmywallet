import { neon } from '@neondatabase/serverless';

// Helper to get database connection
const getDb = () => neon(process.env.DATABASE_URL!);

export async function up() {
    const sql = getDb();

    await sql`
        CREATE TABLE IF NOT EXISTS indexer_state (
            network VARCHAR(20) PRIMARY KEY,
            last_processed_block BIGINT NOT NULL DEFAULT 0,
            last_run_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await sql`
        INSERT INTO indexer_state (network, last_processed_block, last_run_time)
        VALUES 
            ('base-sepolia', 18982382, CURRENT_TIMESTAMP),
            ('base-mainnet', 23578265, CURRENT_TIMESTAMP)
        ON CONFLICT (network) DO NOTHING;
    `;
}

export async function down() {
    const sql = getDb();
    await sql`DROP TABLE IF EXISTS indexer_state;`;
} 
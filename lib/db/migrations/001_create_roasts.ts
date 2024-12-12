import { neon } from '@neondatabase/serverless';

// Helper to get database connection
const getDb = () => neon(process.env.DATABASE_URL!);

export async function up() {
    const sql = getDb();

    // Create table
    await sql`
        CREATE TABLE IF NOT EXISTS roasts (
            token_id BIGINT NOT NULL,
            network VARCHAR(20) NOT NULL,
            wallet_address TEXT NOT NULL,
            roast_text TEXT NOT NULL,
            likes_count INTEGER DEFAULT 0,
            block_timestamp TIMESTAMP NOT NULL,
            indexed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (network, token_id)
        );
    `;

    await sql`
        CREATE INDEX IF NOT EXISTS idx_likes_network 
        ON roasts(network, likes_count DESC);
    `;
}

export async function down() {
    const sql = getDb();

    // Drop index first
    await sql`DROP INDEX IF EXISTS idx_likes_network;`;

    // Then drop table
    await sql`DROP TABLE IF EXISTS roasts;`;
} 
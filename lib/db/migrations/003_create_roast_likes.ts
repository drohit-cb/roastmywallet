import { neon } from '@neondatabase/serverless';

const getDb = () => neon(process.env.DATABASE_URL!);

export async function up() {
    const sql = getDb();

    // Create table
    await sql`
        CREATE TABLE IF NOT EXISTS roast_likes (
            network VARCHAR(20) NOT NULL,
            roast_token_id BIGINT NOT NULL,
            liker_address TEXT NOT NULL,
            PRIMARY KEY (network, roast_token_id, liker_address)
        );
    `;

    // Create index
    await sql`
        CREATE INDEX IF NOT EXISTS idx_roast_likes_fk 
        ON roast_likes(network, roast_token_id);
    `;

    // Add foreign key
    await sql`
        ALTER TABLE roast_likes
        ADD CONSTRAINT roast_likes_roast_fkey
        FOREIGN KEY (network, roast_token_id)
        REFERENCES roasts(network, token_id);
    `;
}

export async function down() {
    const sql = getDb();

    // Drop foreign key first
    await sql`
        ALTER TABLE roast_likes
        DROP CONSTRAINT IF EXISTS roast_likes_roast_fkey;
    `;

    // Drop index
    await sql`
        DROP INDEX IF EXISTS idx_roast_likes_fk;
    `;

    // Drop table
    await sql`
        DROP TABLE IF EXISTS roast_likes;
    `;
}
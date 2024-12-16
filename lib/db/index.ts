import { neon } from '@neondatabase/serverless';

// Types
export interface Roast {
    token_id: string;
    network: string;
    wallet_address: string;
    roast_text: string;
    likes_count: number;
    block_timestamp: string;
}

export interface IndexerState {
    network: string;
    last_processed_block: number;
    last_run_time: Date;
}

// Database helper class
export class Database {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private sql: any;  // Use any for now to bypass type issues

    constructor(url?: string) {
        this.sql = neon(url || process.env.DATABASE_URL!);
    }

    // Roasts
    async upsertRoast(roast: Omit<Roast, 'likes_count' | 'indexed_at'>) {
        const result = await this.sql`
            INSERT INTO roasts (
                token_id, network, wallet_address, roast_text, block_timestamp
            ) VALUES (
                ${roast.token_id},
                ${roast.network},
                ${roast.wallet_address},
                ${roast.roast_text},
                ${roast.block_timestamp}
            )
            ON CONFLICT (network, token_id) DO UPDATE 
            SET 
                wallet_address = EXCLUDED.wallet_address,
                roast_text = EXCLUDED.roast_text,
                block_timestamp = EXCLUDED.block_timestamp;
        `;
        return result[0] as Roast;
    }

    async setLikes(network: string, tokenId: string, totalLikes: number) {
        const result = await this.sql`
            UPDATE roasts 
            SET likes_count = ${totalLikes}
            WHERE network = ${network}
            AND token_id = ${tokenId}
            RETURNING *;
        `;
        return result[0] as Roast;
    }

    async incrementLikes(network: string, tokenId: string) {
        const result = await this.sql`
            UPDATE roasts 
            SET likes_count = likes_count + 1
            WHERE network = ${network}
            AND token_id = ${tokenId}
            RETURNING *;
        `;
        return result[0] as Roast;
    }

    async getTopRoasts(network: string, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await this.sql`
            SELECT * FROM roasts
            WHERE network = ${network}
            ORDER BY likes_count DESC, block_timestamp DESC
            LIMIT ${limit} 
            OFFSET ${offset};
        `;
        return result as Roast[];
    }

    async getTotalRoasts(network: string): Promise<number> {
        const result = await this.sql`
            SELECT COUNT(*) as count FROM roasts
            WHERE network = ${network};
        `;
        return result[0].count;
    }

    async getIndexerState(network: string): Promise<IndexerState | null> {
        const result = await this.sql`
            SELECT * FROM indexer_state
            WHERE network = ${network};
        `;
        return result[0] as IndexerState || null;
    }

    async updateIndexerState(network: string, block: number) {
        const result = await this.sql`
            UPDATE indexer_state 
            SET last_processed_block = ${block},
                last_run_time = CURRENT_TIMESTAMP
            WHERE network = ${network}
            RETURNING *;
        `;
        return result[0] as IndexerState;
    }

    async trackLiker(network: string, tokenId: string, likerAddress: string) {
        await this.sql`
            INSERT INTO roast_likes (roast_token_id, network, liker_address)
            VALUES (${tokenId}, ${network}, ${likerAddress})
            ON CONFLICT (network, roast_token_id, liker_address) DO NOTHING;
        `;
    }

    async getRoast(network: string, tokenId: string): Promise<Roast | null> {
        const result = await this.sql`
            SELECT * FROM roasts
            WHERE network = ${network}
            AND token_id = ${tokenId}
            LIMIT 1;
        `;
        return result[0] as Roast || null;
    }

    async getRoastsByWallet(network: string, walletAddress: string): Promise<Roast[]> {
        try {
            const result = await this.sql`
                WITH RankedRoasts AS (
                    SELECT *,
                        ROW_NUMBER() OVER (ORDER BY likes_count DESC, block_timestamp DESC) as rank,
                        COUNT(*) OVER () as total_count
                    FROM roasts
                    WHERE network = ${network}
                )
                SELECT *
                FROM RankedRoasts
                WHERE wallet_address = ${walletAddress}
                ORDER BY likes_count DESC, block_timestamp DESC;
            `;

            return result as (Roast & { rank: number, total_count: number })[];
        } catch (error) {
            throw error;
        }
    }
}
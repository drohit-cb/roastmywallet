import { Log, AbiEvent, createPublicClient, http, parseAbiItem } from 'viem';
import { baseSepolia } from 'viem/chains';
import { Database } from '../../lib/db';
import { ROAST_NFT_ADDRESS } from '../../contracts/lib/RoastNFT';

let isIndexing = false;

interface IndexerConfig {
    databaseUrl: string;
    rpcUrl: string;
    startFromBlock?: bigint;
}

const RoastMintedEvent = parseAbiItem('event RoastMinted(uint256 tokenId, address wallet, string roastText)') as AbiEvent;
const RoastLikedEvent = parseAbiItem('event RoastLiked(uint256 indexed tokenId, address indexed liker, uint256 totalLikes)') as AbiEvent;

type RoastMintedArgs = {
    tokenId: bigint;
    wallet: string;
    roastText: string;
}

type RoastLikedArgs = {
    tokenId: bigint;
    liker: string;
    totalLikes: bigint;
}

type RoastEvent = Log<bigint, number, false, typeof RoastMintedEvent, false> & {
    args: RoastMintedArgs;
};

type LikeEvent = Log<bigint, number, false, typeof RoastLikedEvent, false> & {
    args: RoastLikedArgs;
};

async function processBlockRange(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: any,
    db: Database,
    fromBlock: bigint,
    toBlock: bigint,
    batchSize: number = 500
) {
    let current = fromBlock;
    let mintCount = 0;
    let likeCount = 0;

    while (current <= toBlock) {
        const end = current + BigInt(batchSize) > toBlock ? toBlock : current + BigInt(batchSize);

        // Get and process batch immediately
        const [mintEvents, likeEvents] = await Promise.all([
            client.getLogs({
                address: ROAST_NFT_ADDRESS,
                event: RoastMintedEvent,
                fromBlock: current,
                toBlock: end
            }),
            client.getLogs({
                address: ROAST_NFT_ADDRESS,
                event: RoastLikedEvent,
                fromBlock: current,
                toBlock: end
            })
        ]);

        // Process this batch's events
        await Promise.all([
            ...mintEvents.map(async (event: RoastEvent) => {
                if (!event.args?.tokenId || !event.args?.wallet || !event.args?.roastText) return;
                const block = await client.getBlock({ blockNumber: event.blockNumber });
                mintCount++;
                return db.upsertRoast({
                    token_id: event.args.tokenId.toString(),
                    network: baseSepolia.name,
                    wallet_address: event.args.wallet,
                    roast_text: event.args.roastText,
                    block_timestamp: new Date(Number(block.timestamp) * 1000).toISOString(),
                });
            }),
            ...likeEvents.map(async (event: LikeEvent) => {
                if (!event.args?.tokenId || !event.args?.liker) return;
                likeCount++;

                // Use totalLikes from event to update DB
                await db.setLikes(
                    baseSepolia.name,
                    event.args.tokenId.toString(),
                    Number(event.args.totalLikes)
                );

                // Track liker
                await db.trackLiker(
                    baseSepolia.name,
                    event.args.tokenId.toString(),
                    event.args.liker
                );
            })
        ].filter(Boolean));

        console.log(`Processed blocks ${current} to ${end}. Remaining: ${toBlock - end}. Mints: ${mintCount}, Likes: ${likeCount}`);
        current = end + 1n;
    }

    return { mintCount, likeCount };
}

export async function indexNewBlocks({ databaseUrl, rpcUrl, startFromBlock }: IndexerConfig) {
    if (isIndexing) {
        console.log('Indexing already in progress');
        return;
    }

    isIndexing = true;

    try {
        const db = new Database(databaseUrl);
        const client = createPublicClient({
            chain: baseSepolia,
            transport: http(rpcUrl)
        });

        // Use override if provided, otherwise get from DB
        let fromBlock: bigint;
        if (startFromBlock !== undefined) {
            fromBlock = startFromBlock;
        } else {
            const state = await db.getIndexerState(baseSepolia.name);
            fromBlock = state ? BigInt(state.last_processed_block) : BigInt(0);
            console.log(`Starting from block ${fromBlock}`);
        }

        const currentBlock = await client.getBlockNumber();
        if (fromBlock >= currentBlock) return;

        console.log(`Indexing blocks ${fromBlock} to ${currentBlock}`);

        const { mintCount, likeCount } = await processBlockRange(
            client,
            db,
            fromBlock + 1n,
            currentBlock
        );

        // Update indexer state in DB
        await db.updateIndexerState(baseSepolia.name, Number(currentBlock));

        console.log(`Indexed ${currentBlock - fromBlock} blocks. Found ${mintCount} mints and ${likeCount} likes`);

    } catch (error) {
        console.error('Indexing error:', error);
    } finally {
        isIndexing = false;
    }
}

// Update production startup
if (process.env.VERCEL_ENV === 'production') {
    console.log('Starting indexer in production...');
    const config = {
        databaseUrl: process.env.DATABASE_URL!,
        rpcUrl: process.env.BASE_SEPOLIA_RPC_URL!
        // No startFromBlock in production - always use DB state
    };
    indexNewBlocks(config);  // Run once per cron job invocation
}
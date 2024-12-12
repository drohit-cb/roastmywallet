# RoastMyWallet

A fun dApp that roasts your wallet based on your on-chain activity.

## Features
- Wallet connection using OnchainKit
- Sign-In with Ethereum (SIWE) authentication
- Iron Session for secure session management

## Tech Stack
- Next.js 15 (App Router)
- OnchainKit for wallet interactions
- SIWE for authentication
- Iron Session for session management
- TailwindCSS for styling

## Setup
1. Clone the repository

2. Install dependencies:
    ```bash
    yarn install
    ```
3. Create `.env.local`:

    NEXT_PUBLIC_ONCHAINKIT_API_KEY=<your-api-key>
    IRON_PASSWORD=<your-iron-password>
    MAINNET_RPC_URL=<your-mainnet-rpc-url>

4. Run development server:
    ```bash
    yarn dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

6. You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Deployment

Deployed on Vercel with the following environment variables:
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
- `IRON_PASSWORD`
- `MAINNET_RPC_URL`
- `NEXT_PUBLIC_BASE_URL`
- `OPENAI_API_KEY`
- `PRIVATE_KEY`
- `BASESCAN_API_KEY`

## Contract Deployment

1. Compile contract:
```bash
yarn contract:compile
```

2. Deploy to Base Sepolia:
```bash
yarn deploy:sepolia
```

3. Verify contract:
```bash
yarn verify:sepolia <DEPLOYED_CONTRACT_ADDRESS>
```

Required environment variables for deployment:
- `BASE_SEPOLIA_RPC_URL`: Base Sepolia RPC URL
- `PRIVATE_KEY`: Deployer wallet private key
- `BASESCAN_API_KEY`: For contract verification

## TODO / Next Steps

### Features
- [ ] Implement actual wallet analytics
- [ ] Sorted leaderboard based on likes. Implement a mini indexer that enables this.
- [ ] UI tags on hottest roasts, most liked roasts, etc.
- [ ] First time user tutorial, using sound and animation more better user engagement
- [ ] Ability to share a roast card from leaderboard
- [ ] NFT metadata

### Technical Improvements
- [ ] Simplify contract, add tests, comments and make it upgradable
- [ ] Add proper error handling for wallet connections

### Known Issues
- SIWE implementation needs refinement
- Better error handling needed for RPC failures

## Contributing
PRs and Issues welcome!

## Contract Interaction (Using Cast)
You can interact with the deployed contract using the following cast commands. Make sure you have [Foundry](https://book.getfoundry.sh/) installed.

### Read Functions

Get a specific roast:
```bash
cast call <CONTRACT_ADDRESS> "getRoast(uint256)(tuple(uint256,address,uint256,string,uint256))" <TOKEN_ID> --rpc-url https://sepolia.base.org
```

Get total roasts:
```bash
cast call <CONTRACT_ADDRESS> "totalRoasts()(uint256)" --rpc-url https://sepolia.base.org
```

Check if address has liked a roast:
```bash
cast call <CONTRACT_ADDRESS> "hasLiked(uint256,address)(bool)" <TOKEN_ID> <ADDRESS> --rpc-url https://sepolia.base.org
```

### Write Functions

Mint a new roast:
```bash
cast send <CONTRACT_ADDRESS> "mintRoast(string)" "your roast text here" --rpc-url https://sepolia.base.org --private-key <YOUR_PRIVATE_KEY>
```

Like a roast:
```bash
cast send <CONTRACT_ADDRESS> "likeRoast(uint256)" <TOKEN_ID> --rpc-url https://sepolia.base.org --private-key <YOUR_PRIVATE_KEY>
```

Replace:
- `<CONTRACT_ADDRESS>` with the deployed contract address
- `<TOKEN_ID>` with the ID of the roast
- `<ADDRESS>` with a wallet address to check
- `<YOUR_PRIVATE_KEY>` with your wallet's private key (never share this!)

Note: 
- Roast IDs start from 1
- Can't like your own roasts
- Can't like a roast more than once
- Need Base Sepolia testnet ETH from [Base Sepolia faucet](https://portal.cdp.coinbase.com/products/faucet)
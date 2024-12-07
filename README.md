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

## TODO / Next Steps

### Features
- [ ] Implement actual wallet analytics
- [ ] Integrate with a LLM to power roast generation
- [ ] Add NFT minting capability
- [ ] Build leaderboard for top roasts
- [ ] Add social sharing functionality

### Technical Improvements
- [ ] Add proper error handling for wallet connections
- [ ] Implement persistent sessions
- [ ] Add loading states and better UX

### Known Issues
- Session persistence needs improvement
- SIWE implementation needs refinement
- Better error handling needed for RPC failures

## Contributing
PRs and Issues welcome!
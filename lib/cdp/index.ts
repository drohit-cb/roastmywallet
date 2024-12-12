import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

interface ReputationMetadata {
    total_transactions: number;
    unique_days_active: number;
    longest_active_streak: number;
    current_active_streak: number;
    activity_period_days: number;
    token_swaps_performed: number;
    bridge_transactions_performed: number;
    lend_borrow_stake_transactions: number;
    ens_contract_interactions: number;
    smart_contract_deployments: number;
}

interface ReputationResponse {
    score: number;
    metadata: ReputationMetadata;
}

export class CDPClient {
    private readonly keyName: string;
    private readonly keySecret: string;

    constructor() {
        if (!process.env.CDP_KEY_NAME || !process.env.CDP_KEY_SECRET) {
            throw new Error('Missing CDP credentials');
        }
        this.keyName = process.env.CDP_KEY_NAME;
        this.keySecret = process.env.CDP_KEY_SECRET;
    }

    private generateJWT(method: string, path: string): string {
        const requestHost = 'api.cdp.coinbase.com';
        const uri = `${method} ${requestHost}${path}`;

        const payload = {
            iss: 'cdp',
            nbf: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 120,
            sub: this.keyName,
            uri,
        };

        const header = {
            alg: 'ES256',
            kid: this.keyName,
            nonce: crypto.randomBytes(16).toString('hex'),
        };

        return jwt.sign(payload, this.keySecret, { algorithm: 'ES256', header });
    }

    async getWalletReputation(network: string, address: string): Promise<ReputationResponse> {
        const path = `/platform/v1/networks/${network}/addresses/${address}/reputation`;
        const jwt = this.generateJWT('GET', path);

        const response = await fetch(`https://api.cdp.coinbase.com${path}`, {
            headers: {
                'Authorization': `Bearer ${jwt}`,
            },
        });

        if (!response.ok) {
            throw new Error(`CDP API error: ${response.statusText}`);
        }

        return response.json();
    }
} 
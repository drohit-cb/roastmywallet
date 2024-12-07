import { SiweMessage } from 'siwe';

export interface SessionData {
  nonce: string;
  siwe: SiweMessage;
} 
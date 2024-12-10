/**
 * Formats an Ethereum address to a shortened version for display
 * Example: 0x1234567890abcdef1234567890abcdef12345678 -> 0x1234...5678
 * 
 * @param address - The full Ethereum address to format
 * @returns The formatted address string or empty string if no address provided
 */
export function formatAddress(address: string): string {
    // Return empty string if address is falsy
    if (!address) return '';

    // Take first 6 chars (0x1234), add ..., and last 4 chars (5678)
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
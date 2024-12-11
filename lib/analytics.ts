import va from '@vercel/analytics';

type EventProperties = {
    timestamp?: string;
    roastText?: string;
    tokenId?: string;
    error?: string;
    action?: string;
};

export const trackEvent = (name: string, properties?: EventProperties) => {
    va.track(name, properties);
};

// Predefined events
export const events = {
    SIGNED_IN: 'signed_in',
    ROAST_GENERATED: 'roast_generated',
    ROAST_MINTED: 'roast_minted',
    ROAST_LIKED: 'roast_liked',
    ERROR_OCCURRED: 'error_occurred'
} as const;
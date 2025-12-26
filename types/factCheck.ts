// Fact-checking types
export interface FactCheckResult {
    overallVerdict: 'verified' | 'partially-verified' | 'unverified' | 'questionable';
    trustScore: number;
    analysis: string;
    keyClaims: {
        claim: string;
        status: 'verified' | 'unverified' | 'questionable';
        explanation: string;
    }[];
    credibleSources: {
        name: string;
        type: 'Official' | 'News Agency' | 'Research' | 'Government';
        relevance: string;
    }[];
    redFlags: string[];
    recommendations: string;
}

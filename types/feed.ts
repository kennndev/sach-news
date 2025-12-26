// Feed-related types
export interface FeedItem {
    id: number;
    type: 'text' | 'video';
    category: string;
    author: {
        name: string;
        verified: boolean;
        score: number;
        avatar: string;
    };
    timestamp: string;
    headline: string;
    summary: string;
    videoUrl?: string;
    duration?: string;
    ai_score: number;
    market: {
        question: string;
        vol: string;
        yes: number;
        no: number;
        end: string;
        totalPool: number;
    };
    comments: any[];
    bookmarked: boolean;
    engagement: {
        likes: number;
        comments: number;
        shares: number;
        views?: number;
    };
}

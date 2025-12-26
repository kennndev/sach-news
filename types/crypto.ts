// Crypto learning types
export interface CryptoModule {
    id: string;
    title: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'security';
    emoji: string;
    description: string;
    lessons: {
        id: number;
        title: string;
        duration: string;
        xp: number;
        content: string[];
        keyPoints: string[];
        quiz: {
            question: string;
            options: string[];
            correctAnswer: number;
            explanation: string;
        }[];
    }[];
}

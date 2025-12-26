// Learning-related types
export interface Lesson {
    locked: any;
    completed: any;
    difficulty: string;
    id: number;
    title: string;
    topic: string;
    stage: 'beginner' | 'intermediate' | 'advanced';
    duration: string;
    emoji: string;
    xp: number;
    description: string;
    content: string[];
    quiz: {
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
    }[];
}

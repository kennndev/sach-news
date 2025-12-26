// Utility functions
export const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

// Comments generator
export const generateComments = (count = 3) => {
    const users = [
        { name: 'Ahmed Hassan', avatar: 'AH' },
        { name: 'Sara Ali', avatar: 'SA' },
        { name: 'Usman Khan', avatar: 'UK' },
        { name: 'Fatima Zahra', avatar: 'FZ' },
        { name: 'Ali Raza', avatar: 'AR' },
        { name: 'Ayesha Malik', avatar: 'AM' },
    ];
    const texts = [
        'This is huge if true! The market seems to be pricing this correctly.',
        'I think the odds are way off here. Betting NO.',
        'Anyone else think this is clickbait?',
        'Great analysis, but I disagree with the conclusion.',
        'The AI trust score seems accurate based on my research.',
        'Need more sources to confirm this.',
        'This changed my mind. Going with YES now.',
        'Classic media manipulation. Stay skeptical.',
    ];
    const times = ['Just now', '2m ago', '5m ago', '15m ago', '1h ago', '2h ago', '3h ago'];

    return Array(count).fill(null).map((_, i) => {
        const user = users[i % users.length];
        const hasReplies = Math.random() > 0.5;
        return {
            id: generateId(),
            author: user.name,
            avatar: user.avatar,
            text: texts[Math.floor(Math.random() * texts.length)],
            timestamp: times[Math.floor(Math.random() * times.length)],
            likes: Math.floor(Math.random() * 50),
            liked: false,
            replies: hasReplies ? [{
                id: generateId(),
                author: users[(i + 1) % users.length].name,
                avatar: users[(i + 1) % users.length].avatar,
                text: texts[Math.floor(Math.random() * texts.length)],
                timestamp: times[Math.floor(Math.random() * times.length)],
                likes: Math.floor(Math.random() * 20),
                liked: false,
                replies: []
            }] : []
        };
    });
};

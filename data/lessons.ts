import { Lesson } from '@/types';

export const LESSONS: Lesson[] = [
    // STAGE 1: BEGINNER - Fundamentals
    {
        id: 1,
        title: "Understanding News Sources",
        topic: "Media Literacy Basics",
        stage: "beginner",
        duration: "10 min",
        emoji: "📰",
        xp: 50,
        description: "Learn to identify credible news sources and understand different types of media outlets.",
        content: [
            "Not all news sources are created equal. Understanding the difference between primary sources, established media, and opinion blogs is crucial.",
            "Primary sources: Official statements, government announcements, research papers",
            "Established media: Dawn, BBC, Reuters - have editorial standards and fact-checking",
            "Opinion blogs: Personal views, may lack fact-checking",
            "Always check: Who owns the outlet? What's their track record? Do they cite sources?"
        ],
        quiz: [
            {
                question: "Which is considered a primary source?",
                options: ["A blog post about a speech", "The official transcript of a speech", "A tweet commenting on a speech", "A news article about a speech"],
                correctAnswer: 1,
                explanation: "Primary sources are original materials - the actual speech transcript is the direct source."
            },
            {
                question: "What should you check about a news outlet?",
                options: ["Only the headline", "Their social media followers", "Their ownership and track record", "The website design"],
                correctAnswer: 2,
                explanation: "Understanding who owns and runs a news outlet helps assess potential biases and credibility."
            }
        ],
        locked: undefined,
        completed: undefined,
        difficulty: ''
    },
    {
        id: 2,
        title: "Identifying Bias in Headlines",
        topic: "Critical Reading",
        stage: "beginner",
        duration: "12 min",
        emoji: "🎯",
        xp: 50,
        description: "Recognize how headlines can manipulate perception through word choice and framing.",
        content: [
            "Headlines are designed to grab attention, but they can also mislead through careful word choice.",
            "Loaded language: 'Slams', 'Destroys', 'Shocking' - emotional words that bias the reader",
            "Passive voice: 'Mistakes were made' vs 'The minister made mistakes' - hides responsibility",
            "Question headlines: 'Is the economy failing?' - plants doubt without evidence",
            "Always read beyond the headline to get the full context and facts."
        ],
        quiz: [
            {
                question: "Which headline shows the most bias?",
                options: ["Minister announces new policy", "Minister's SHOCKING policy DESTROYS opposition", "New policy announced by minister", "Policy announcement made today"],
                correctAnswer: 1,
                explanation: "Emotional, loaded language like 'SHOCKING' and 'DESTROYS' shows clear bias."
            },
            {
                question: "Why are question headlines problematic?",
                options: ["They're too short", "They plant doubt without providing evidence", "They're grammatically incorrect", "They're too long"],
                correctAnswer: 1,
                explanation: "Question headlines suggest controversy or problems without actually proving anything."
            }
        ],
        locked: undefined,
        completed: undefined,
        difficulty: ''
    },
    // ... Continue with remaining 10 lessons
    {
        id: 3,
        title: "Fact vs Opinion",
        topic: "Critical Thinking",
        stage: "beginner",
        duration: "15 min",
        emoji: "⚖️",
        xp: 50,
        description: "Learn to distinguish between factual reporting and opinion pieces.",
        content: [
            "Facts can be verified. Opinions are personal views. News should separate the two clearly.",
            "Facts: 'The temperature was 35°C', 'The bill passed with 150 votes'",
            "Opinions: 'The weather was unbearable', 'The bill is a disaster'",
            "Watch for: 'I think', 'I believe', 'should', 'must' - these signal opinions",
            "Good journalism labels opinion pieces clearly. Be wary of opinions disguised as news."
        ],
        quiz: [
            {
                question: "Which statement is a fact?",
                options: ["The new law is terrible", "The new law passed yesterday", "The new law will ruin everything", "The new law should be repealed"],
                correctAnswer: 1,
                explanation: "This can be verified - you can check if the law actually passed yesterday."
            },
            {
                question: "Which word signals an opinion?",
                options: ["Announced", "Stated", "Should", "Reported"],
                correctAnswer: 2,
                explanation: "'Should' expresses what someone thinks ought to happen - it's an opinion word."
            }
        ],
        locked: undefined,
        completed: undefined,
        difficulty: ''
    },
    {
        id: 4,
        title: "Verifying Information",
        topic: "Fact-Checking",
        stage: "beginner",
        duration: "18 min",
        emoji: "✅",
        xp: 75,
        description: "Master the basics of fact-checking and source verification.",
        content: [
            "Before sharing news, verify it! Here's how:",
            "1. Check multiple sources: Does more than one credible outlet report this?",
            "2. Look for original sources: Can you find the actual study, statement, or document?",
            "3. Check the date: Is this old news being recycled?",
            "4. Reverse image search: Is the photo really from this event?",
            "5. Use fact-checking sites: AFP Fact Check, Snopes, FactCheck.org"
        ],
        quiz: [
            {
                question: "What's the first step in verifying news?",
                options: ["Share it immediately", "Check if other credible sources report it", "Trust the headline", "Check social media comments"],
                correctAnswer: 1,
                explanation: "Cross-referencing with multiple credible sources is the first step in verification."
            },
            {
                question: "Why should you check the date of an article?",
                options: ["To see if it's recent news or old news being recycled", "Dates don't matter", "Only for historical articles", "To check the author's age"],
                correctAnswer: 0,
                explanation: "Old news is often shared as if it's current, misleading readers about timing."
            }
        ],
        locked: undefined,
        completed: undefined,
        difficulty: ''
    },
    {
        id: 5,
        title: "Detecting Misinformation",
        topic: "Advanced Fact-Checking",
        stage: "intermediate",
        duration: "20 min",
        emoji: "🔍",
        xp: 75,
        description: "Learn advanced techniques to spot false information and manipulation.",
        content: [
            "Misinformation spreads faster than truth. Learn to spot it:",
            "Red flags: Sensational claims, no named sources, emotional manipulation, 'Share before deleted!'",
            "Check the URL: Fake sites often mimic real ones (e.g., 'abcnews.com.co' vs 'abcnews.com')",
            "Look for 'About Us': Legitimate sites have clear information about who runs them",
            "Beware of confirmation bias: Don't just believe things that match your existing views",
            "If it sounds too outrageous, it probably is - verify before believing or sharing"
        ],
        quiz: [
            {
                question: "What's a major red flag for misinformation?",
                options: ["Multiple sources cited", "Sensational claims with no named sources", "Author's name provided", "Publication date shown"],
                correctAnswer: 1,
                explanation: "Sensational claims without attribution are classic misinformation tactics."
            },
            {
                question: "What is confirmation bias?",
                options: ["Checking facts twice", "Believing things that match your existing views", "Confirming with multiple sources", "Bias against confirmation"],
                correctAnswer: 1,
                explanation: "Confirmation bias makes us accept information that aligns with our beliefs without scrutiny."
            }
        ],
        locked: undefined,
        completed: undefined,
        difficulty: ''
    },
    {
        id: 6,
        title: "Understanding Context",
        topic: "Media Analysis",
        stage: "intermediate",
        duration: "22 min",
        emoji: "🧩",
        xp: 75,
        description: "Learn why context matters and how missing context changes meaning.",
        content: [
            "Context is everything. A quote, statistic, or image without context can be completely misleading.",
            "Out-of-context quotes: 'I never said...' - check the full statement",
            "Cherry-picked statistics: '90% increase!' - from what baseline? Over what time?",
            "Cropped images: What's outside the frame? What happened before/after?",
            "Historical context: What was happening at the time? What led to this?",
            "Always ask: What's the full story? What am I not being told?"
        ],
        quiz: [
            {
                question: "Why is context important for statistics?",
                options: ["It makes numbers look bigger", "It shows the baseline and timeframe", "Statistics don't need context", "Context is only for quotes"],
                correctAnswer: 1,
                explanation: "Without knowing the starting point and timeframe, statistics can be meaningless or misleading."
            },
            {
                question: "What should you ask about a cropped image?",
                options: ["Who took it?", "What's outside the frame?", "What camera was used?", "What filter was applied?"],
                correctAnswer: 1,
                explanation: "Cropped images can hide important context - always wonder what's been cut out."
            }
        ],
        locked: undefined,
        completed: undefined,
        difficulty: ''
    },
    {
        id: 7,
        title: "Analyzing Sources",
        topic: "Source Evaluation",
        stage: "intermediate",
        duration: "25 min",
        emoji: "📊",
        xp: 100,
        description: "Deep dive into evaluating source credibility and identifying conflicts of interest.",
        content: [
            "Not all sources are equally reliable. Learn to evaluate them:",
            "Expertise: Is the source qualified to speak on this topic?",
            "Conflicts of interest: Does the source benefit from this narrative?",
            "Track record: Have they been accurate in the past?",
            "Transparency: Do they disclose their methods and funding?",
            "Anonymous sources: Sometimes necessary, but require extra scrutiny",
            "Primary vs secondary: Always try to find the original source"
        ],
        quiz: [
            {
                question: "What's a conflict of interest?",
                options: ["Two sources disagreeing", "A source benefiting from their narrative", "Interest in conflicts", "Interesting conflicts"],
                correctAnswer: 1,
                explanation: "A conflict of interest exists when a source has something to gain from the story they're telling."
            },
            {
                question: "Why check a source's track record?",
                options: ["To see if they've been accurate before", "To count their articles", "To check their age", "To see their education"],
                correctAnswer: 0,
                explanation: "Past accuracy is a good indicator of current reliability."
            }
        ],
        locked: undefined,
        completed: undefined,
        difficulty: ''
    },
    {
        id: 8,
        title: "Cross-Referencing News",
        topic: "Verification Techniques",
        stage: "intermediate",
        duration: "20 min",
        emoji: "🔗",
        xp: 75,
        description: "Master the art of cross-referencing information across multiple sources.",
        content: [
            "One source is never enough. Cross-referencing is essential:",
            "Check 3+ sources: Do they all report the same facts?",
            "Look for original reporting: Who broke the story? Others might just be copying",
            "Compare details: Do the facts match across sources?",
            "Check international sources: Different perspectives can reveal bias",
            "Beware of circular reporting: Multiple sites citing each other, not original sources",
            "Use diverse sources: Don't just check outlets you already trust"
        ],
        quiz: [
            {
                question: "How many sources should you check?",
                options: ["One is enough", "At least three", "Only two", "As many as possible but at least one"],
                correctAnswer: 1,
                explanation: "Checking at least three credible sources helps confirm facts and spot inconsistencies."
            },
            {
                question: "What is circular reporting?",
                options: ["Reporting in circles", "Multiple sites citing each other, not original sources", "Round-the-clock reporting", "Circular arguments"],
                correctAnswer: 1,
                explanation: "Circular reporting creates an illusion of multiple sources when they're all copying each other."
            }
        ],
        locked: undefined,
        completed: undefined,
        difficulty: ''
    },
    {
        id: 9,
        title: "Media Manipulation Techniques",
        topic: "Advanced Analysis",
        stage: "advanced",
        duration: "30 min",
        emoji: "🎭",
        xp: 100,
        description: "Identify sophisticated manipulation techniques used in modern media.",
        content: [
            "Advanced manipulation goes beyond simple lies. Recognize these techniques:",
            "Astroturfing: Fake grassroots movements created to seem organic",
            "Whataboutism: Deflecting criticism by pointing to others' flaws",
            "False equivalence: Treating unequal things as equal ('both sides')",
            "Gish gallop: Overwhelming with many weak arguments instead of one strong one",
            "Sealioning: Feigning ignorance to exhaust and frustrate",
            "These techniques are designed to confuse, not inform"
        ],
        quiz: [
            {
                question: "What is astroturfing?",
                options: ["Fake grass", "Fake grassroots movements", "Turf wars", "Grass manipulation"],
                correctAnswer: 1,
                explanation: "Astroturfing creates the illusion of organic public support when it's actually manufactured."
            },
            {
                question: "What is whataboutism?",
                options: ["Asking what about something", "Deflecting criticism by pointing to others", "Being curious", "Asking questions"],
                correctAnswer: 1,
                explanation: "Whataboutism avoids addressing criticism by changing the subject to someone else's flaws."
            }
        ],
        locked: undefined,
        completed: undefined,
        difficulty: ''
    },
    {
        id: 10,
        title: "Propaganda Recognition",
        topic: "Political Communication",
        stage: "advanced",
        duration: "28 min",
        emoji: "📢",
        xp: 100,
        description: "Learn to identify propaganda techniques in news and political communication.",
        content: [
            "Propaganda uses psychological techniques to influence opinion:",
            "Bandwagon: 'Everyone believes this, you should too'",
            "Fear appeal: Creating panic to push an agenda",
            "Glittering generalities: Vague, positive words without substance",
            "Name-calling: Attacking the person, not the argument",
            "Transfer: Associating something with positive/negative symbols",
            "Testimonial: Using celebrity endorsements instead of evidence",
            "Card stacking: Presenting only one side of the story"
        ],
        quiz: [
            {
                question: "What is the bandwagon technique?",
                options: ["Musical bands", "Suggesting everyone believes something so you should too", "Jumping on wagons", "Band merchandise"],
                correctAnswer: 1,
                explanation: "Bandwagon appeals to our desire to fit in by suggesting 'everyone' agrees."
            },
            {
                question: "What is card stacking?",
                options: ["Stacking playing cards", "Presenting only one side of the story", "Building card houses", "Organizing cards"],
                correctAnswer: 1,
                explanation: "Card stacking presents only favorable information while hiding contradictory facts."
            }
        ],
        locked: undefined,
        completed: undefined,
        difficulty: ''
    },
    {
        id: 11,
        title: "Deep Fake Detection",
        topic: "Digital Literacy",
        stage: "advanced",
        duration: "25 min",
        emoji: "🤖",
        xp: 100,
        description: "Learn to spot AI-generated content and deep fake videos.",
        content: [
            "AI-generated content is becoming harder to detect. Look for these signs:",
            "Videos: Unnatural blinking, lip-sync issues, weird lighting, distorted edges",
            "Images: Inconsistent lighting, strange shadows, warped backgrounds, odd hands/teeth",
            "Text: Repetitive patterns, factual errors, inconsistent style",
            "Audio: Robotic cadence, breathing inconsistencies, background noise artifacts",
            "Tools: Use reverse image search, check metadata, use AI detection tools",
            "When in doubt, verify with the original source directly"
        ],
        quiz: [
            {
                question: "What's a sign of a deep fake video?",
                options: ["High quality", "Unnatural blinking patterns", "Good lighting", "Clear audio"],
                correctAnswer: 1,
                explanation: "Deep fakes often struggle with natural blinking and micro-expressions."
            },
            {
                question: "How can you verify a suspicious video?",
                options: ["Just trust it", "Contact the original source directly", "Share it to ask others", "Ignore it"],
                correctAnswer: 1,
                explanation: "Directly contacting the alleged source is the most reliable verification method."
            }
        ],
        locked: undefined,
        completed: undefined,
        difficulty: ''
    },
    {
        id: 12,
        title: "Investigative Journalism",
        topic: "Professional Standards",
        stage: "advanced",
        duration: "35 min",
        emoji: "🔎",
        xp: 150,
        description: "Understand how professional journalists investigate and verify complex stories.",
        content: [
            "Investigative journalism requires rigorous methods:",
            "Multiple sources: Never rely on a single source for important claims",
            "Documentation: Keep records of everything - emails, documents, recordings",
            "Follow the money: Financial trails often reveal the truth",
            "Protection of sources: Journalists must protect confidential sources",
            "Legal review: Major investigations undergo legal scrutiny before publication",
            "Public interest: Stories must serve the public, not just generate clicks",
            "These standards separate real journalism from clickbait"
        ],
        quiz: [
            {
                question: "Why do journalists protect sources?",
                options: ["To hide information", "To enable whistleblowers to come forward safely", "To seem mysterious", "To avoid work"],
                correctAnswer: 1,
                explanation: "Source protection enables people to expose wrongdoing without fear of retaliation."
            },
            {
                question: "What does 'follow the money' mean?",
                options: ["Become rich", "Track financial trails to find the truth", "Count money", "Follow wealthy people"],
                correctAnswer: 1,
                explanation: "Financial connections often reveal motivations and hidden relationships in a story."
            }
        ],
        locked: undefined,
        completed: undefined,
        difficulty: ''
    }
];

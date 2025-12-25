// NewsData.io API utility functions
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || 'pub_bd432535fdf14e13adfeb650d53d27be';
const NEWS_API_BASE = 'https://newsdata.io/api/1';

export interface NewsArticle {
    id: string;
    title: string;
    description: string;
    content: string;
    author: string;
    source: string;
    publishedAt: string;
    url: string;
    urlToImage: string;
    category?: string;
}

// Format time ago from ISO date
function getTimeAgo(isoDate: string): string {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

// Determine category from article content
function categorizeArticle(article: any): string {
    const text = `${article.title} ${article.description}`.toLowerCase();

    if (text.includes('cricket') || text.includes('psl') || text.includes('babar') || text.includes('shaheen')) {
        return 'cricket';
    }
    if (text.includes('economy') || text.includes('imf') || text.includes('dollar') || text.includes('rupee') || text.includes('business')) {
        return 'economy';
    }
    if (text.includes('tech') || text.includes('startup') || text.includes('ai') || text.includes('5g')) {
        return 'tech';
    }
    if (text.includes('weather') || text.includes('rain') || text.includes('snow') || text.includes('temperature')) {
        return 'weather';
    }
    return 'politics'; // Default to politics
}

// Cache duration in milliseconds (15 minutes)
const CACHE_DURATION = 15 * 60 * 1000;

// Helper function to get cached data
function getCachedData(key: string): NewsArticle[] | null {
    if (typeof window === 'undefined') return null;

    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid
        if (now - timestamp < CACHE_DURATION) {
            console.log(`Using cached news data for: ${key}`);
            return data;
        }

        // Cache expired, remove it
        localStorage.removeItem(key);
        return null;
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

// Helper function to set cached data
function setCachedData(key: string, data: NewsArticle[]): void {
    if (typeof window === 'undefined') return;

    try {
        const cacheData = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
        console.log(`Cached news data for: ${key}`);
    } catch (error) {
        console.error('Error setting cache:', error);
    }
}

// Fetch news articles from NewsData.io API
export async function fetchNewsArticles(
    query: string = 'Pakistan',
    pageSize: number = 10,
    category?: string
): Promise<NewsArticle[]> {
    // Create cache key based on query and category
    const cacheKey = `news_${query}_${category || 'all'}`;

    // Try to get cached data first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        // Adjust query based on category to focus on Pakistan
        let searchQuery = 'Pakistan';
        if (category && category !== 'all') {
            searchQuery = `Pakistan ${category}`;
        }

        // Fetch from NewsData.io with Pakistan country filter
        // Using country=pk to get Pakistani news sources
        const url = `${NEWS_API_BASE}/news?apikey=${NEWS_API_KEY}&q=${encodeURIComponent(searchQuery)}&country=pk&language=en&size=${pageSize}`;

        console.log(`Fetching fresh news data from NewsData.io for: ${cacheKey}`);
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('NewsData.io error response:', errorData);
            throw new Error(`NewsData.io error: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            console.log('No articles found from NewsData.io, trying without country filter...');
            // Fallback: try without country restriction but with Pakistan query
            const fallbackUrl = `${NEWS_API_BASE}/news?apikey=${NEWS_API_KEY}&q=${encodeURIComponent(searchQuery)}&language=en&size=${pageSize}`;
            const fallbackResponse = await fetch(fallbackUrl);
            const fallbackData = await fallbackResponse.json();

            if (!fallbackData.results || fallbackData.results.length === 0) {
                return [];
            }

            // Filter for Pakistan-related content
            const filteredArticles = fallbackData.results.filter((article: any) => {
                const text = `${article.title} ${article.description} ${article.source_id}`.toLowerCase();
                return text.includes('pakistan') || text.includes('islamabad') || text.includes('karachi') ||
                    text.includes('lahore') || text.includes('psl') || text.includes('imf pakistan');
            });

            const articles = convertArticles(filteredArticles);
            // Cache the results
            setCachedData(cacheKey, articles);
            return articles;
        }

        const articles = convertArticles(data.results);
        // Cache the results
        setCachedData(cacheKey, articles);
        return articles;
    } catch (error) {
        console.error('Error fetching news articles:', error);
        return [];
    }
}

// Helper function to convert NewsData.io articles
function convertArticles(articles: any[]): NewsArticle[] {
    // List of non-Pakistani sources to exclude
    const excludedSources = ['menafn', 'mena', 'middle east'];

    // List of verified Pakistani sources
    const pakistaniSources = ['dawn', 'brecorder', 'pakistantoday', 'thenews', 'tribune',
        'express', 'geo', 'ary', 'samaa', 'dunya', '92news',
        'nation', 'thenation', 'dailytimes'];

    return articles
        .filter((article: any) => {
            if (!article.title || !article.description || article.title === '[Removed]') {
                return false;
            }

            // Check if source is in excluded list
            const sourceId = (article.source_id || '').toLowerCase();
            const isExcluded = excludedSources.some(excluded => sourceId.includes(excluded));
            if (isExcluded) {
                return false;
            }

            // Prefer Pakistani sources
            const isPakistaniSource = pakistaniSources.some(pak => sourceId.includes(pak));

            // If it's a Pakistani source, include it
            if (isPakistaniSource) {
                return true;
            }

            // Otherwise, check if content is Pakistan-related
            const text = `${article.title} ${article.description}`.toLowerCase();
            return text.includes('pakistan') || text.includes('islamabad') ||
                text.includes('karachi') || text.includes('lahore');
        })
        .map((article: any, index: number) => ({
            id: `news-${index}-${Date.now()}`,
            title: article.title,
            description: article.description || '',
            content: article.content || article.description || '',
            author: article.creator?.[0] || article.source_id || 'Unknown',
            source: article.source_id || 'Unknown Source',
            publishedAt: article.pubDate,
            url: article.link,
            urlToImage: article.image_url,
            category: categorizeArticle(article)
        }));
}

// Map category to search query
export function getNewsCategoryQuery(category: string): string {
    const categoryMap: { [key: string]: string } = {
        politics: 'Pakistan politics government',
        cricket: 'Pakistan cricket PSL',
        economy: 'Pakistan economy business IMF',
        tech: 'Pakistan technology startup',
        weather: 'Pakistan weather forecast'
    };

    return categoryMap[category] || 'Pakistan news';
}

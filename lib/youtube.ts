// YouTube API utility functions
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || 'AIzaSyCHunu36JxWaoNAx_Z1QvIHgBYlDK0Mk0Q';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
    duration: string;
    viewCount: string;
    videoUrl: string;
}

// Cache duration in milliseconds (15 minutes)
const CACHE_DURATION = 15 * 60 * 1000;

// Helper function to get cached data
function getCachedData(key: string): YouTubeVideo[] | null {
    if (typeof window === 'undefined') return null;

    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid
        if (now - timestamp < CACHE_DURATION) {
            console.log(`Using cached YouTube data for: ${key}`);
            return data;
        }

        // Cache expired, remove it
        localStorage.removeItem(key);
        return null;
    } catch (error) {
        console.error('Error reading YouTube cache:', error);
        return null;
    }
}

// Helper function to set cached data
function setCachedData(key: string, data: YouTubeVideo[]): void {
    if (typeof window === 'undefined') return;

    try {
        const cacheData = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
        console.log(`Cached YouTube data for: ${key}`);
    } catch (error) {
        console.error('Error setting YouTube cache:', error);
    }
}

// Convert ISO 8601 duration to readable format (e.g., "PT15M30S" -> "15:30")
function formatDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Format view count (e.g., 1234567 -> "1.2M")
function formatViewCount(count: string): number {
    return parseInt(count) || 0;
}

// Calculate time ago from ISO date
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

// Fetch videos from YouTube API
export async function fetchYouTubeVideos(
    query: string = 'Pakistan news',
    maxResults: number = 10,
    category?: string
): Promise<YouTubeVideo[]> {
    // Create cache key based on query and category
    const cacheKey = `youtube_${query}_${category || 'all'}`;

    // Try to get cached data first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        // Adjust query based on category
        let searchQuery = query;
        if (category && category !== 'all') {
            searchQuery = `Pakistan ${category} news`;
        }

        // Step 1: Search for videos
        const searchUrl = `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=${maxResults}&order=date&relevanceLanguage=en&regionCode=PK&key=${YOUTUBE_API_KEY}`;

        console.log(`Fetching fresh YouTube data for: ${cacheKey}`);
        const searchResponse = await fetch(searchUrl);
        if (!searchResponse.ok) {
            throw new Error(`YouTube API error: ${searchResponse.status}`);
        }

        const searchData = await searchResponse.json();

        if (!searchData.items || searchData.items.length === 0) {
            return [];
        }

        // Step 2: Get video details (duration, view count)
        const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
        const detailsUrl = `${YOUTUBE_API_BASE}/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;

        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();

        // Create a map of video details
        const detailsMap = new Map();
        detailsData.items?.forEach((item: any) => {
            detailsMap.set(item.id, {
                duration: item.contentDetails.duration,
                viewCount: item.statistics.viewCount
            });
        });

        // Step 3: Combine search results with details
        const videos: YouTubeVideo[] = searchData.items.map((item: any) => {
            const details = detailsMap.get(item.id.videoId) || { duration: 'PT0S', viewCount: '0' };

            return {
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
                channelTitle: item.snippet.channelTitle,
                publishedAt: item.snippet.publishedAt,
                duration: formatDuration(details.duration),
                viewCount: details.viewCount,
                videoUrl: `https://www.youtube.com/embed/${item.id.videoId}`
            };
        });

        // Cache the results
        setCachedData(cacheKey, videos);
        return videos;
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }
}

// Map category to search query
export function getCategoryQuery(category: string): string {
    const categoryMap: { [key: string]: string } = {
        politics: 'Pakistan politics government',
        cricket: 'Pakistan cricket PSL',
        economy: 'Pakistan economy business',
        tech: 'Pakistan technology startup',
        weather: 'Pakistan weather forecast'
    };

    return categoryMap[category] || 'Pakistan news';
}

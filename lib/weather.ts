// OpenWeatherMap API utility functions
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'd1b998aaab97273533ce39b5d8c83e94';
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

// Pakistani cities to fetch weather for
const PAKISTANI_CITIES = [
    { name: 'Karachi', lat: 24.8607, lon: 67.0011 },
    { name: 'Lahore', lat: 31.5204, lon: 74.3587 },
    { name: 'Islamabad', lat: 33.6844, lon: 73.0479 },
    { name: 'Peshawar', lat: 34.0151, lon: 71.5249 },
    { name: 'Quetta', lat: 30.1798, lon: 66.9750 },
    { name: 'Multan', lat: 30.1575, lon: 71.5249 },
];

export interface WeatherData {
    id: string;
    city: string;
    temperature: number;
    feelsLike: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;
    emoji: string;
    timestamp: string;
}

// Map weather condition to emoji
function getWeatherEmoji(condition: string, icon: string): string {
    const conditionLower = condition.toLowerCase();

    if (conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return '🌧️';
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return '⛈️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('mist') || conditionLower.includes('fog') || conditionLower.includes('haze')) return '🌫️';
    if (conditionLower.includes('smoke')) return '💨';

    // Fallback based on icon code
    if (icon.includes('01')) return '☀️'; // clear sky
    if (icon.includes('02')) return '⛅'; // few clouds
    if (icon.includes('03') || icon.includes('04')) return '☁️'; // clouds
    if (icon.includes('09') || icon.includes('10')) return '🌧️'; // rain
    if (icon.includes('11')) return '⛈️'; // thunderstorm
    if (icon.includes('13')) return '❄️'; // snow
    if (icon.includes('50')) return '🌫️'; // mist

    return '🌤️'; // default
}

// Fetch current weather for all Pakistani cities
export async function fetchWeatherData(): Promise<WeatherData[]> {
    try {
        const weatherPromises = PAKISTANI_CITIES.map(async (city) => {
            const url = `${WEATHER_API_BASE}/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${WEATHER_API_KEY}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Weather API error for ${city.name}: ${response.status}`);
            }

            const data = await response.json();

            return {
                id: `weather-${city.name.toLowerCase()}`,
                city: city.name,
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                condition: data.weather[0].main,
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
                icon: data.weather[0].icon,
                emoji: getWeatherEmoji(data.weather[0].main, data.weather[0].icon),
                timestamp: new Date().toISOString()
            };
        });

        const weatherData = await Promise.all(weatherPromises);
        return weatherData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return [];
    }
}

// Generate weather-based prediction market question
export function generateWeatherMarket(weather: WeatherData) {
    const temp = weather.temperature;
    const condition = weather.condition.toLowerCase();

    // Generate relevant questions based on current conditions
    if (condition.includes('rain')) {
        return {
            question: `Will it continue raining in ${weather.city} tomorrow?`,
            vol: `${(Math.random() * 2 + 0.5).toFixed(1)}M`,
            yes: 0.4 + Math.random() * 0.3,
            no: 0.3 + Math.random() * 0.3,
            end: 'Tomorrow',
            totalPool: Math.floor(Math.random() * 2000000) + 500000
        };
    } else if (temp > 35) {
        return {
            question: `Will temperature in ${weather.city} exceed 40°C this week?`,
            vol: `${(Math.random() * 3 + 1).toFixed(1)}M`,
            yes: 0.3 + Math.random() * 0.4,
            no: 0.3 + Math.random() * 0.4,
            end: 'This week',
            totalPool: Math.floor(Math.random() * 3000000) + 1000000
        };
    } else if (temp < 10) {
        return {
            question: `Will ${weather.city} see frost tonight?`,
            vol: `${(Math.random() * 1.5 + 0.3).toFixed(1)}M`,
            yes: 0.2 + Math.random() * 0.4,
            no: 0.4 + Math.random() * 0.4,
            end: 'Tonight',
            totalPool: Math.floor(Math.random() * 1500000) + 300000
        };
    } else {
        return {
            question: `Will ${weather.city} have clear skies tomorrow?`,
            vol: `${(Math.random() * 2.5 + 0.8).toFixed(1)}M`,
            yes: 0.35 + Math.random() * 0.35,
            no: 0.3 + Math.random() * 0.4,
            end: 'Tomorrow',
            totalPool: Math.floor(Math.random() * 2500000) + 800000
        };
    }
}

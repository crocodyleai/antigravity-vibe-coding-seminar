export interface City {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string; // e.g. State/Province
}

interface SearchResponse {
    results?: City[];
}

export const searchCities = async (query: string): Promise<City[]> => {
    if (!query || query.length < 2) return [];

    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=ko&format=json`
    );

    if (!response.ok) {
        throw new Error('Failed to search cities');
    }

    const data: SearchResponse = await response.json();
    return data.results || [];
};

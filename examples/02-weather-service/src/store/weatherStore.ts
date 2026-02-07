import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchWeather, type WeatherData } from '../api/weather';
import { generateSmartHeadline, type SmartHeadline } from '../utils/smartHeadline';

interface City {
    name: string;
    lat: number;
    lon: number;
}

interface WeatherState {
    weatherData: WeatherData | null;
    smartHeadline: SmartHeadline | null;
    loading: boolean;
    error: string | null;
    currentCity: City;
    savedCities: City[];

    fetchWeather: () => Promise<void>;
    setCity: (name: string, lat: number, lon: number) => void;
    addSavedCity: (city: City) => void;
    removeSavedCity: (name: string) => void;
}

// Default City: Seoul Gwanak-gu
const DEFAULT_CITY: City = {
    name: '서울 관악구',
    lat: 37.4782,
    lon: 126.9515
};

export const useWeatherStore = create<WeatherState>()(
    persist(
        (set, get) => ({
            weatherData: null,
            smartHeadline: null,
            loading: false,
            error: null,
            currentCity: DEFAULT_CITY,
            savedCities: [],

            fetchWeather: async () => {
                const { lat, lon } = get().currentCity;
                // Don't set loading purely for refresh if we want silent updates, 
                // but for manual switch we want loading state.
                // Let's keep loading: true for now.
                set({ loading: true, error: null });
                try {
                    const data = await fetchWeather(lat, lon);
                    const headline = generateSmartHeadline(data);
                    set({ weatherData: data, smartHeadline: headline, loading: false });
                } catch (err) {
                    set({ error: (err as Error).message, loading: false });
                }
            },

            setCity: (name, lat, lon) => {
                set({ currentCity: { name, lat, lon } });
                get().fetchWeather();
            },

            addSavedCity: (city) => {
                const { savedCities } = get();
                const exists = savedCities.some(c => c.name === city.name && c.lat === city.lat);
                if (!exists) {
                    set({ savedCities: [...savedCities, city] });
                }
            },

            removeSavedCity: (name) => {
                const { savedCities } = get();
                set({ savedCities: savedCities.filter(c => c.name !== name) });
            }
        }),
        {
            name: 'udon-weather-storage',
            partialize: (state) => ({
                currentCity: state.currentCity,
                savedCities: state.savedCities
            }),
        }
    )
);

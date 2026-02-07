export interface WeatherData {
    current_weather: {
        temperature: number;
        windspeed: number;
        winddirection: number;
        weathercode: number;
        time: string;
        is_day: number;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        apparent_temperature: number[];
        precipitation: number[];
        precipitation_probability: number[];
        weathercode: number[];
        is_day: number[];
    };
    daily: {
        time: string[];
        weathercode: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
}

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,apparent_temperature,precipitation,precipitation_probability,weathercode,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&past_days=1`
    );
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    return response.json();
};

import {
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    CloudLightning,
    CloudDrizzle,
    Moon
} from 'lucide-react';


export const formatTemp = (temp: number): string => {
    return `${Math.round(temp)}°`;
};

export const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ko-KR', { hour: 'numeric', hour12: true }); // "오전 10시", "오후 2시"
};

export const formatDay = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', { weekday: 'short' }); // "월", "화"
};

export const getWeatherIcon = (code: number, isDay: number = 1) => {
    // WMO Weather interpretation codes (WW)
    // 0: Clear sky
    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    // 45, 48: Fog
    // 51-57: Drizzle
    // 61-67: Rain
    // 71-77: Snow
    // 80-82: Rain showers
    // 85-86: Snow showers
    // 95-99: Thunderstorm

    if (code === 0) return isDay ? Sun : Moon;
    if (code >= 1 && code <= 3) return Cloud;
    if (code >= 45 && code <= 48) return Cloud;
    if (code >= 51 && code <= 57) return CloudDrizzle;
    if (code >= 61 && code <= 67) return CloudRain;
    if (code >= 71 && code <= 77) return CloudSnow;
    if (code >= 80 && code <= 82) return CloudRain; // Showers treated as rain
    if (code >= 85 && code <= 86) return CloudSnow;
    if (code >= 95 && code <= 99) return CloudLightning;

    return Sun; // Default
};

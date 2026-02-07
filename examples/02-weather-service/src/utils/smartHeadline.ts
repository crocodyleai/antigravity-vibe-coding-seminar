import type { WeatherData } from '../api/weather';

export interface SmartHeadline {
    text: string;
    subText?: string;
    condition: 'rain' | 'snow' | 'clear' | 'cloudy' | 'extreme'; // For UI styling/icons
}

// Helper to find the index in hourly data corresponding to the current time
// Helper to find the index in hourly data corresponding to the current time
export const getCurrentHourIndex = (data: WeatherData): number => {
    // Open-Meteo returns time in ISO format (YYYY-MM-DDTHH:MM) local to the requested timezone
    // We match the first 13 characters (YYYY-MM-DDTHH)
    const currentHourString = data.current_weather.time.slice(0, 13);
    return data.hourly.time.findIndex(t => t.startsWith(currentHourString));
};

const isPrecipitation = (code: number): boolean => {
    // Codes for Drizzle (51-57), Rain (61-67), Snow (71-77), Showers (80-82), Snow Showers (85-86), Thunderstorm (95-99)
    return (code >= 51 && code <= 67) || (code >= 71 && code <= 77) || (code >= 80 && code <= 86) || (code >= 95 && code <= 99);
};

const isSnow = (code: number): boolean => {
    return (code >= 71 && code <= 77) || (code >= 85 && code <= 86);
}

export const generateSmartHeadline = (data: WeatherData): SmartHeadline => {
    const currentIndex = getCurrentHourIndex(data);
    if (currentIndex === -1) return { text: "날씨 정보를 불러오는 중...", condition: 'cloudy' };

    const currentCode = data.current_weather.weathercode;
    const currentPrecip = data.hourly.precipitation[currentIndex] || 0;

    // 1. Precipitation Logic (Highest Priority)
    if (isPrecipitation(currentCode) || currentPrecip > 0) {
        const precipType = isSnow(currentCode) ? "눈" : "비";

        // Find when it stops
        let stopIndex = -1;
        for (let i = currentIndex + 1; i < data.hourly.time.length; i++) {
            const code = data.hourly.weathercode[i];
            const prob = data.hourly.precipitation_probability[i];

            // Assume stopping if code is not precipitation AND probability is low (< 30%)
            if (!isPrecipitation(code) && prob < 30) {
                stopIndex = i;
                break;
            }
        }

        if (stopIndex !== -1) {
            const hoursLeft = stopIndex - currentIndex;
            return {
                text: `${precipType}, 약 ${hoursLeft}시간 뒤에 그칠 예정이에요.`,
                condition: isSnow(currentCode) ? 'snow' : 'rain'
            };
        } else {
            return {
                text: `${precipType}, 오늘 하루 종일 내릴 것 같아요.`,
                condition: isSnow(currentCode) ? 'snow' : 'rain'
            };
        }
    }

    // 2. Extreme Temperature Logic (Yesterday Comparison)
    // currentIndex is roughly 24 + currentHour (since we fetch past_days=1)
    // To find yesterday same time, we look at currentIndex - 24
    const yesterdayIndex = currentIndex - 24;

    if (yesterdayIndex >= 0) {
        const currentTemp = data.hourly.temperature_2m[currentIndex];
        const yesterdayTemp = data.hourly.temperature_2m[yesterdayIndex];
        const diff = currentTemp - yesterdayTemp;
        const absDiff = Math.abs(diff);

        if (absDiff >= 3) {
            const warmer = diff > 0;
            return {
                text: `어제보다 ${absDiff.toFixed(1)}°C 더 ${warmer ? '더워요' : '추워요'}.`,
                subText: warmer ? '옷차림을 가볍게 하세요.' : '옷을 따뜻하게 챙기세요.',
                condition: 'extreme'
            };
        }
    }

    // 3. Fine Weather / Default Logic
    const code = currentCode;
    if (code === 0 || code === 1) {
        return { text: "맑음. 산책하기 딱 좋은 날씨네요.", condition: 'clear' };
    } else if (code === 2 || code === 3) {
        return { text: "구름이 조금 있지만, 활동하기 좋아요.", condition: 'cloudy' };
    } else if (data.hourly.precipitation_probability[currentIndex] > 50) {
        return { text: "곧 비가 올 수도 있어요. 우산을 챙기세요.", condition: 'cloudy' };
    }

    return { text: "오늘도 좋은 하루 보내세요!", condition: 'clear' };
};

import type { WeatherData } from '../api/weather';
import { getCurrentHourIndex } from '../utils/smartHeadline';
import { formatTime, formatTemp, getWeatherIcon } from '../utils/format';

interface HourlyForecastProps {
    data: WeatherData;
}

export const HourlyForecast = ({ data }: HourlyForecastProps) => {
    const currentIndex = getCurrentHourIndex(data);
    const hourly = data.hourly;
    const items = hourly.time
        .slice(currentIndex, currentIndex + 25) // Next 24 hours + current
        .map((time, i) => {
            const idx = currentIndex + i;
            return {
                time,
                temp: hourly.temperature_2m[idx],
                code: hourly.weathercode[idx],
                isDay: hourly.is_day[idx]
            };
        });

    return (
        <div className="glass-panel no-scrollbar" style={{
            padding: '1.5rem',
            width: '100%',
            maxWidth: '100%',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center'
        }}>
            {items.map((item, index) => {
                const Icon = getWeatherIcon(item.code, item.isDay);
                return (
                    <div key={item.time} style={{
                        display: 'inline-flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        minWidth: '3.5rem'
                    }}>
                        <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                            {index === 0 ? '지금' : formatTime(item.time)}
                        </span>
                        <Icon size={24} strokeWidth={1.5} />
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>{formatTemp(item.temp)}</span>
                    </div>
                );
            })}
        </div>
    );
};

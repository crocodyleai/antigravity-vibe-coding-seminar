import type { WeatherData } from '../api/weather';
import { formatDay, formatTemp, getWeatherIcon } from '../utils/format';

interface DailyForecastProps {
    data: WeatherData;
}

export const DailyForecast = ({ data }: DailyForecastProps) => {
    // Index 0 is yesterday (past_days=1). Start from 1 (Today) to 7 (6 days from now)
    const daily = data.daily;
    const items = daily.time.slice(1, 8).map((time, i) => {
        const idx = i + 1;
        return {
            time,
            code: daily.weathercode[idx],
            max: daily.temperature_2m_max[idx],
            min: daily.temperature_2m_min[idx]
        };
    });

    return (
        <div className="glass-panel" style={{
            padding: '1.5rem',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <h3 style={{ fontSize: '0.9rem', opacity: 0.5, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>7-Day Forecast</h3>
            {items.map((item, index) => {
                const Icon = getWeatherIcon(item.code);
                return (
                    <div key={item.time} style={{
                        display: 'grid',
                        gridTemplateColumns: '3rem 1fr 1fr',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>
                            {index === 0 ? '오늘' : formatDay(item.time)}
                        </span>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Icon size={24} strokeWidth={1.5} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', opacity: 0.9 }}>
                            <span style={{ opacity: 0.6 }}>{formatTemp(item.min)}</span>
                            <span style={{ fontWeight: 600 }}>{formatTemp(item.max)}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

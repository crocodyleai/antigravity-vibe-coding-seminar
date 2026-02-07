import type { WeatherData } from '../api/weather';
import { formatTemp, getWeatherIcon } from '../utils/format';
import { getCurrentHourIndex } from '../utils/smartHeadline';

interface MainCardProps {
    data: WeatherData;
}

export const MainCard = ({ data }: MainCardProps) => {
    const currentIndex = getCurrentHourIndex(data);
    const current = data.current_weather;
    const apparentTemp = data.hourly.apparent_temperature[currentIndex];
    // Daily index 1 is today because past_days=1 (0=yesterday, 1=today)
    const todayMax = data.daily.temperature_2m_max[1];
    const todayMin = data.daily.temperature_2m_min[1];

    const Icon = getWeatherIcon(current.weathercode, current.is_day);

    return (
        <div className="glass-panel" style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%',
            maxWidth: '400px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Icon size={64} strokeWidth={1.5} />
                <span style={{ fontSize: '4rem', fontWeight: 300, lineHeight: 1 }}>
                    {formatTemp(current.temperature)}
                </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: 'var(--font-size-lg)', marginTop: '0.5rem' }}>
                <span style={{ opacity: 0.8 }}>H:{formatTemp(todayMax)}</span>
                <span style={{ opacity: 0.8 }}>L:{formatTemp(todayMin)}</span>
            </div>

            <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.6 }}>
                Feels like {formatTemp(apparentTemp)}
            </div>
        </div>
    );
};

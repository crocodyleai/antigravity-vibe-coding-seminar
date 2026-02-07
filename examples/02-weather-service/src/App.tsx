import { useEffect, useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import './index.css';
import { useWeatherStore } from './store/weatherStore';
import { MainCard } from './components/MainCard';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { CityManager } from './components/CityManager';
import { Skeleton } from './components/Skeleton';

function App() {
  const { fetchWeather, weatherData, smartHeadline, loading, error, currentCity } = useWeatherStore();
  const [isCityManagerOpen, setCityManagerOpen] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  if (loading && !weatherData) {
    return (
      <main style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        minHeight: '100vh'
      }}>
        {/* Skeleton Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton width={150} height={24} />
          <Skeleton width={24} height={24} borderRadius="50%" />
        </div>

        {/* Skeleton Headline */}
        <div>
          <Skeleton width="80%" height={40} style={{ marginBottom: '0.5rem' }} />
          <Skeleton width="60%" height={20} />
        </div>

        {/* Skeleton Components */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
          {/* Main Card Skeleton */}
          <div className="glass-panel" style={{ width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Skeleton width={100} height={100} borderRadius="50%" />
          </div>
          {/* Hourly Skeleton */}
          <div className="glass-panel" style={{ width: '100%', height: '120px' }} />
          {/* Daily Skeleton */}
          <div className="glass-panel" style={{ width: '100%', height: '400px' }} />
        </div>
      </main>
    )
  }

  if (error && !weatherData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#ef4444' }}>
        <span>Error: {error}</span>
      </div>
    )
  }

  return (
    <main style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 0.5rem'
      }}>
        <div
          onClick={() => setCityManagerOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            transition: 'background 0.2s'
          }}
          className="hover-effect"
        >
          <MapPin size={20} />
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{currentCity.name}</h1>
        </div>
        <button
          onClick={() => setCityManagerOpen(true)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Smart Headline */}
      {smartHeadline && (
        <div style={{ padding: '0 0.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 }}>
            {smartHeadline.text}
          </h2>
          {smartHeadline.subText && (
            <p style={{ marginTop: '0.5rem', opacity: 0.8, fontSize: '1rem' }}>
              {smartHeadline.subText}
            </p>
          )}
        </div>
      )}

      {/* Weather Components */}
      {weatherData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
          <MainCard data={weatherData} />
          <HourlyForecast data={weatherData} />
          <DailyForecast data={weatherData} />
        </div>
      )}

      {/* City Manager Overlay */}
      {isCityManagerOpen && (
        <CityManager onClose={() => setCityManagerOpen(false)} />
      )}
    </main>
  );
}

export default App;

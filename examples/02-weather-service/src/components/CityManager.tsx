import { useState, useEffect } from 'react';
import { Search, MapPin, X, Plus, Trash2, Loader2 } from 'lucide-react';
import { searchCities, type City as SearchCity } from '../api/search';
import { useWeatherStore } from '../store/weatherStore';

interface CityManagerProps {
    onClose: () => void;
}

export const CityManager = ({ onClose }: CityManagerProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchCity[]>([]);
    const [searching, setSearching] = useState(false);
    const { currentCity, savedCities, setCity, addSavedCity, removeSavedCity } = useWeatherStore();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setSearching(true);
                try {
                    const cities = await searchCities(query);
                    setResults(cities);
                } catch (error) {
                    console.error(error);
                    setResults([]);
                } finally {
                    setSearching(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (name: string, lat: number, lon: number) => {
        setCity(name, lat, lon);
        onClose();
    };

    const saveFromSearch = (e: React.MouseEvent, city: SearchCity) => {
        e.stopPropagation();
        addSavedCity({ name: city.name, lat: city.latitude, lon: city.longitude });
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem 1rem'
        }}>
            <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>City Management</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Search */}
                <div style={{ position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                    <input
                        type="text"
                        placeholder="Search city (e.g. Seoul, Tokyo)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3rem',
                            borderRadius: '1rem',
                            border: '1px solid var(--glass-border)',
                            background: 'var(--glass-bg)',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    {searching && (
                        <Loader2 size={20} className="animate-spin" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                    )}
                </div>

                {/* Search Results */}
                {results.length > 0 && (
                    <div className="glass-panel" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {results.map((city) => (
                            <div
                                key={city.id}
                                onClick={() => handleSelect(city.name, city.latitude, city.longitude)}
                                style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid var(--glass-border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={16} opacity={0.5} />
                                    <span>{city.name}, {city.country}</span>
                                </div>
                                <button
                                    onClick={(e) => saveFromSearch(e, city)}
                                    style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer' }}
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Saved Cities */}
                <div>
                    <h3 style={{ fontSize: '0.875rem', opacity: 0.5, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Saved Locations</h3>
                    <div className="glass-panel">
                        {savedCities.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>No saved cities yet.</div>
                        ) : (
                            savedCities.map((city) => (
                                <div
                                    key={`${city.name}-${city.lat}`}
                                    onClick={() => handleSelect(city.name, city.lat, city.lon)}
                                    style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid var(--glass-border)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        background: currentCity.name === city.name ? 'rgba(59, 130, 246, 0.2)' : 'transparent'
                                    }}
                                >
                                    <span style={{ fontWeight: 500 }}>{city.name}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeSavedCity(city.name); }}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7 }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

import { useState, useEffect } from 'react';
import { templeService } from '../../services/templeService';
import LeafletMap from '../../components/common/LeafletMap';

const LocationHelp = () => {
    const [temples, setTemples] = useState([]);
    const [filteredTemples, setFilteredTemples] = useState([]);
    const [selectedTemple, setSelectedTemple] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const filterTemples = () => {
        let filtered = temples;
        
        if (searchQuery.trim()) {
            filtered = filtered.filter(temple => 
                temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                temple.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                temple.state.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        setFilteredTemples(filtered);
    };

    useEffect(() => {
        filterTemples();
    }, [temples, searchQuery]);

    useEffect(() => {
        loadTemples();
    }, []);

    const loadTemples = async () => {
        try {
            const data = await templeService.getAll();
            setTemples(data);
            setFilteredTemples(data);
            if (data.length > 0) {
                setSelectedTemple(data[0]);
            }
        } catch (error) {
            console.error('Failed to load temples:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#FFF9F5', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '3rem' }}>
            <div className="container">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#333', marginBottom: '0.5rem' }}>
                        Location Help
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                        Get directions, transport info, and navigation assistance
                    </p>
                </div>

                {/* Search Bar */}
                <div style={{
                    maxWidth: '600px',
                    margin: '0 auto 2rem',
                    backgroundColor: '#FFF',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '3rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <i className="bi bi-search" style={{ color: '#999', fontSize: '1.25rem' }}></i>
                    <input
                        type="text"
                        placeholder="Search for a temple..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && filterTemples()}
                        style={{
                            border: 'none',
                            outline: 'none',
                            flex: 1,
                            fontSize: '16px'
                        }}
                    />
                    <button
                        onClick={filterTemples}
                        style={{
                            backgroundColor: '#FF6B00',
                            color: '#FFF',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '1.5rem',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Search
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                    {/* Temple List Sidebar */}
                    <div>
                        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Select Temple</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {filteredTemples.map((temple) => (
                                <div
                                    key={temple.id}
                                    onClick={() => setSelectedTemple(temple)}
                                    style={{
                                        padding: '1rem',
                                        backgroundColor: selectedTemple?.id === temple.id ? '#FF6B00' : '#FFF',
                                        color: selectedTemple?.id === temple.id ? '#FFF' : '#333',
                                        borderRadius: '0.75rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: selectedTemple?.id === temple.id ? '0 4px 12px rgba(255,107,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{temple.name}</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                                        <i className="bi bi-geo-alt me-1"></i>
                                        {temple.city}, {temple.state}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Map and Details */}
                    <div>
                        {selectedTemple && (
                            <>
                                {/* Map */}
                                <div style={{
                                    backgroundColor: '#FFF',
                                    borderRadius: '1rem',
                                    padding: '1rem',
                                    marginBottom: '1.5rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}>
                                    <LeafletMap
                                        markers={[{
                                            id: selectedTemple.id,
                                            lat: selectedTemple.latitude || 20.5937,
                                            lng: selectedTemple.longitude || 78.9629,
                                            title: selectedTemple.name,
                                            description: `${selectedTemple.city}, ${selectedTemple.state}`
                                        }]}
                                        center={[selectedTemple.latitude || 20.5937, selectedTemple.longitude || 78.9629]}
                                        zoom={15}
                                        height="400px"
                                    />
                                </div>

                                {/* Temple Details Card */}
                                <div style={{
                                    backgroundColor: '#FFF',
                                    borderRadius: '1rem',
                                    padding: '2rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>{selectedTemple.name}</h2>
                                    <p style={{ color: '#FF6B00', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                                        <i className="bi bi-geo-alt-fill me-2"></i>
                                        {selectedTemple.address || `${selectedTemple.city}, ${selectedTemple.state}`}
                                    </p>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '1rem',
                                                backgroundColor: '#FFF9F5',
                                                borderRadius: '0.5rem'
                                            }}>
                                                <i className="bi bi-clock" style={{ fontSize: '1.5rem', color: '#FF6B00' }}></i>
                                                <div>
                                                    <div style={{ fontSize: '13px', color: '#666' }}>Temple Timing</div>
                                                    <div style={{ fontWeight: '600', color: '#333' }}>3:00 AM - 11:00 PM</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '1rem',
                                                backgroundColor: '#FFF9F5',
                                                borderRadius: '0.5rem'
                                            }}>
                                                <i className="bi bi-telephone" style={{ fontSize: '1.5rem', color: '#FF6B00' }}></i>
                                                <div>
                                                    <div style={{ fontSize: '13px', color: '#666' }}>Helpline</div>
                                                    <div style={{ fontWeight: '600', color: '#333' }}>1800-XXX-XXXX</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* How to Reach */}
                                <div style={{
                                    backgroundColor: '#FFF',
                                    borderRadius: '1rem',
                                    padding: '2rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}>
                                    <h3 style={{ color: '#333', marginBottom: '1.5rem' }}>
                                        <i className="bi bi-signpost-2 me-2" style={{ color: '#FF6B00' }}></i>
                                        How to Reach
                                    </h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{
                                            padding: '1rem',
                                            border: '1px solid #E5E5E5',
                                            borderRadius: '0.5rem'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                <i className="bi bi-train-front" style={{ fontSize: '1.25rem', color: '#FF6B00' }}></i>
                                                <strong>By Train:</strong>
                                            </div>
                                            <p style={{ color: '#666', fontSize: '14px', margin: 0, paddingLeft: '2rem' }}>
                                                {selectedTemple.city} Junction (5km)
                                            </p>
                                        </div>

                                        <div style={{
                                            padding: '1rem',
                                            border: '1px solid #E5E5E5',
                                            borderRadius: '0.5rem'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                <i className="bi bi-airplane" style={{ fontSize: '1.25rem', color: '#FF6B00' }}></i>
                                                <strong>By Air:</strong>
                                            </div>
                                            <p style={{ color: '#666', fontSize: '14px', margin: 0, paddingLeft: '2rem' }}>
                                                {selectedTemple.city} Airport (25km)
                                            </p>
                                        </div>

                                        <div style={{
                                            padding: '1rem',
                                            border: '1px solid #E5E5E5',
                                            borderRadius: '0.5rem'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                <i className="bi bi-bus-front" style={{ fontSize: '1.25rem', color: '#FF6B00' }}></i>
                                                <strong>By Bus:</strong>
                                            </div>
                                            <p style={{ color: '#666', fontSize: '14px', margin: 0, paddingLeft: '2rem' }}>
                                                {selectedTemple.city} Bus Stand (3km)
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                        <button style={{
                                            padding: '0.75rem',
                                            backgroundColor: '#FF6B00',
                                            color: '#FFF',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <i className="bi bi-navigation"></i>
                                            Get Directions
                                        </button>
                                        <button style={{
                                            padding: '0.75rem',
                                            backgroundColor: '#FFF',
                                            color: '#FF6B00',
                                            border: '2px solid #FF6B00',
                                            borderRadius: '0.5rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <i className="bi bi-telephone"></i>
                                            Call Helpline
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationHelp;

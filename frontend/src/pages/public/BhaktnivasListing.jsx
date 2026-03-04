import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { bhaktnivasService } from '../../services/bhaktnivasService';
import { templeService } from '../../services/templeService';
import LeafletMap from '../../components/common/LeafletMap';
import { getImageUrl } from '../../utils/imageUrl';

const BhaktnivasListing = () => {
    const [searchParams] = useSearchParams();
    const [bhaktnivas, setBhaktnivas] = useState([]);
    const [temples, setTemples] = useState([]);
    const [filteredBhaktnivas, setFilteredBhaktnivas] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [filters, setFilters] = useState({
        templeId: searchParams.get('templeId') || '',
        minPrice: '',
        maxPrice: '',
        isAvailable: true,
    });
    const [loading, setLoading] = useState(true);
    const [showMap, setShowMap] = useState(false);

    const filterData = () => {
        let filtered = bhaktnivas;

        if (searchQuery.trim()) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.templeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (temples.find(t => t.id === item.templeId)?.city || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredBhaktnivas(filtered);
    };

    useEffect(() => {
        filterData();
    }, [bhaktnivas, searchQuery, temples]);

    useEffect(() => {
        loadTemples();
        loadBhaktnivas();
    }, []);

    const loadTemples = async () => {
        try {
            const data = await templeService.getAll();
            setTemples(data);
        } catch (error) {
            console.error('Failed to load temples:', error);
        }
    };

    const loadBhaktnivas = async () => {
        setLoading(true);
        try {
            const filterData = {
                templeId: filters.templeId || undefined,
                minPrice: filters.minPrice || undefined,
                maxPrice: filters.maxPrice || undefined,
                isAvailable: filters.isAvailable,
            };
            const data = await bhaktnivasService.getAll(filterData);
            setBhaktnivas(data);
            setFilteredBhaktnivas(data);
        } catch (error) {
            console.error('Failed to load Bhaktnivas:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyPriceFilter = (filter) => {
        setSelectedFilter(filter);
        let min = '', max = '';
        if (filter === 'free') { min = '0'; max = '0'; }
        else if (filter === '<500') { min = '0'; max = '500'; }
        else if (filter === '>500') { min = '500'; max = ''; }

        setFilters({ ...filters, minPrice: min, maxPrice: max });
    };

    useEffect(() => {
        loadBhaktnivas();
    }, [filters]);

    return (
        <div style={{ backgroundColor: '#FFF9F5', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '3rem' }}>
            <div className="container">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#333', marginBottom: '0.5rem' }}>
                        Bhaktnivas Accommodations
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                        Find clean, affordable, and comfortable stays near your favorite temples
                    </p>
                </div>

                {/* Search and Filters */}
                <div style={{
                    backgroundColor: '#FFF',
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    marginBottom: '2rem'
                }}>
                    {/* Search Bar */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #E5E5E5',
                                borderRadius: '0.5rem',
                                padding: '0.5rem 1rem',
                                flex: 1
                            }}>
                                <i className="bi bi-search" style={{ color: '#999', marginRight: '0.5rem' }}></i>
                                <input
                                    type="text"
                                    placeholder="Search by temple, city, or name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && filterData()}
                                    style={{
                                        border: 'none',
                                        outline: 'none',
                                        flex: 1,
                                        fontSize: '16px'
                                    }}
                                />
                            </div>
                            <button
                                onClick={filterData}
                                style={{
                                    backgroundColor: '#FF6B00',
                                    color: '#FFF',
                                    border: 'none',
                                    padding: '0.6rem 1.5rem',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => { setSelectedFilter('all'); setFilters({ ...filters, minPrice: '', maxPrice: '' }); }}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '2rem',
                                backgroundColor: selectedFilter === 'all' ? '#FF6B00' : '#FFF',
                                color: selectedFilter === 'all' ? '#FFF' : '#333',
                                fontWeight: '500',
                                cursor: 'pointer',
                                border: selectedFilter === 'all' ? 'none' : '1px solid #E5E5E5'
                            }}
                        >
                            All
                        </button>
                        <button
                            onClick={() => applyPriceFilter('free')}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '2rem',
                                backgroundColor: selectedFilter === 'free' ? '#FF6B00' : '#FFF',
                                color: selectedFilter === 'free' ? '#FFF' : '#333',
                                fontWeight: '500',
                                cursor: 'pointer',
                                border: selectedFilter === 'free' ? 'none' : '1px solid #E5E5E5'
                            }}
                        >
                            Free
                        </button>
                        <button
                            onClick={() => applyPriceFilter('<500')}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '2rem',
                                backgroundColor: selectedFilter === '<500' ? '#FF6B00' : '#FFF',
                                color: selectedFilter === '<500' ? '#FFF' : '#333',
                                fontWeight: '500',
                                cursor: 'pointer',
                                border: selectedFilter === '<500' ? 'none' : '1px solid #E5E5E5'
                            }}
                        >
                            ≤₹500
                        </button>
                        <button
                            onClick={() => applyPriceFilter('>500')}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '2rem',
                                backgroundColor: selectedFilter === '>500' ? '#FF6B00' : '#FFF',
                                color: selectedFilter === '>500' ? '#FFF' : '#333',
                                fontWeight: '500',
                                cursor: 'pointer',
                                border: selectedFilter === '>500' ? 'none' : '1px solid #E5E5E5'
                            }}
                        >
                            ≥₹500
                        </button>
                    </div>
                </div>

                {/* Results Header */}
                {/*<button style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #E5E5E5',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <i className="bi bi-funnel"></i>
                    More Filters
                </button>*/}
                {/*<button
                    onClick={() => setShowMap(!showMap)}
                    style={{
                        backgroundColor: showMap ? '#FF6B00' : 'transparent',
                        color: showMap ? '#FFF' : '#333',
                        border: showMap ? 'none' : '1px solid #E5E5E5',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginLeft: '0.5rem'
                    }}
                >
                    <i className={`bi ${showMap ? 'bi-list-ul' : 'bi-map'}`}></i>
                    {showMap ? 'List View' : 'Map View'}
                </button>*/}
            </div>

            {/* Content */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner-border" style={{ color: '#FF6B00' }} role="status"></div>
                    <p style={{ marginTop: '1rem', color: '#666' }}>Loading Bhaktnivas...</p>
                </div>
            ) : showMap ? (
                <div style={{
                    backgroundColor: '#FFF',
                    borderRadius: '1rem',
                    padding: '1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    height: '600px'
                }}>
                    <LeafletMap
                        markers={bhaktnivas.map(b => {
                            const temple = temples.find(t => t.id === b.templeId);
                            return {
                                id: b.id,
                                lat: b.latitude || (temple?.latitude ? parseFloat(temple.latitude) : 20.5937),
                                lng: b.longitude || (temple?.longitude ? parseFloat(temple.longitude) : 78.9629),
                                title: b.name,
                                description: `₹${b.pricePerNight} / night • ${b.templeName}`,
                                link: `/bhaktnivas/${b.id}`
                            };
                        })}
                        zoom={5}
                        height="100%"
                    />
                </div>
            ) : filteredBhaktnivas.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {filteredBhaktnivas.map((item) => (
                        <div key={item.id} style={{
                            backgroundColor: '#FFF',
                            borderRadius: '1rem',
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            position: 'relative'
                        }}>
                            {/* Image */}
                            <div style={{
                                height: '200px',
                                backgroundColor: '#E5E5E5',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {item.imageUrl ? (
                                    <img
                                        src={getImageUrl(item, 'bhaktnivas')}
                                        alt={item.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        color: '#999'
                                    }}>
                                        <i className="bi bi-building" style={{ fontSize: '3rem' }}></i>
                                    </div>
                                )}
                                {/* Rating Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    backgroundColor: '#FFF',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}>
                                    <i className="bi bi-star-fill" style={{ color: '#FFB800', fontSize: '12px' }}></i>
                                    4.8
                                </div>

                                {/* Status Badge */}
                                {item.isAvailable ? (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '1rem',
                                        left: '1rem',
                                        backgroundColor: '#34C759',
                                        color: '#FFF',
                                        padding: '0.35rem 1rem',
                                        borderRadius: '2rem',
                                        fontSize: '13px',
                                        fontWeight: '600'
                                    }}>
                                        Available
                                    </div>
                                ) : (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '1rem',
                                        left: '1rem',
                                        backgroundColor: '#FF3B30',
                                        color: '#FFF',
                                        padding: '0.35rem 1rem',
                                        borderRadius: '2rem',
                                        fontSize: '13px',
                                        fontWeight: '600'
                                    }}>
                                        Fully Booked
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div style={{ padding: '1.25rem' }}>
                                <h4 style={{ marginBottom: '0.5rem', color: '#333', fontSize: '1.1rem' }}>
                                    {item.name}
                                </h4>
                                <p style={{ color: '#666', fontSize: '14px', marginBottom: '0.75rem' }}>
                                    <i className="bi bi-geo-alt me-1" style={{ color: '#FF6B00' }}></i>
                                    {item.templeName}
                                </p>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1rem',
                                    paddingTop: '0.75rem',
                                    borderTop: '1px solid #F0F0F0'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FF6B00' }}>
                                            ₹{item.pricePerNight}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#999' }}>per night</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '14px', color: '#666' }}>
                                            <i className="bi bi-people-fill me-1"></i>
                                            Up to {item.capacity}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#999' }}>
                                            {item.distanceFromTemple}
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to={`/bhaktnivas/${item.id}`}
                                    style={{
                                        display: 'block',
                                        backgroundColor: item.isAvailable ? '#FF6B00' : '#E5E5E5',
                                        color: item.isAvailable ? '#FFF' : '#999',
                                        padding: '0.7rem',
                                        textAlign: 'center',
                                        borderRadius: '0.5rem',
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        pointerEvents: item.isAvailable ? 'auto' : 'none'
                                    }}
                                >
                                    {item.isAvailable ? 'View Details' : 'Unavailable'}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    backgroundColor: '#FFF',
                    borderRadius: '1rem'
                }}>
                    <i className="bi bi-building" style={{ fontSize: '4rem', color: '#E5E5E5' }}></i>
                    <h3 style={{ marginTop: '1rem', color: '#333' }}>No Bhaktnivas Found</h3>
                    <p style={{ color: '#666' }}>Try adjusting your filters</p>
                </div>
            )}
        </div>

    );
};

export default BhaktnivasListing;

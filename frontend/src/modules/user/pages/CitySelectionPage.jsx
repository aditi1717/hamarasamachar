import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from '../components/BottomNavbar';

const RAJASTHAN_DISTRICTS = [
    "Ajmer", "Alwar", "Balotra", "Banswara", "Baran", "Barmer", "Beawar", "Bharatpur", "Bhilwara", "Bikaner",
    "Bundi", "Chittorgarh", "Churu", "Dausa", "Deeg", "Dholpur", "Didwana-Kuchaman", "Dudu", "Dungarpur", "Gangapur City",
    "Hanumangarh", "Jaipur", "Jaipur Rural", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Jodhpur Rural",
    "Karauli", "Kekri", "Khairthal-Tijara", "Kota", "Kotputli-Behror", "Nagaur", "Neem Ka Thana", "Pali", "Phalodi",
    "Pratapgarh", "Rajsamand", "Salumbar", "Sanchore", "Sawai Madhopur", "Shahpura", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"
];

function CitySelectionPage() {
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const savedCity = localStorage.getItem('userCity');
        if (savedCity) {
            setSelectedCity(savedCity);
        }
    }, []);

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        localStorage.setItem('userCity', city);
        // Optional: Show toast or feedback
        navigate(-1); // Go back after selection
    };

    const filteredDistricts = RAJASTHAN_DISTRICTS.filter(district =>
        district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white pb-20 sm:pb-24">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 border-b border-gray-200">
                <button
                    onClick={() => navigate(-1)}
                    className="text-orange-600 text-xl sm:text-2xl font-bold hover:opacity-80 transition-opacity"
                    aria-label="Back"
                >
                    ‹
                </button>
                <h2 className="text-sm sm:text-base font-bold text-gray-800">अपना जिला चुनें</h2>
                <div className="w-6 sm:w-8"></div>
            </div>

            {/* Search Bar */}
            <div className="p-4 bg-white sticky top-[50px] z-10">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="जिला खोजें..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 pb-4">
                {selectedCity && !searchTerm && (
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">वर्तमान चयन</h3>
                        <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-lg">
                            <span className="font-medium text-orange-800">{selectedCity}</span>
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                )}

                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">राजस्थान के जिले</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredDistricts.length > 0 ? (
                        filteredDistricts.map((district) => (
                            <button
                                key={district}
                                onClick={() => handleCitySelect(district)}
                                className={`text-left px-4 py-3 rounded-lg border transition-all flex justify-between items-center ${selectedCity === district
                                        ? 'bg-orange-600 text-white border-orange-600'
                                        : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                                    }`}
                            >
                                <span>{district}</span>
                                {selectedCity === district && (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="col-span-1 sm:col-span-2 text-center py-8 text-gray-500">
                            कोई जिला नहीं मिला
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Navbar */}
            <BottomNavbar />
        </div>
    );
}

export default CitySelectionPage;

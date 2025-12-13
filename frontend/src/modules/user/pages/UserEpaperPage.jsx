import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from '../components/BottomNavbar';
import { epaperService } from '../../admin/services/epaperService'; // Importing shared service

// Mock subscription plans
const PLANS = [
    {
        id: 'monthly',
        name: 'मासिक प्लान',
        price: 49,
        period: 'प्रति माह',
        features: ['दैनिक ई-पेपर एक्सेस', 'विज्ञापन मुक्त अनुभव', 'पुराने ई-पेपर आर्काइव']
    },
    {
        id: 'yearly',
        name: 'वार्षिक प्लान',
        price: 499,
        period: 'प्रति वर्ष',
        features: ['दैनिक ई-पेपर एक्सेस', 'विज्ञापन मुक्त अनुभव', 'पुराने ई-पेपर आर्काइव', '2 महीने मुफ्त']
    }
];

function UserEpaperPage() {
    const navigate = useNavigate();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [epapers, setEpapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSubscription, setShowSubscription] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(PLANS[1]); // Default yearly

    useEffect(() => {
        // Check subscription status
        const subscription = localStorage.getItem('userSubscription');
        if (subscription === 'active') {
            setIsSubscribed(true);
        }

        // Load epapers
        fetchEpapers();
    }, []);

    const fetchEpapers = async () => {
        try {
            setLoading(true);
            const res = await epaperService.getAllEpapers();
            setEpapers(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = () => {
        // Simulate Payment
        // In a real app, this would open Payment Gateway
        if (window.confirm(`क्या आप ₹${selectedPlan.price} का भुगतान करना चाहते हैं?`)) {
            localStorage.setItem('userSubscription', 'active');
            setIsSubscribed(true);
            setShowSubscription(false);
            alert('सब्सक्रिप्शन सफल रहा! अब आप ई-पेपर पढ़ सकते हैं।');
        }
    };

    const handleEpaperClick = (paper) => {
        if (!isSubscribed) {
            setShowSubscription(true);
        } else {
            // Open PDF
            window.open(paper.pdfUrl, '_blank');
        }
    };

    if (showSubscription && !isSubscribed) {
        return (
            <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
                {/* Subscription Page Content */}
                <div className="min-h-screen pb-6 relative">
                    <button
                        onClick={() => setShowSubscription(false)}
                        className="absolute top-4 left-4 p-2 bg-gray-100 rounded-full"
                    >
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="bg-[#E21E26] h-48 rounded-b-[40px] flex flex-col items-center justify-center text-white px-4 text-center">
                        <h2 className="text-2xl font-bold mb-2">प्रीमियम सदस्य बनें</h2>
                        <p className="text-[#E21E26]/10 text-sm">दैनिक ई-पेपर और विज्ञापन मुक्त समाचारों का आनंद लें</p>
                    </div>

                    <div className="px-4 -mt-10 space-y-4">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan)}
                                className={`bg-white rounded-xl shadow-lg border-2 p-6 transition-all relative ${selectedPlan.id === plan.id ? 'border-[#E21E26] transform scale-105' : 'border-transparent'
                                    }`}
                            >
                                {plan.id === 'yearly' && (
                                    <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                                        BEST VALUE
                                    </div>
                                )}
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{plan.name}</h3>
                                        <p className="text-gray-500 text-sm">{plan.period}</p>
                                    </div>
                                    <div className="text-2xl font-bold text-[#E21E26]">
                                        ₹{plan.price}
                                    </div>
                                </div>
                                <ul className="space-y-2 mb-4">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 mt-4">
                        <button
                            onClick={handleSubscribe}
                            className="w-full py-3 bg-[#E21E26] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-[#C21A20] transition-colors"
                        >
                            {selectedPlan.name} चुनें (₹{selectedPlan.price})
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-3">
                            नियम और शर्तें लागू। कभी भी रद्द करें।
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="page-transition pb-20 sm:pb-24">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-3 py-2.5 border-b border-gray-200 shadow-sm">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-[#E21E26] text-2xl font-bold"
                    >
                        ‹
                    </button>
                    <h2 className="text-base font-bold text-gray-800">ई-पेपर</h2>
                    <div className="w-8">
                        {/* Optional: Calendar Icon */}
                    </div>
                </div>

                <div className="p-4">
                    {!isSubscribed && (
                        <div
                            onClick={() => setShowSubscription(true)}
                            className="bg-gradient-to-r from-[#E21E26] to-[#C21A20] rounded-xl p-4 text-white hover:shadow-lg transition-all cursor-pointer mb-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-lg">प्रीमियम मेंबरशिप</p>
                                    <p className="text-sm opacity-90">ई-पेपर पढ़ने के लिए अभी सब्सक्राइब करें</p>
                                </div>
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    <h3 className="font-bold text-gray-800 mb-4">हालिया ई-पेपर</h3>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E21E26]"></div>
                        </div>
                    ) : epapers.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {epapers.map((paper) => (
                                <div
                                    key={paper.id}
                                    onClick={() => handleEpaperClick(paper)}
                                    className="bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer relative"
                                >
                                    <div className="aspect-[3/4] bg-gray-200 relative">
                                        <img
                                            src={paper.coverUrl}
                                            alt={paper.date}
                                            className={`w-full h-full object-cover transition-all duration-300 ${!isSubscribed ? 'filter blur-[2px]' : ''}`}
                                        />
                                        {!isSubscribed && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <div className="bg-black/60 p-2 rounded-full">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                                            <p className="text-white text-sm font-medium">
                                                {new Date(paper.date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            कोई ई-पेपर उपलब्ध नहीं है
                        </div>
                    )}
                </div>
            </div>

            <BottomNavbar />
        </div>
    );
}

export default UserEpaperPage;

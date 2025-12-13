import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  useEffect(() => {
    // Prevent body scroll on mount
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.top = '0';
    document.body.style.left = '0';

    // Fix viewport height to prevent shift when keyboard opens
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    // Cleanup: restore body scroll on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';
      document.body.style.left = '';
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  const handleContinue = () => {
    if (mobileNumber.length === 10) {
      navigate('/otp', { state: { mobileNumber: countryCode + mobileNumber } });
    } else {
      alert('कृपया 10 अंकों का मोबाइल नंबर दर्ज करें');
    }
  };

  const handleSkip = () => {
    navigate('/category/breaking');
  };

  const handleInputFocus = (e) => {
    // Prevent page scroll when input is focused
    e.preventDefault();
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 100);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-white flex flex-col" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 shadow-md flex-shrink-0" style={{ backgroundColor: '#E21E26' }}>
        <button
          onClick={() => navigate(-1)}
          className="text-white text-xl sm:text-2xl font-bold hover:opacity-80 transition-opacity"
          aria-label="Back"
        >
          ‹
        </button>
        <h2 className="text-sm sm:text-base font-semibold text-white">लॉगिन</h2>
        <div className="w-6 sm:w-8"></div>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-8 overflow-hidden">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* App Name */}
          <div className="text-center mb-2 sm:mb-3">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              हमारा समाचार
            </h1>
          </div>

          {/* Login Prompt */}
          <div className="mb-2 sm:mb-3">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 text-center leading-snug">
              कृपया लॉगिन करने के लिए अपना मोबाइल नंबर जोड़ें
            </p>
          </div>

          {/* Mobile Number Input */}
          <div className="mb-4">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#E21E26] focus-within:ring-4 focus-within:ring-[#E21E26]/10 transition-all bg-gray-50 hover:bg-white shadow-sm">
              <div className="flex items-center gap-1.5 px-2 py-2 border-r border-gray-200 bg-gray-100/50">
                <span className="text-lg">🇮🇳</span>
                <span className="font-bold text-gray-700 text-xs">{countryCode}</span>
                <span className="text-gray-400 text-[9px]">▼</span>
              </div>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 10) {
                    setMobileNumber(value);
                  }
                }}
                onFocus={handleInputFocus}
                placeholder="मोबाइल नंबर डालें"
                className="flex-1 px-3 py-2.5 outline-none bg-transparent font-medium text-gray-900 placeholder-gray-400 h-full"
                style={{ fontSize: '16px' }}
                maxLength={10}
              />
            </div>
          </div>

          {/* Privacy Message */}
          <div className="flex items-start gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-green-600 text-base sm:text-lg flex-shrink-0 mt-0.5">🔒</span>
            <p className="text-xs sm:text-sm text-gray-600 leading-snug">
              आपकी पर्सनल जानकारी सुरक्षित है। आपका नंबर सिर्फ अकाउंट वेरीफाई करने के लिए ले रहे हैं।
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={mobileNumber.length !== 10}
            className={`w-full py-2.5 rounded-xl font-bold text-sm tracking-wide shadow-md transform transition-all duration-200 active:scale-95 mb-3 ${mobileNumber.length === 10
              ? 'bg-gradient-to-r from-[#E21E26] to-[#C21A20] text-white hover:shadow-[#E21E26]/30 hover:-translate-y-0.5'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              }`}
          >
            आगे बढ़ें
          </button>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="w-full py-1.5 sm:py-2 text-gray-600 text-xs sm:text-sm hover:text-gray-800 transition-colors"
          >
            स्किप करें
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;


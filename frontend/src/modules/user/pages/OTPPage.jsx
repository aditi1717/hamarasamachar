import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OTPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber || '+916264560457';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Prevent body scroll on mount
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Cleanup: restore body scroll on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, canResend]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, ''); // Only numbers
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newOtp = [...otp];
    pastedData.split('').forEach((digit, index) => {
      if (index < 4) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);
    if (pastedData.length === 4 && inputRefs.current[3]) {
      inputRefs.current[3].focus();
    }
  };

  const handleConfirm = () => {
    const otpString = otp.join('');
    if (otpString.length === 4) {
      // TODO: Verify OTP with backend
      // Save mobile number to localStorage
      if (mobileNumber) {
        localStorage.setItem('userMobileNumber', mobileNumber);
      }
      navigate('/profile-setup');
    } else {
      alert('कृपया 4 अंकों का OTP दर्ज करें');
    }
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '']);
    // TODO: Resend OTP
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  const handleChangeNumber = () => {
    navigate('/login');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-white flex flex-col page-transition" style={{ height: '100dvh' }}>
      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 shadow-md flex-shrink-0" style={{ backgroundColor: '#E21E26' }}>
        <button
          onClick={() => navigate(-1)}
          className="text-white text-xl sm:text-2xl font-bold hover:opacity-80 transition-opacity"
          aria-label="Back"
        >
          ‹
        </button>
        <h2 className="text-sm sm:text-base font-semibold text-white">OTP वेरीफिकेशन</h2>
        <div className="w-6 sm:w-8"></div>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 overflow-hidden">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Instruction */}
          <p className="text-center text-sm sm:text-base text-gray-900 mb-4 sm:mb-5 leading-snug">
            {mobileNumber} पर भेजे गये 4 अंकों का कोड दर्ज करें
          </p>

          {/* OTP Input Fields */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-5 sm:mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 rounded-xl outline-none transition-all shadow-sm ${digit
                  ? 'border-[#E21E26] bg-[#E21E26]/5 text-[#E21E26]'
                  : 'border-gray-200 bg-white focus:border-[#E21E26] focus:ring-4 focus:ring-[#E21E26]/10'
                  }`}
              />
            ))}
          </div>

          {/* Action Links */}
          <div className="flex justify-between mb-4 sm:mb-5">
            <button
              onClick={handleChangeNumber}
              className="text-[#E21E26] text-xs sm:text-sm font-medium hover:opacity-80 transition-opacity"
            >
              नंबर बदलना है?
            </button>
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`text-xs sm:text-sm font-medium transition-opacity ${canResend ? 'text-[#E21E26] hover:opacity-80' : 'text-gray-400'
                }`}
            >
              OTP दोबारा भेजें {!canResend && `(${formatTime(timer)})`}
            </button>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={otp.join('').length !== 4}
            className={`w-full py-2.5 rounded-xl font-bold text-sm tracking-wide shadow-md transform transition-all duration-200 active:scale-95 mb-3 ${otp.join('').length === 4
              ? 'bg-gradient-to-r from-[#E21E26] to-[#C21A20] text-white hover:shadow-[#E21E26]/30 hover:-translate-y-0.5'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              }`}
          >
            पुष्टि करें
          </button>

          {/* Skip Button */}
          <button
            onClick={() => navigate('/profile-setup')}
            className="w-full py-1.5 sm:py-2 text-gray-600 text-xs sm:text-sm hover:text-gray-800 transition-colors"
          >
            स्किप करें
          </button>
        </div>
      </div>
    </div>
  );
}

export default OTPPage;


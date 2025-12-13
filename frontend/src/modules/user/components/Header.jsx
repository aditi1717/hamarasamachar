import { useNavigate } from 'react-router-dom';
import logo from '../assets/samachar-logo.png';

function Header() {
  const navigate = useNavigate();

  const handleBellClick = () => {
    navigate('/notifications');
  };

  return (
    <header
      className="sticky top-0 z-20 w-full overflow-hidden"
      style={{ backgroundColor: '#E21E26' }}
    >
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 py-2 sm:py-2.5">
        {/* Left Logo Container */}
        <div className="flex-shrink-0 h-10 sm:h-12 md:h-14 w-28 sm:w-36 overflow-visible flex items-center">
          <img
            src={logo}
            alt="हमारा समाचार Logo"
            className="h-full w-auto object-contain"
            style={{ transform: 'scale(1.5)', transformOrigin: 'left center' }}
          />
        </div>

        {/* Right Icons - Only Bell */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Bell Icon */}
          <button
            onClick={handleBellClick}
            className="text-white hover:opacity-80 transition-opacity flex-shrink-0 relative"
            aria-label="Notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 sm:h-7 sm:w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Notification Badge Mockup */}
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-[#E21E26] bg-yellow-400"></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

import { useState, useEffect } from 'react';
import { bannerService } from '../../admin/services/bannerService';

function Banner({ position = 'news_feed', category = null }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, [position, category]);

  const loadBanners = async () => {
    try {
      const allBanners = await bannerService.getByPosition(position, category);
      setBanners(allBanners);
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerClick = (banner) => {
    // Track click
    if (banner.link) {
      if (banner.target === '_blank') {
        window.open(banner.link, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = banner.link;
      }
    }
  };

  // Use placeholder banner if no banners found
  const getPlaceholderBanner = () => {
    // Random placeholder banner from picsum.photos (similar to Google placeholder)
    const randomId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/800/200?random=${randomId}`;
  };

  if (loading) {
    return null;
  }

  // Get banner from service or use placeholder
  let banner = null;
  let bannerImage = null;

  if (banners.length > 0) {
    banner = banners[0];
    // Handle both old format (imageUrl) and new format (images array)
    bannerImage = banner.images && banner.images.length > 0 
      ? banner.images[0].url 
      : banner.imageUrl;
  }

  // Use placeholder if no banner found
  if (!bannerImage) {
    bannerImage = getPlaceholderBanner();
  }

  return (
    <div className="w-full my-4 sm:my-5">
      <div className="w-full max-w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div 
          className="w-full cursor-pointer"
          onClick={() => banner && handleBannerClick(banner)}
        >
          <img
            src={bannerImage}
            alt={banner?.title || 'Advertisement'}
            className="w-full h-auto min-h-[200px] sm:min-h-[250px] object-cover"
            onError={(e) => {
              // If image fails, try another placeholder
              e.target.src = getPlaceholderBanner();
            }}
          />
        </div>
        {/* Category Badge Below Banner */}
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 flex justify-center">
          <span
            className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide shadow-sm inline-block"
            style={{
              backgroundColor: '#666666',
              color: '#FFFFFF'
            }}
          >
            विज्ञापन
          </span>
        </div>
      </div>
    </div>
  );
}

export default Banner;


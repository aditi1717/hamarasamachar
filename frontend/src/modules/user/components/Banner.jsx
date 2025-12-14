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
    <div className="w-full my-4 sm:my-5 flex justify-center">
      <div 
        className="w-full max-w-full cursor-pointer"
        onClick={() => banner && handleBannerClick(banner)}
      >
        <img
          src={bannerImage}
          alt={banner?.title || 'Advertisement'}
          className="w-full h-auto rounded-lg"
          onError={(e) => {
            // If image fails, try another placeholder
            e.target.src = getPlaceholderBanner();
          }}
        />
      </div>
    </div>
  );
}

export default Banner;


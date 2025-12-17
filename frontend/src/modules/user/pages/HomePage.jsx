import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import BreakingNewsBanner from '../components/BreakingNewsBanner';
import CategoryMenu from '../components/CategoryMenu';
import DistrictFilter from '../components/DistrictFilter';
import NewsCard from '../components/NewsCard';
import BottomNavbar from '../components/BottomNavbar';
import Banner from '../components/Banner';
import { CATEGORY_SLUGS } from '../constants/categories';
import { DISTRICT_SLUGS } from '../constants/districts';
import { getAllCategories } from '../services/categoryService';
import { getNewsByCategory as fetchNewsByCategory } from '../services/newsService';

function HomePage() {
  const navigate = useNavigate();
  const { categorySlug, districtSlug } = useParams();
  const [categorySlugMap, setCategorySlugMap] = useState(CATEGORY_SLUGS); // Map of category name to slug
  const [apiCategories, setApiCategories] = useState([]); // Store API categories

  // Load categories from API to build slug map
  useEffect(() => {
    const loadCategorySlugs = async () => {
      try {
        const categories = await getAllCategories();
        if (categories && categories.length > 0) {
          setApiCategories(categories);
          // Build slug map from API categories
          const slugMap = {};
          categories.forEach(cat => {
            if (cat.name && cat.slug) {
              slugMap[cat.name] = cat.slug;
            }
          });
          // Merge with constants for fallback
          setCategorySlugMap({ ...CATEGORY_SLUGS, ...slugMap });
        }
      } catch (error) {
        console.error('Error loading category slugs:', error);
        // Keep using constants
      }
    };
    loadCategorySlugs();
  }, []);

  // Get category from URL slug - check API categories first, then fallback
  const getCategoryFromSlug = (slug) => {
    if (!slug) {
      // Return first API category or default
      return apiCategories.length > 0 ? apiCategories[0].name : 'ब्रेकिंग';
    }
    
    // First check API categories
    const apiCategory = apiCategories.find(cat => cat.slug === slug);
    if (apiCategory) {
      return apiCategory.name;
    }
    
    // Fallback to constants
    const category = Object.keys(categorySlugMap).find(
      key => categorySlugMap[key] === slug
    );
    return category || (apiCategories.length > 0 ? apiCategories[0].name : 'ब्रेकिंग');
  };

  // Get district from URL slug or default to 'सभी जिले'
  const getDistrictFromSlug = (slug) => {
    if (!slug) return 'सभी जिले';
    const district = Object.keys(DISTRICT_SLUGS).find(
      key => DISTRICT_SLUGS[key] === slug
    );
    return district || 'सभी जिले';
  };

  const [selectedCategory, setSelectedCategory] = useState(
    getCategoryFromSlug(categorySlug)
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    getDistrictFromSlug(districtSlug)
  );
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update category from URL when it changes
  useEffect(() => {
    const category = getCategoryFromSlug(categorySlug);
    if (category !== selectedCategory) {
      setSelectedCategory(category);
    }
  }, [categorySlug, selectedCategory]);

  // Update district from URL when it changes
  useEffect(() => {
    if (selectedCategory === 'राजस्थान') {
      const district = getDistrictFromSlug(districtSlug);
      if (district !== selectedDistrict) {
        setSelectedDistrict(district);
      }
    }
  }, [districtSlug, selectedCategory, selectedDistrict]);

  // Update URL on initial load if no category in URL
  useEffect(() => {
    if (!categorySlug && selectedCategory === 'ब्रेकिंग') {
      navigate('/category/breaking', { replace: true });
    }
  }, []);

  // Update news data when category or district changes - using API
  useEffect(() => {
    const loadNews = async () => {
      // Don't load if no category selected or categories haven't been loaded yet (unless using fallback)
      if (!selectedCategory) {
        return;
      }

      // For "ब्रेकिंग", we can load immediately (uses isBreakingNews flag, no category slug needed)
      // For other categories, wait for categories to load or use fallback slug map
      if (selectedCategory !== 'ब्रेकिंग' && apiCategories.length === 0 && !categorySlugMap[selectedCategory]) {
        // Still loading categories, wait a bit
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Get category slug from API categories or fallback to constants
        // For "ब्रेकिंग", slug is not needed (uses isBreakingNews flag)
        const categorySlug = selectedCategory === 'ब्रेकिंग' 
          ? null 
          : (apiCategories.find(cat => cat.name === selectedCategory)?.slug 
            || categorySlugMap[selectedCategory] 
            || selectedCategory.toLowerCase().replace(/\s+/g, '-'));
        
        // Fetch news using same logic as mock data
        // Special case: "ब्रेकिंग" uses isBreakingNews flag (not a category)
        // Special case: राजस्थान can filter by district
        const news = await fetchNewsByCategory(
          selectedCategory,  // category name (for logic)
          categorySlug,      // category slug (for API, null for breaking)
          selectedDistrict === 'सभी जिले' ? null : selectedDistrict, // district (null if "all")
          { page: 1, limit: 50 }
        );
        
        setNewsData(news);
      } catch (err) {
        console.error('Error loading news:', err);
        setError(err.message);
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [selectedCategory, selectedDistrict, apiCategories, categorySlugMap]);

  const handleCategoryChange = (category, slug) => {
    setSelectedCategory(category);
    // Use provided slug from API, or fallback to constants
    const categorySlug = slug || CATEGORY_SLUGS[category] || category.toLowerCase().replace(/\s+/g, '-');
    
    if (category === 'राजस्थान') {
      // If switching to राजस्थान, keep current district or default to 'all'
      const districtSlug = selectedDistrict === 'सभी जिले'
        ? 'all'
        : (DISTRICT_SLUGS[selectedDistrict] || 'all');
      navigate(`/category/${categorySlug}/${districtSlug}`, { replace: true });
    } else {
      navigate(`/category/${categorySlug}`, { replace: true });
      // Reset district filter when category changes
      setSelectedDistrict('सभी जिले');
    }
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    // Update URL with district slug if राजस्थान category
    if (selectedCategory === 'राजस्थान') {
      const categorySlug = categorySlugMap['राजस्थान'] || CATEGORY_SLUGS['राजस्थान'] || 'rajasthan';
      const districtSlug = district === 'सभी जिले'
        ? 'all'
        : (DISTRICT_SLUGS[district] || 'all');
      navigate(`/category/${categorySlug}/${districtSlug}`, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="page-transition">
        {/* Header */}
        <Header />

        {/* Breaking News Banner */}
        <BreakingNewsBanner />

        {/* Category Menu */}
        <CategoryMenu 
          onCategoryChange={handleCategoryChange} 
          activeCategory={selectedCategory}
        />

        {/* District Filter - Only show for राजस्थान category */}
        {selectedCategory === 'राजस्थान' && (
          <DistrictFilter
            selectedDistrict={selectedDistrict}
            onDistrictChange={handleDistrictChange}
          />
        )}

        {/* News Content */}
        <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-2 sm:py-3 pb-20 sm:pb-24">
          <div className="space-y-0">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-500">समाचार लोड हो रहे हैं...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  पुनः प्रयास करें
                </button>
              </div>
            ) : newsData.length > 0 ? (
              newsData.map((news, index) => (
                <div key={news.id}>
                  <NewsCard news={news} />
                  {/* Show banner only after the first news item */}
                  {index === 0 && <Banner position="news_feed" category={selectedCategory} />}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">इस श्रेणी में कोई समाचार नहीं मिला</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}

export default HomePage;

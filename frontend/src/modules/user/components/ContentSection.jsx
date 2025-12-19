import { useNavigate } from 'react-router-dom';

function ContentSection({ section, onShare, newsId = null }) {
  const navigate = useNavigate();
  if (!section || !section.type) return null;

  // Add styles for HTML content rendering
  const htmlContentStyles = `
    .news-content-html h1 { font-size: 1.875rem; font-weight: 700; margin-bottom: 1rem; margin-top: 1.5rem; line-height: 1.3; color: #111827; }
    .news-content-html h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; margin-top: 1.25rem; line-height: 1.4; color: #111827; }
    .news-content-html h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; margin-top: 1rem; line-height: 1.4; color: #111827; }
    .news-content-html h4 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 0.75rem; line-height: 1.4; color: #111827; }
    .news-content-html p { margin-bottom: 1rem; line-height: 1.8; color: #1f2937; font-size: 1rem; }
    .news-content-html ul, .news-content-html ol { margin-bottom: 1rem; padding-left: 1.5rem; line-height: 1.8; }
    .news-content-html ul { list-style-type: disc; }
    .news-content-html ol { list-style-type: decimal; }
    .news-content-html li { margin-bottom: 0.5rem; color: #1f2937; }
    .news-content-html blockquote { border-left: 4px solid #E5E7EB; padding-left: 1rem; margin-left: 0; margin: 1rem 0; color: #4b5563; font-style: italic; background-color: #f9fafb; padding: 1rem; border-radius: 0.25rem; }
    .news-content-html a { color: #2563eb; text-decoration: underline; }
    .news-content-html a:hover { color: #1d4ed8; }
    .news-content-html img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1.5rem 0; border: 1px solid #e5e7eb; }
    .news-content-html video { max-width: 100%; border-radius: 0.5rem; margin: 1.5rem 0; border: 1px solid #e5e7eb; }
    .news-content-html img[data-align="left"], .news-content-html video[data-align="left"] { display: block; margin-left: 0; margin-right: auto; }
    .news-content-html img[data-align="center"], .news-content-html video[data-align="center"] { display: block; margin-left: auto; margin-right: auto; }
    .news-content-html img[data-align="right"], .news-content-html video[data-align="right"] { display: block; margin-left: auto; margin-right: 0; }
    .news-content-html table { border-collapse: collapse; width: 100%; margin: 1.5rem 0; border: 1px solid #d1d5db; border-radius: 0.5rem; overflow: hidden; }
    .news-content-html table td, .news-content-html table th { border: 1px solid #d1d5db; padding: 0.75rem; }
    .news-content-html table th { background-color: #f3f4f6; font-weight: 600; }
    .news-content-html table tr:nth-child(even) { background-color: #f9fafb; }
    .news-content-html strong { font-weight: 600; color: #111827; }
    .news-content-html em { font-style: italic; }
    .news-content-html u { text-decoration: underline; }
    .news-content-html code { background-color: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875em; }
    .news-content-html pre { background-color: #1f2937; color: #f9fafb; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
    .news-content-html pre code { background-color: transparent; color: inherit; padding: 0; }
  `;

  const handleShare = () => {
    if (onShare) {
      onShare();
    }
  };

  const handleVideoClick = () => {
    if (section.type === 'video' && section.url && newsId) {
      // Navigate to reels section with video ID
      navigate(`/shorts?video=${newsId}`);
    }
  };

  return (
    <>
      <style>{htmlContentStyles}</style>
      {(() => {
        switch (section.type) {
    case 'heading':
      return (
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 mt-4 sm:mt-5 first:mt-0">
          {section.content}
        </h2>
      );

    case 'paragraph':
      // Strip HTML tags to prevent showing tags as text
      const stripHtmlTags = (html) => {
        if (!html || typeof html !== 'string') return html || '';
        // Check if content contains HTML tags
        if (!/<[^>]*>/g.test(html)) {
          return html; // No HTML tags, return as is
        }
        // Remove HTML tags but keep text content
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        const textContent = tmp.textContent || tmp.innerText || '';
        return textContent.trim();
      };
      
      const cleanContent = stripHtmlTags(section.content);
      
      // Render plain text (HTML tags already stripped)
      return (
        <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed">
          {cleanContent}
        </p>
      );

    case 'html':
      return (
        <div 
          className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed prose prose-sm sm:prose-base max-w-none news-content-html"
          dangerouslySetInnerHTML={{ __html: section.content }}
          style={{
            lineHeight: '1.8',
            fontSize: '16px',
            color: '#1f2937'
          }}
        />
      );

    case 'image':
      return (
        <div className="my-4 sm:my-5 border border-gray-200 rounded-lg overflow-hidden bg-white">
          <img
            src={section.url}
            alt={section.alt || 'News Image'}
            className="w-full"
            onError={(e) => {
              e.target.src = `https://picsum.photos/800/400?random=${newsId || Math.random()}`;
            }}
            loading="lazy"
          />
          {/* Share Button below Image */}
          {onShare && (
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 px-4 bg-gray-100 hover:bg-gray-200 transition-colors text-sm sm:text-base font-medium text-gray-700"
              aria-label="Share Image"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>शेयर करें</span>
            </button>
          )}
        </div>
      );

    case 'video':
      if (!section.url) return null;
      return (
        <div className="my-4 sm:my-5 border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div 
            className="w-full h-64 sm:h-80 md:h-96 relative bg-gray-200 cursor-pointer"
            onClick={handleVideoClick}
          >
            <video
              src={section.url}
              className="w-full h-full object-cover"
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              style={{ pointerEvents: 'none' }}
            />
          </div>
          {/* Share Button below Video */}
          {onShare && (
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 px-4 bg-gray-100 hover:bg-gray-200 transition-colors text-sm sm:text-base font-medium text-gray-700"
              aria-label="Share Video"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>शेयर करें</span>
            </button>
          )}
        </div>
      );

    case 'bullet':
      if (!section.items || !Array.isArray(section.items)) return null;
      return (
        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base md:text-lg text-gray-800 ml-2 sm:ml-4">
          {section.items.map((item, itemIndex) => (
            <li key={itemIndex} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      );

    default:
      return null;
        }
      })()}
    </>
  );
}

export default ContentSection;


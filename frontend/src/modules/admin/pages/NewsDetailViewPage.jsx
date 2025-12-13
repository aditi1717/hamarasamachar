import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Form from '../components/Form';
import ProtectedRoute from '../components/ProtectedRoute';
import { COLORS } from '../constants/colors';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

function NewsDetailViewPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast, showToast, hideToast } = useToast();
    const { confirmDialog, showConfirm } = useConfirm();
    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState(null);

    // Mock data - In real app, fetch from API
    useEffect(() => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setNews({
                id: parseInt(id),
                title: 'नमूना समाचार शीर्षक - यह एक लंबा शीर्षक है जो कई पंक्तियों में फैल सकता है',
                category: 'राजनीति',
                categorySlug: 'politics',
                district: 'जयपुर',
                districtSlug: 'jaipur',
                featuredImage: 'https://via.placeholder.com/800x450',
                videoUrl: '',
                isBreakingNews: true,
                content: `
                    <h2>मुख्य समाचार</h2>
                    <p>यह एक नमूना समाचार सामग्री है जो विस्तृत जानकारी प्रदान करती है। यहाँ पर आप समाचार की पूरी जानकारी देख सकते हैं।</p>
                    <p>समाचार में कई महत्वपूर्ण बिंदु शामिल हैं जो पाठकों के लिए उपयोगी हो सकते हैं।</p>
                    <h3>महत्वपूर्ण जानकारी</h3>
                    <ul>
                        <li>पहला बिंदु</li>
                        <li>दूसरा बिंदु</li>
                        <li>तीसरा बिंदु</li>
                    </ul>
                    <p>यह समाचार विभिन्न स्रोतों से एकत्रित जानकारी पर आधारित है और पाठकों को सटीक और समय पर जानकारी प्रदान करने का प्रयास करता है।</p>
                `,
                author: 'राजेश कुमार',
                publishDate: '2024-12-12',
                status: 'published',
                metaDescription: 'यह एक नमूना विवरण है जो SEO के लिए उपयोगी है।',
                tags: 'समाचार, ब्रेकिंग, राजनीति, चुनाव',
                views: 12500,
                createdAt: '2024-12-10T10:30:00',
                updatedAt: '2024-12-12T15:45:00'
            });
            setLoading(false);
        }, 800);
    }, [id]);

    const handleDelete = async () => {
        const confirmed = await showConfirm({
            message: 'क्या आप वाकई इस समाचार को हटाना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।',
            type: 'danger'
        });
        if (confirmed) {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                showToast('समाचार सफलतापूर्वक हटा दिया गया!', 'success');
                setTimeout(() => navigate('/admin/news'), 1500);
            }, 1000);
        }
    };

    const handleTogglePublish = () => {
        const newStatus = news.status === 'published' ? 'draft' : 'published';
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setNews({ ...news, status: newStatus });
            setLoading(false);
            showToast(`समाचार ${newStatus === 'published' ? 'प्रकाशित' : 'ड्राफ्ट'} में बदल दिया गया!`, 'success');
        }, 1000);
    };

    const handleViewPublished = () => {
        window.open(`/news/${id}`, '_blank');
    };

    if (loading && !news) {
        return (
            <ProtectedRoute>
                <Layout title="समाचार विवरण" showPageHeader={true}>
                    <div className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E21E26] mx-auto mb-4"></div>
                            <p className="text-gray-600">लोड हो रहा है...</p>
                        </div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    if (!news) {
        return (
            <ProtectedRoute>
                <Layout title="समाचार नहीं मिला" showPageHeader={true}>
                    <div className="p-4 sm:p-6 text-center">
                        <p className="text-gray-600 mb-4">समाचार नहीं मिला</p>
                        <Form.Button
                            variant="secondary"
                            onClick={() => navigate('/admin/news')}
                        >
                            वापस जाएं
                        </Form.Button>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            {toast && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={hideToast} />}
            {confirmDialog && (
                <ConfirmDialog
                    isOpen={!!confirmDialog}
                    message={confirmDialog.message}
                    type={confirmDialog.type}
                    onConfirm={confirmDialog.onConfirm}
                    onCancel={confirmDialog.onCancel}
                />
            )}
            <Layout
                title="समाचार विवरण"
                showPageHeader={true}
                pageHeaderRightContent={
                    <div className="flex items-center gap-2">
                        <Form.Button
                            variant="secondary"
                            onClick={handleViewPublished}
                            className="text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            प्रकाशित संस्करण देखें
                        </Form.Button>
                    </div>
                }
            >
                <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex flex-wrap items-center gap-2">
                            <Form.Button
                                variant="primary"
                                onClick={() => navigate(`/admin/news/edit/${id}`)}
                                disabled={loading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                </svg>
                                संपादित करें
                            </Form.Button>
                            <Form.Button
                                variant={news.status === 'published' ? 'secondary' : 'primary'}
                                onClick={handleTogglePublish}
                                disabled={loading}
                            >
                                {news.status === 'published' ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 6 6 18" />
                                            <path d="m6 6 12 12" />
                                        </svg>
                                        अप्रकाशित करें
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <path d="m9 11 3 3L22 4" />
                                        </svg>
                                        प्रकाशित करें
                                    </>
                                )}
                            </Form.Button>
                        </div>
                        <Form.Button
                            variant="danger"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                            हटाएं
                        </Form.Button>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Featured Image/Video */}
                        {news.featuredImage && (
                            <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-100">
                                <img
                                    src={news.featuredImage}
                                    alt={news.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {news.videoUrl && (
                            <div className="w-full bg-gray-900 aspect-video">
                                <video
                                    src={news.videoUrl}
                                    controls
                                    className="w-full h-full"
                                />
                            </div>
                        )}

                        <div className="p-4 sm:p-6 space-y-6">
                            {/* Title and Status */}
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    {news.isBreakingNews && (
                                        <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase">
                                            ब्रेकिंग न्यूज़
                                        </span>
                                    )}
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        news.status === 'published'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {news.status === 'published' ? 'प्रकाशित' : 'ड्राफ्ट'}
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                    {news.title}
                                </h1>
                            </div>

                            {/* Meta Information */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">श्रेणी</p>
                                    <p className="text-sm font-medium text-gray-900">{news.category}</p>
                                </div>
                                {news.district && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">जिला</p>
                                        <p className="text-sm font-medium text-gray-900">{news.district}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">लेखक</p>
                                    <p className="text-sm font-medium text-gray-900">{news.author || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">प्रकाशन तिथि</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(news.publishDate).toLocaleDateString('hi-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">विचार</p>
                                    <p className="text-sm font-medium text-gray-900">{news.views?.toLocaleString('hi-IN') || 0}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">ID</p>
                                    <p className="text-sm font-medium text-gray-900">#{news.id}</p>
                                </div>
                            </div>

                            {/* Tags */}
                            {news.tags && (
                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 mb-2">टैग्स</p>
                                    <div className="flex flex-wrap gap-2">
                                        {news.tags.split(',').map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                            >
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Meta Description */}
                            {news.metaDescription && (
                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 mb-2">SEO विवरण</p>
                                    <p className="text-sm text-gray-700">{news.metaDescription}</p>
                                </div>
                            )}

                            {/* Content Preview */}
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-3">सामग्री</p>
                                <div
                                    className="prose prose-sm sm:prose-base max-w-none text-gray-700"
                                    dangerouslySetInnerHTML={{ __html: news.content }}
                                    style={{
                                        lineHeight: '1.8',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>

                            {/* Timestamps */}
                            <div className="pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500">
                                <div>
                                    <p className="mb-1">बनाया गया:</p>
                                    <p className="font-medium text-gray-700">
                                        {news.createdAt ? new Date(news.createdAt).toLocaleString('hi-IN') : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1">अंतिम अपडेट:</p>
                                    <p className="font-medium text-gray-700">
                                        {news.updatedAt ? new Date(news.updatedAt).toLocaleString('hi-IN') : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}

export default NewsDetailViewPage;


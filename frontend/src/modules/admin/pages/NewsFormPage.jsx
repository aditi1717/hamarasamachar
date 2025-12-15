import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Form from '../components/Form';
import TipTapEditor from '../components/TipTapEditor';
import { COLORS } from '../constants/colors';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

function NewsFormPage() {
    const navigate = useNavigate();
    const { id } = useParams(); // For edit mode
    const isEditMode = !!id;
    const { toast, showToast, hideToast } = useToast();
    const { confirmDialog, showConfirm } = useConfirm();

    const [loading, setLoading] = useState(false);
    const [autoSaving, setAutoSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        district: '',
        featuredImage: '',
        videoUrl: '',
        isBreakingNews: false,
        content: '',
        author: '',
        publishDate: new Date().toISOString().split('T')[0],
        status: 'draft',
        metaDescription: '',
        tags: ''
    });

    // Mock auto-save interval
    useEffect(() => {
        const interval = setInterval(() => {
            if (formData.title && formData.content) {
                setAutoSaving(true);
                setTimeout(() => setAutoSaving(false), 800);
            }
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [formData]);

    // Load data for edit mode (Mock)
    useEffect(() => {
        if (isEditMode) {
            // fetch data based on id
            setLoading(true);
            setTimeout(() => {
                setFormData({
                    title: 'नमूना समाचार शीर्षक',
                    category: 'politics',
                    district: '',
                    featuredImage: 'https://via.placeholder.com/600x400',
                    videoUrl: '',
                    isBreakingNews: true,
                    content: '<p>यह एक नमूना समाचार सामग्री है। <br/> कृपया इसे संपादित करें।</p>',
                    author: 'एडमिन',
                    publishDate: '2024-12-12',
                    status: 'published',
                    metaDescription: 'यह एक नमूना विवरण है।',
                    tags: 'समाचार, ब्रेकिंग, राजनीति'
                });
                setLoading(false);
            }, 800);
        }
    }, [isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditorChange = (html) => {
        setFormData(prev => ({ ...prev, content: html }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            showToast(
                isEditMode ? 'समाचार सफलतापूर्वक अपडेट किया गया!' : 'समाचार सफलतापूर्वक बनाया गया!',
                'success'
            );
            setTimeout(() => navigate('/admin/news'), 1500);
        }, 1500);
    };

    const handleDelete = async () => {
        const confirmed = await showConfirm({
            message: 'क्या आप वाकई इस समाचार को हटाना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।',
            type: 'danger'
        });
        if (confirmed) {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                setLoading(false);
                showToast('समाचार सफलतापूर्वक हटा दिया गया!', 'success');
                setTimeout(() => navigate('/admin/news'), 1500);
            }, 1000);
        }
    };

    return (
        <>
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
                title={isEditMode ? "समाचार संपादित करें" : "नया समाचार जोड़ें"}
                showPageHeader={true}
                pageHeaderRightContent={
                    <div className="flex items-center gap-2">
                        {autoSaving && <span className="text-gray-500 text-sm animate-pulse">स्वत: सहेजा जा रहा है...</span>}
                        {isEditMode && (
                            <button
                                onClick={() => window.open(`/news/${id}`, '_blank')}
                                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                प्रकाशित संस्करण देखें
                            </button>
                        )}
                    </div>
                }
            >
                <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
                    <Form onSubmit={handleSubmit} className="space-y-6">

                        {/* Top Section: Main Info */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-6">

                            <div className="lg:col-span-2 space-y-4">
                                <Form.Field
                                    label="समाचार शीर्षक (Title)"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="यहाँ शीर्षक लिखें..."
                                    required
                                    className="text-lg font-medium"
                                />

                                {/* Media URL Field */}
                                <Form.Field
                                    label="मीडिया URL (Image/Video URL)"
                                    name="mediaUrl"
                                    value={formData.videoUrl || formData.featuredImage}
                                    onChange={(e) => {
                                        const url = e.target.value;
                                        // Auto-detect if it's video or image
                                        if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('.mp4') || url.includes('.webm') || url.includes('video')) {
                                            setFormData(prev => ({ ...prev, videoUrl: url, featuredImage: '' }));
                                        } else if (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.gif') || url.includes('image')) {
                                            setFormData(prev => ({ ...prev, featuredImage: url, videoUrl: '' }));
                                        } else {
                                            // Default to image if unclear
                                            setFormData(prev => ({ ...prev, featuredImage: url, videoUrl: '' }));
                                        }
                                    }}
                                    placeholder="Image या Video URL दर्ज करें..."
                                />
                                {(formData.videoUrl || formData.featuredImage) && (
                                    <div className="mt-2">
                                        {formData.videoUrl ? (
                                            <div className="text-xs text-blue-600 break-all">Video URL: {formData.videoUrl}</div>
                                        ) : (
                                            <img src={formData.featuredImage} alt="Preview" className="w-full h-32 object-cover rounded border" />
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        विवरण (Content) <span className="text-red-500">*</span>
                                    </label>
                                    <TipTapEditor
                                        content={formData.content}
                                        onChange={handleEditorChange}
                                        placeholder="विस्तृत समाचार यहाँ लिखें (Bold, Images, Videos आदि का उपयोग करें)..."
                                    />
                                </div>

                                <Form.Field
                                    label="मेटा विवरण (SEO Description)"
                                    name="metaDescription"
                                    type="textarea"
                                    value={formData.metaDescription}
                                    onChange={handleChange}
                                    placeholder="160 अक्षरों के भीतर संक्षिप्त विवरण..."
                                    rows={3}
                                    maxLength={160}
                                />
                            </div>

                            {/* Sidebar Settings */}
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-200">
                                    <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">सेटिंग्स</h3>

                                    <Form.Field
                                        label="श्रेणी (Category)"
                                        name="category"
                                        type="select"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { value: '', label: 'चुनें...' },
                                            { value: 'politics', label: 'राजनीति' },
                                            { value: 'sports', label: 'खेलकूद' },
                                            { value: 'technology', label: 'टेक्नोलॉजी' },
                                            { value: 'entertainment', label: 'मनोरंजन' },
                                            { value: 'rajasthan', label: 'राजस्थान' },
                                            { value: 'other', label: 'अन्य' },
                                        ]}
                                    />

                                    {formData.category === 'rajasthan' && (
                                        <Form.Field
                                            label="जिला (District)"
                                            name="district"
                                            type="select"
                                            value={formData.district}
                                            onChange={handleChange}
                                            options={[
                                                { value: '', label: 'चुनें...' },
                                                { value: 'jaipur', label: 'जयपुर' },
                                                { value: 'jodhpur', label: 'जोधपुर' },
                                                { value: 'kota', label: 'कोटा' },
                                                { value: 'udaipur', label: 'उदयपुर' },
                                            ]}
                                        />
                                    )}

                                    <Form.Field
                                        label="स्थिति (Status)"
                                        name="status"
                                        type="select"
                                        value={formData.status}
                                        onChange={handleChange}
                                        options={[
                                            { value: 'draft', label: 'ड्राफ्ट (Draft)' },
                                            { value: 'published', label: 'प्रकाशित (Published)' },
                                            { value: 'archived', label: 'संग्रहीत (Archived)' },
                                        ]}
                                    />

                                    <Form.Field
                                        label="प्रकाशन तिथि (Publish Date)"
                                        name="publishDate"
                                        type="date"
                                        value={formData.publishDate}
                                        onChange={handleChange}
                                    />

                                    <Form.Field
                                        label="लेखक (Author)"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        placeholder="लेखक का नाम"
                                    />

                                    <div className="flex items-center gap-2 pt-2">
                                        <input
                                            type="checkbox"
                                            id="isBreakingNews"
                                            name="isBreakingNews"
                                            checked={formData.isBreakingNews}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-[#E21E26] focus:ring-[#E21E26] border-gray-300 rounded"
                                        />
                                        <label htmlFor="isBreakingNews" className="text-sm font-medium text-gray-700">
                                            इसे ब्रेकिंग न्यूज़ बनाएं
                                        </label>
                                    </div>

                                    <Form.Field
                                        label="टैग्स (Tags)"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        placeholder="कोमा से अलग करें (e.g. चुनाव, 2024)"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
                            {isEditMode && (
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
                            )}
                            <div className="flex items-center gap-3 ml-auto">
                                <Form.Button
                                    variant="secondary"
                                    onClick={() => navigate('/admin/news')}
                                    disabled={loading}
                                >
                                    रद्द करें
                                </Form.Button>
                                <Form.Button
                                    type="submit"
                                    variant="primary"
                                    loading={loading || autoSaving}
                                >
                                    {isEditMode ? 'अपडेट करें' : 'प्रकाशित करें'}
                                </Form.Button>
                            </div>
                        </div>

                    </Form>
                </div>
            </Layout>
        </>
    );
}

export default NewsFormPage;

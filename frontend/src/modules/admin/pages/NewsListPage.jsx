import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Form from '../components/Form';
import { COLORS } from '../constants/colors';
import ProtectedRoute from '../components/ProtectedRoute';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

function NewsListPage() {
    const navigate = useNavigate();
    const { toast, showToast, hideToast } = useToast();
    const { confirmDialog, showConfirm } = useConfirm();
    const [selectedItems, setSelectedItems] = useState([]);

    // Filters state
    const [filters, setFilters] = useState({
        status: '',
        category: '',
        author: '',
        dateRange: ''
    });

    // Mock Data
    const [news, setNews] = useState([
        {
            id: 1,
            title: 'बजट 2024: किसानों के लिए बड़ी घोषणाएं',
            category: 'राजनीति',
            author: 'राजेश कुमार',
            date: '2024-02-01',
            status: 'published',
            views: 12500
        },
        {
            id: 2,
            title: 'भारत ने जीता रोमांचक क्रिकेट मैच',
            category: 'खेलकूद',
            author: 'अमित वर्मा',
            date: '2024-01-28',
            status: 'published',
            views: 45000
        },
        {
            id: 3,
            title: 'नई इलेक्ट्रिक कार लॉन्च, जानें फीचर्स',
            category: 'टेक्नोलॉजी',
            author: 'प्रिया सिंह',
            date: '2024-02-02',
            status: 'draft',
            views: 0
        },
        {
            id: 4,
            title: 'शहर में भारी बारिश का अलर्ट',
            category: 'मौसम',
            author: 'सुनील शर्मा',
            date: '2024-02-03',
            status: 'published',
            views: 8900
        },
        {
            id: 5,
            title: 'फिल्म जगत की ताजा खबरें',
            category: 'मनोरंजन',
            author: 'नेहा गुप्ता',
            date: '2024-01-30',
            status: 'draft',
            views: 0
        }
    ]);

    // Columns Configuration
    const columns = [
        {
            key: 'select',
            label: (
                <input
                    type="checkbox"
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedItems(news.map(n => n.id));
                        } else {
                            setSelectedItems([]);
                        }
                    }}
                    checked={selectedItems.length === news.length && news.length > 0}
                    className="rounded border-gray-300 text-[#E21E26] focus:ring-[#E21E26]"
                />
            ),
            render: (_, row) => (
                <input
                    type="checkbox"
                    checked={selectedItems.includes(row.id)}
                    onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                            setSelectedItems([...selectedItems, row.id]);
                        } else {
                            setSelectedItems(selectedItems.filter(id => id !== row.id));
                        }
                    }}
                    className="rounded border-gray-300 text-[#E21E26] focus:ring-[#E21E26]"
                />
            ),
            sortable: false
        },
        { key: 'id', label: 'ID', sortable: true },
        {
            key: 'title',
            label: 'शीर्षक',
            sortable: true,
            render: (val) => <span className="font-medium text-gray-900 line-clamp-2">{val}</span>
        },
        {
            key: 'category',
            label: 'श्रेणी',
            sortable: true,
            render: (val) => (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {val}
                </span>
            )
        },
        { key: 'author', label: 'लेखक', sortable: true },
        {
            key: 'date',
            label: 'दिनांक',
            sortable: true,
            render: (val) => new Date(val).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        },
        {
            key: 'status',
            label: 'स्थिति',
            sortable: true,
            render: (val, row) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleStatusToggle(row.id);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${val === 'published'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                >
                    {val === 'published' ? 'प्रकाशित' : 'ड्राफ्ट'}
                </button>
            )
        }
    ];

    // Actions
    const handleStatusToggle = (id) => {
        setNews(news.map(item =>
            item.id === id
                ? { ...item, status: item.status === 'published' ? 'draft' : 'published' }
                : item
        ));
    };

    const handleBulkAction = async (action) => {
        if (selectedItems.length === 0) return;

        const confirmed = await showConfirm({
            message: `क्या आप वाकई ${selectedItems.length} समाचारों पर यह कार्रवाई करना चाहते हैं?`,
            type: 'warning'
        });
        if (confirmed) {
            if (action === 'delete') {
                setNews(news.filter(n => !selectedItems.includes(n.id)));
                showToast(`${selectedItems.length} समाचार सफलतापूर्वक हटा दिए गए!`, 'success');
            } else if (action === 'publish') {
                setNews(news.map(n => selectedItems.includes(n.id) ? { ...n, status: 'published' } : n));
                showToast(`${selectedItems.length} समाचार प्रकाशित किए गए!`, 'success');
            }
            setSelectedItems([]);
        }
    };

    const rowActions = [
        {
            label: 'देखें',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            ),
            onClick: (row) => navigate(`/admin/news/view/${row.id}`),
            variant: 'secondary'
        },
        {
            label: 'संपादित करें',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                </svg>
            ),
            onClick: (row) => navigate(`/admin/news/edit/${row.id}`),
            variant: 'secondary'
        },
        {
            label: 'डुप्लिकेट',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
            ),
            onClick: (row) => {
                const newId = Math.max(...news.map(n => n.id)) + 1;
                const newItem = { ...row, id: newId, title: `${row.title} (Copy)`, status: 'draft' };
                setNews([newItem, ...news]);
            },
            variant: 'secondary'
        },
        {
            label: 'हटाएं',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
            ),
            onClick: async (row) => {
                const confirmed = await showConfirm({
                    message: 'क्या आप वाकई इस समाचार को हटाना चाहते हैं?',
                    type: 'danger'
                });
                if (confirmed) {
                    setNews(news.filter(n => n.id !== row.id));
                    showToast('समाचार सफलतापूर्वक हटा दिया गया!', 'success');
                }
            },
            variant: 'danger'
        }
    ];

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
            <Layout title="समाचार प्रबंधन" showPageHeader={true}>
                <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
                    {/* Actions Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <button
                            onClick={() => navigate('/admin/news/create')}
                            className="px-4 py-2 bg-[#E21E26] text-white rounded-lg hover:bg-[#C21A20] transition-colors font-semibold flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                            नया समाचार जोड़ें
                        </button>

                        {/* Bulk Actions */}
                        {selectedItems.length > 0 && (
                            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm animate-fade-in">
                                <span className="px-3 text-sm font-medium text-gray-600 border-r border-gray-200">
                                    {selectedItems.length} चयनित
                                </span>
                                <button
                                    onClick={() => handleBulkAction('publish')}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                                    title="प्रकाशित करें"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <path d="m9 11 3 3L22 4" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleBulkAction('delete')}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                    title="हटाएं"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <Form.Field
                            type="select"
                            name="category"
                            placeholder="श्रेणी चुनें"
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            options={[
                                { value: '', label: 'सभी श्रेणियाँ' },
                                { value: 'politics', label: 'राजनीति' },
                                { value: 'sports', label: 'खेलकूद' },
                                { value: 'technology', label: 'टेक्नोलॉजी' },
                                { value: 'entertainment', label: 'मनोरंजन' }
                            ]}
                        />
                        <Form.Field
                            type="select"
                            name="status"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            options={[
                                { value: '', label: 'सभी स्थितियाँ' },
                                { value: 'published', label: 'प्रकाशित' },
                                { value: 'draft', label: 'ड्राफ्ट' }
                            ]}
                        />
                        <Form.Field
                            type="select"
                            name="author"
                            value={filters.author}
                            onChange={(e) => setFilters({ ...filters, author: e.target.value })}
                            options={[
                                { value: '', label: 'सभी लेखक' },
                                { value: 'admin', label: 'एडमिन' },
                                { value: 'rajesh', label: 'राजेश कुमार' },
                                { value: 'amit', label: 'अमित वर्मा' }
                            ]}
                        />
                        <Form.Field
                            type="date"
                            name="date"
                            value={filters.dateRange}
                            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                            placeholder="तिथि चुनें"
                        />
                    </div>

                    {/* News Table */}
                    <Table
                        columns={columns}
                        data={news}
                        searchable={true}
                        sortable={true}
                        actions={rowActions}
                        className="shadow-sm"
                        emptyMessage="कोई समाचार नहीं मिला"
                    />

                    {/* Pagination (Static Mock) */}
                    <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-500">
                            कुल <span className="font-semibold">{news.length}</span> समाचार
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>पिछला</button>
                            <button className="px-3 py-1 border rounded bg-[#E21E26] text-white">1</button>
                            <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
                            <button className="px-3 py-1 border rounded hover:bg-gray-50">अगला</button>
                        </div>
                    </div>

                </div>
            </Layout>
        </ProtectedRoute>
    );
}

export default NewsListPage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { COLORS } from '../constants/colors';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Form from '../components/Form';

function CategoryListPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'श्रेणियाँ लोड करने में विफल' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`क्या आप "${category.name}" श्रेणी को हटाना चाहते हैं?`)) {
      return;
    }

    try {
      await categoryService.delete(category.id);
      setMessage({ type: 'success', text: 'श्रेणी सफलतापूर्वक हटाई गई' });
      loadCategories();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'श्रेणी हटाने में विफल' });
    }
  };

  const handleBulkAction = (action) => {
    if (selectedItems.length === 0) return;
    if (confirm(`क्या आप वाकई ${selectedItems.length} श्रेणियों पर यह कार्रवाई करना चाहते हैं?`)) {
      // Mock implementation for now
      setMessage({ type: 'success', text: 'Bulk action completed successfully' });
      setSelectedItems([]);
    }
  };

  const columns = [
    {
      key: 'select',
      label: (
        <input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems(categories.map(n => n.id));
            } else {
              setSelectedItems([]);
            }
          }}
          checked={selectedItems.length === categories.length && categories.length > 0}
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
    {
      key: 'name',
      label: 'श्रेणी नाम',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row.icon && <span className="text-lg">{row.icon}</span>}
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    {
      key: 'newsCount',
      label: 'समाचार संख्या',
      sortable: true,
      render: (value) => (
        <span className="font-semibold" style={{ color: COLORS.header.bg }}>
          {value || 0}
        </span>
      )
    },
    {
      key: 'order',
      label: 'क्रम',
      sortable: true
    },
    {
      key: 'status',
      label: 'स्थिति',
      render: (value) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${value === 'active'
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
        >
          {value === 'active' ? 'सक्रिय' : 'निष्क्रिय'}
        </span>
      )
    }
  ];

  const actions = [
    {
      label: 'संपादित करें',
      variant: 'secondary',
      onClick: (row) => navigate(`/admin/categories/edit/${row.id}`),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      label: 'हटाएं',
      variant: 'danger',
      onClick: handleDelete,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )
    }
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout title="श्रेणियाँ">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: COLORS.header.bg }}></div>
              <p className="text-gray-600">लोड हो रहा है...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout title="श्रेणियाँ" showPageHeader={true}>
        <div className="p-4 sm:p-6 space-y-6">

          {/* Message */}
          {message.text && (
            <div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              {message.text}
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <button
              onClick={() => navigate('/admin/categories/add')}
              className="px-4 py-2 bg-[#E21E26] text-white rounded-lg hover:bg-[#C21A20] transition-colors font-semibold flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14m-7-7h14" />
              </svg>
              नई श्रेणी जोड़ें
            </button>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm animate-fade-in">
                <span className="px-3 text-sm font-medium text-gray-600 border-r border-gray-200">
                  {selectedItems.length} चयनित
                </span>
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

          {/* Filters (Simulated to match News UI) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="col-span-1 sm:col-span-2 relative">
              <input
                type="text"
                placeholder="श्रेणी खोजें..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E21E26] focus:border-[#E21E26] outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="col-span-1">
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E21E26] focus:border-[#E21E26] outline-none">
                <option value="">सभी स्थितियाँ</option>
                <option value="active">सक्रिय</option>
                <option value="inactive">निष्क्रिय</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            data={categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))}
            searchable={false} // We have external search now
            sortable={true}
            actions={actions}
            className="shadow-sm"
            emptyMessage="कोई श्रेणी नहीं मिली"
          />

          {/* Pagination (Static Mock) */}
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">
              कुल <span className="font-semibold">{categories.length}</span> श्रेणियाँ
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

export default CategoryListPage;

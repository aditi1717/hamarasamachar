import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import Form from '../components/Form';
import { userService } from '../services/userService';
import { useToast } from '../hooks/useToast';
import ProtectedRoute from '../components/ProtectedRoute';

const UserDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, [id]);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const data = await userService.getUserById(id);
            setUser(data);
        } catch (error) {
            showToast('उपयोगकर्ता विवरण लोड करने में विफल', 'error');
            navigate('/admin/users');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        setEditingUser({ ...user });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.updateUser(editingUser.id, editingUser);
            setUser(editingUser); // Optimistic update or re-fetch
            showToast('उपयोगकर्ता विवरण अपडेट किया गया', 'success');
            setIsEditModalOpen(false);
        } catch (error) {
            showToast('अपडेट करने में विफल', 'error');
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <Layout title="उपयोगकर्ता विवरण">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E21E26]"></div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    if (!user) return null;

    return (
        <ProtectedRoute>
            <Layout
                title="उपयोगकर्ता विवरण"
                showPageHeader={true}
                headerActions={
                    <div className="flex gap-2">
                        <button
                            onClick={handleEditClick}
                            className="px-4 py-2 bg-[#E21E26] text-white rounded-lg hover:bg-[#C21A20] transition-colors"
                        >
                            संपादित करें
                        </button>
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            वापस जाएं
                        </button>
                    </div>
                }
            >
                <div className="p-4 sm:p-6 space-y-6">
                    {/* Profile Header */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-bold">
                            {user.name ? user.name[0] : user.phone.slice(-1)}
                        </div>
                        <div className="flex-1 text-center sm:text-left space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900">{user.phone}</h2>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {user.status}
                                </span>
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                    {user.gender}
                                </span>
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                                    श्रेणी: {user.selectedCategory}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm">
                                पंजीकरण तिथि: {new Date(user.registrationDate).toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                            <p className="text-gray-500 mb-1">बुकमार्क की गई खबरें</p>
                            <h3 className="text-3xl font-bold text-gray-900">{user.stats.bookmarks}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                            <p className="text-gray-500 mb-1">कुल व्यूज</p>
                            <h3 className="text-3xl font-bold text-gray-900">{user.stats.views}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                            <p className="text-gray-500 mb-1">कमेंट्स/रिव्यु</p>
                            <h3 className="text-3xl font-bold text-gray-900">{user.stats.comments}</h3>
                        </div>
                    </div>

                    {/* Bookmarks & Recent Activity (Mock) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 font-semibold text-lg text-gray-800">
                                हालिया बुकमार्क्स
                            </div>
                            <div className="p-4 text-center text-gray-500 py-8">
                                कोई डेटा उपलब्ध नहीं
                                {/* Here you would map through bookmarks */}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 font-semibold text-lg text-gray-800">
                                फीडबैक और रेटिंग्स
                            </div>
                            <div className="p-4 text-center text-gray-500 py-8">
                                कोई डेटा उपलब्ध नहीं
                                {/* Here you would map through specific user feedbacks */}
                            </div>
                        </div>
                    </div>

                    {/* Edit Modal */}
                    <Modal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        title="उपयोगकर्ता संपादित करें"
                    >
                        {editingUser && (
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <Form.Field
                                    label="फ़ोन नंबर"
                                    value={editingUser.phone}
                                    disabled={true}
                                    type="text"
                                />

                                <Form.Field
                                    label="लिंग"
                                    type="select"
                                    value={editingUser.gender}
                                    onChange={(e) => setEditingUser({ ...editingUser, gender: e.target.value })}
                                    options={[
                                        { label: 'पुरुष', value: 'Male' },
                                        { label: 'महिला', value: 'Female' },
                                        { label: 'अन्य', value: 'Other' }
                                    ]}
                                />

                                <Form.Field
                                    label="जन्म तिथि"
                                    type="date"
                                    value={editingUser.birthdate ? editingUser.birthdate.split('T')[0] : ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, birthdate: e.target.value })}
                                />

                                <Form.Field
                                    label="श्रेणी"
                                    type="select"
                                    value={editingUser.selectedCategory}
                                    onChange={(e) => setEditingUser({ ...editingUser, selectedCategory: e.target.value })}
                                    options={[
                                        { label: 'राजनीति', value: 'Politics' },
                                        { label: 'खेल', value: 'Sports' },
                                        { label: 'टेक्नोलॉजी', value: 'Technology' },
                                        { label: 'मनोरंजन', value: 'Entertainment' }
                                    ]}
                                />

                                <Form.Field
                                    label="स्थितिस"
                                    type="select"
                                    value={editingUser.status}
                                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                                    options={[
                                        { label: 'सक्रिय', value: 'Active' },
                                        { label: 'ब्लॉक', value: 'Blocked' }
                                    ]}
                                />

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                                    >
                                        रद्द करें
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#E21E26] text-white rounded hover:bg-[#C21A20]"
                                    >
                                        सेव करें
                                    </button>
                                </div>
                            </form>
                        )}
                    </Modal>
                </div>
            </Layout>
        </ProtectedRoute>
    );
};

export default UserDetailsPage;

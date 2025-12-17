import { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import Form from '../components/Form';
import Table from '../components/Table';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { COLORS } from '../constants/colors';
import {
  createPlan,
  deletePlan,
  getPlans,
  getSubscribers,
} from '../services/planService';

function SubscriptionPlansPage() {
  const { toast, showToast, hideToast } = useToast();
  const [plans, setPlans] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    billingCycle: 'monthly',
    price: '',
    description: '',
  });

  useEffect(() => {
    setPlans(getPlans());
    setSubscribers(getSubscribers());
  }, []);

  const planSummary = useMemo(() => {
    const monthly = plans.filter((p) => p.billingCycle === 'monthly').length;
    const yearly = plans.filter((p) => p.billingCycle === 'yearly').length;
    return { total: plans.length, monthly, yearly };
  }, [plans]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePlan = (e) => {
    e.preventDefault();
    const { name, billingCycle, price, description } = formData;

    if (!name.trim()) {
      showToast('प्लान का नाम दर्ज करें', 'error');
      return;
    }

    const parsedPrice = Number(price);
    if (!parsedPrice || parsedPrice <= 0) {
      showToast('मान्य कीमत दर्ज करें', 'error');
      return;
    }

    const newPlan = createPlan({
      name: name.trim(),
      billingCycle,
      price: parsedPrice,
      description: description.trim(),
    });

    setPlans((prev) => [newPlan, ...prev]);
    setFormData({
      name: '',
      billingCycle: 'monthly',
      price: '',
      description: '',
    });
    showToast('नया प्लान जोड़ दिया गया', 'success');
  };

  const handleDeletePlan = (plan) => {
    const confirmDelete = window.confirm(`"${plan.name}" प्लान हटाएं?`);
    if (!confirmDelete) return;

    const updatedPlans = deletePlan(plan.id);
    setPlans(updatedPlans);
    showToast('प्लान हटाया गया', 'info');
  };

  const planColumns = [
    {
      key: 'name',
      label: 'प्लान',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-semibold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">
            {row.billingCycle === 'monthly' ? 'मासिक' : 'वार्षिक'}
          </p>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'कीमत',
      sortable: true,
      render: (value, row) => (
        <span className="font-semibold" style={{ color: COLORS.header.bg }}>
          ₹{Number(value || 0).toLocaleString('en-IN')} /{' '}
          {row.billingCycle === 'monthly' ? 'माह' : 'वर्ष'}
        </span>
      ),
    },
    {
      key: 'description',
      label: 'विवरण',
      className: 'hidden md:table-cell',
      render: (value) => value || '—',
    },
  ];

  const planActions = [
    {
      label: 'हटाएं',
      variant: 'danger',
      onClick: (row) => handleDeletePlan(row),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
    },
  ];

  const subscriberColumns = [
    {
      key: 'name',
      label: 'उपयोगकर्ता',
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-semibold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">
            {row.email} · {row.phone}
          </p>
        </div>
      ),
    },
    {
      key: 'planName',
      label: 'प्लान',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{value}</span>
          <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            {row.billingCycle === 'monthly' ? 'मासिक' : 'वार्षिक'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'स्थिति',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            value === 'Active'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-gray-100 text-gray-700 border border-gray-200'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'भुगतान',
      sortable: true,
      render: (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`,
    },
    {
      key: 'startDate',
      label: 'प्रारंभ',
      sortable: true,
    },
    {
      key: 'endDate',
      label: 'समाप्ति',
      className: 'hidden md:table-cell',
      sortable: true,
    },
  ];

  return (
    <ProtectedRoute>
      <Layout
        title="सब्सक्रिप्शन प्लान"
        pageHeaderRightContent={
          <span className="text-xs sm:text-sm text-gray-500">
            यह फीचर केवल फ्रंटएंड (लोकल स्टोरेज) पर चलता है
          </span>
        }
      >
        <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">कुल प्लान</p>
              <p className="text-2xl font-bold text-gray-900">{planSummary.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">मासिक</p>
              <p className="text-2xl font-bold text-gray-900">{planSummary.monthly}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">वार्षिक</p>
              <p className="text-2xl font-bold text-gray-900">{planSummary.yearly}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
            {/* Create plan form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">नया प्लान जोड़ें</h3>
              <Form onSubmit={handleCreatePlan}>
                <Form.Field
                  label="प्लान का नाम"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="जैसे: प्रीमियम मासिक"
                  required
                />
                <Form.Field
                  label="बिलिंग चक्र"
                  name="billingCycle"
                  type="select"
                  value={formData.billingCycle}
                  onChange={handleInputChange}
                  options={[
                    { label: 'मासिक', value: 'monthly' },
                    { label: 'वार्षिक', value: 'yearly' },
                  ]}
                />
                <Form.Field
                  label="कीमत (₹)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="उदाहरण: 149"
                  min="1"
                  step="1"
                  required
                />
                <Form.Field
                  label="संक्षिप्त विवरण"
                  name="description"
                  type="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="जैसे: 30 दिन की सभी खबरें अनलॉक"
                />
                <Form.Actions>
                  <Form.Button type="submit" variant="primary">
                    प्लान बनाएँ
                  </Form.Button>
                  <Form.Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setFormData({
                        name: '',
                        billingCycle: 'monthly',
                        price: '',
                        description: '',
                      })
                    }
                  >
                    रीसेट
                  </Form.Button>
                </Form.Actions>
              </Form>
            </div>

            {/* Plan table */}
            <div className="lg:col-span-2">
              <Table
                columns={planColumns}
                data={plans}
                sortable
                searchable
                actions={planActions}
                emptyMessage="अभी कोई प्लान नहीं है"
              />
            </div>
          </div>

          {/* Subscribers table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">सब्सक्राइब किए उपयोगकर्ता</h3>
              <span className="text-xs sm:text-sm text-gray-500">
                {subscribers.length} रिकॉर्ड्स · केवल डेमो डेटा
              </span>
            </div>
            <Table
              columns={subscriberColumns}
              data={subscribers}
              sortable
              searchable
              emptyMessage="सब्सक्रिप्शन रिकॉर्ड उपलब्ध नहीं"
            />
          </div>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={hideToast}
          />
        )}
      </Layout>
    </ProtectedRoute>
  );
}

export default SubscriptionPlansPage;


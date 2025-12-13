
// Mock data for feedbacks
let feedbacks = [
    {
        id: 1,
        type: 'App Feedback',
        text: 'Great app! The interface is very smooth.',
        user: { name: 'Rahul Sharma', contact: 'rahul@example.com' },
        date: '2025-12-10T10:30:00Z',
        status: 'New',
    },
    {
        id: 2,
        type: 'News Feedback',
        text: 'The news about the election coverage was biased.',
        user: { name: 'Priya Verma', contact: 'priya@example.com' },
        date: '2025-12-11T14:15:00Z',
        status: 'Read',
    },
    {
        id: 3,
        type: 'App Feedback',
        text: 'Font size is too small on mobile.',
        user: null, // Anonymous
        date: '2025-12-12T09:00:00Z',
        status: 'Resolved',
    },
    {
        id: 4,
        type: 'News Feedback',
        text: 'Please add more local news for Jaipur.',
        user: { name: 'Amit Singh', contact: 'amit@example.com' },
        date: '2025-12-13T08:45:00Z',
        status: 'New',
    },
    {
        id: 5,
        type: 'App Feedback',
        text: 'Dark mode is not working properly.',
        user: { name: 'Suresh Raina', contact: 'suresh@example.com' },
        date: '2025-12-13T11:20:00Z',
        status: 'New',
    },
];

const matchText = (text, query) => {
    if (!query) return true;
    return text.toLowerCase().includes(query.toLowerCase());
}

export const feedbackService = {
    getAllFeedbacks: async (filters = {}) => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                let filtered = [...feedbacks];

                if (filters.type && filters.type !== 'All') {
                    filtered = filtered.filter(f => f.type === filters.type);
                }

                if (filters.status && filters.status !== 'All') {
                    filtered = filtered.filter(f => f.status === filters.status);
                }

                if (filters.search) {
                    filtered = filtered.filter(f => matchText(f.text, filters.search) || (f.user && matchText(f.user.name, filters.search)));
                }

                if (filters.startDate && filters.endDate) {
                    const start = new Date(filters.startDate).getTime();
                    const end = new Date(filters.endDate).getTime();
                    filtered = filtered.filter(f => {
                        const fDate = new Date(f.date).getTime();
                        return fDate >= start && fDate <= end;
                    });
                }

                // Sort by date desc
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

                resolve({ data: filtered, total: filtered.length });
            }, 500);
        });
    },

    getFeedbackById: async (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const feedback = feedbacks.find(f => f.id === parseInt(id));
                if (feedback) resolve(feedback);
                else reject(new Error('Feedback not found'));
            }, 300);
        });
    },

    updateStatus: async (id, status) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                feedbacks = feedbacks.map(f =>
                    f.id === id ? { ...f, status } : f
                );
                resolve({ success: true });
            }, 300);
        });
    },

    deleteFeedback: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                feedbacks = feedbacks.filter(f => f.id !== id);
                resolve({ success: true });
            }, 300);
        });
    },

    getUnreadCount: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const count = feedbacks.filter(f => f.status === 'New').length;
                resolve(count);
            }, 300);
        });
    }
};

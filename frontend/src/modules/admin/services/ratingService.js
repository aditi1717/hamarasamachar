
// Mock data for ratings
let ratings = [
    {
        id: 1,
        rating: 5,
        comment: 'Best news app I have used!',
        user: { name: 'Rahul Sharma', contact: 'rahul@example.com' },
        date: '2025-12-10T10:30:00Z',
        reply: '',
    },
    {
        id: 2,
        rating: 3,
        comment: 'Too many ads.',
        user: { name: 'Priya Verma', contact: 'priya@example.com' },
        date: '2025-12-11T14:15:00Z',
        reply: 'We are working on optimizing ads.',
    },
    {
        id: 3,
        rating: 4,
        comment: 'Good content but UI needs improvement.',
        user: { name: 'Amit Singh', contact: 'amit@example.com' },
        date: '2025-12-12T09:00:00Z',
        reply: '',
    },
    {
        id: 4,
        rating: 1,
        comment: 'App crashes frequently.',
        user: { name: 'Suresh Raina', contact: 'suresh@example.com' },
        date: '2025-12-13T08:45:00Z',
        reply: '',
    },
    {
        id: 5,
        rating: 5,
        comment: 'Excellent coverage of local news.',
        user: { name: 'Deepa Gupta', contact: 'deepa@example.com' },
        date: '2025-12-13T11:20:00Z',
        reply: '',
    },
];

const matchText = (text, query) => {
    if (!query) return true;
    return text.toLowerCase().includes(query.toLowerCase());
};

export const ratingService = {
    getAllRatings: async (filters = {}) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filtered = [...ratings];

                if (filters.rating && filters.rating !== 'All') {
                    filtered = filtered.filter(rn => rn.rating === parseInt(filters.rating));
                }

                if (filters.search) {
                    filtered = filtered.filter(rn => matchText(rn.comment, filters.search) || (rn.user && matchText(rn.user.name, filters.search)));
                }

                if (filters.startDate && filters.endDate) {
                    const start = new Date(filters.startDate).getTime();
                    const end = new Date(filters.endDate).getTime();
                    filtered = filtered.filter(rn => {
                        const rDate = new Date(rn.date).getTime();
                        return rDate >= start && rDate <= end;
                    });
                }

                // Sort
                if (filters.sortBy === 'rating') {
                    filtered.sort((a, b) => b.rating - a.rating);
                } else {
                    // Date desc default
                    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                }

                resolve({ data: filtered, total: filtered.length });
            }, 500);
        });
    },

    getRatingStats: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const total = ratings.length;
                const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
                const avg = total > 0 ? (sum / total).toFixed(1) : 0;

                // Recent 5
                const recent = [...ratings].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

                resolve({
                    average: avg,
                    total: total,
                    recent: recent
                });
            }, 300);
        });
    },

    addReply: async (id, replyText) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                ratings = ratings.map(r =>
                    r.id === id ? { ...r, reply: replyText } : r
                );
                resolve({ success: true });
            }, 300);
        });
    },

    deleteRating: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                ratings = ratings.filter(r => r.id !== id);
                resolve({ success: true });
            }, 300);
        });
    }
};


// Mock data for users
let users = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    phone: `+91 ${9000000000 + i}`,
    gender: i % 2 === 0 ? 'Male' : 'Female',
    birthdate: new Date(1990 + i, 0, 1).toISOString(),
    status: i % 10 === 0 ? 'Blocked' : 'Active',
    registrationDate: new Date(2024, 0, 1 + i).toISOString(),
    selectedCategory: i % 3 === 0 ? 'Politics' : i % 3 === 1 ? 'Sports' : 'Technology',
    stats: {
        bookmarks: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 20),
    }
}));

const matchText = (text, query) => {
    if (!query) return true;
    return text.toLowerCase().includes(query.toLowerCase());
}

export const userService = {
    getAllUsers: async (filters = {}) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filtered = [...users];

                if (filters.status && filters.status !== 'All') {
                    filtered = filtered.filter(u => u.status === filters.status);
                }

                if (filters.search) {
                    filtered = filtered.filter(u => matchText(u.phone, filters.search));
                }

                if (filters.startDate && filters.endDate) {
                    const start = new Date(filters.startDate).getTime();
                    const end = new Date(filters.endDate).getTime();
                    filtered = filtered.filter(u => {
                        const uDate = new Date(u.registrationDate).getTime();
                        return uDate >= start && uDate <= end;
                    });
                }

                // Sort by registration date desc
                filtered.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));

                resolve({ data: filtered, total: filtered.length });
            }, 500);
        });
    },

    getUserById: async (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = users.find(u => u.id === parseInt(id));
                if (user) resolve(user);
                else reject(new Error('User not found'));
            }, 300);
        });
    },

    updateUser: async (id, data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                users = users.map(u =>
                    u.id === id ? { ...u, ...data } : u
                );
                resolve({ success: true });
            }, 300);
        });
    },

    updateUserStatus: async (id, status) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                users = users.map(u =>
                    u.id === id ? { ...u, status } : u
                );
                resolve({ success: true });
            }, 300);
        });
    },

    deleteUser: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                users = users.filter(u => u.id !== id);
                resolve({ success: true });
            }, 300);
        });
    },

    bulkUpdateStatus: async (ids, status) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                users = users.map(u => ids.includes(u.id) ? { ...u, status } : u);
                resolve({ success: true });
            }, 300);
        });
    },

    bulkDelete: async (ids) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                users = users.filter(u => !ids.includes(u.id));
                resolve({ success: true });
            }, 300);
        });
    },

    getUserStats: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const total = users.length;
                const active = users.filter(u => u.status === 'Active').length;
                const newUsers = users.filter(u => {
                    const date = new Date(u.registrationDate);
                    const now = new Date();
                    const diffTime = Math.abs(now - date);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays <= 7;
                }).length;

                resolve({
                    total,
                    active,
                    newUsers
                });
            }, 300);
        });
    }
};

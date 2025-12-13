
// Mock data for e-papers
let epapers = [
    {
        id: 1,
        date: '2025-12-13',
        pdfUrl: '/mock-epaper-2025-12-13.pdf',
        coverUrl: 'https://via.placeholder.com/150x200?text=E-paper+13+Dec',
        fileName: 'epaper_13_dec_2025.pdf',
        views: 120
    },
    {
        id: 2,
        date: '2025-12-12',
        pdfUrl: '/mock-epaper-2025-12-12.pdf',
        coverUrl: 'https://via.placeholder.com/150x200?text=E-paper+12+Dec',
        fileName: 'epaper_12_dec_2025.pdf',
        views: 340
    },
    {
        id: 3,
        date: '2025-12-11',
        pdfUrl: '/mock-epaper-2025-12-11.pdf',
        coverUrl: 'https://via.placeholder.com/150x200?text=E-paper+11+Dec',
        fileName: 'epaper_11_dec_2025.pdf',
        views: 280
    }
];

export const epaperService = {
    getAllEpapers: async (filters = {}) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filtered = [...epapers];

                if (filters.startDate && filters.endDate) {
                    const start = new Date(filters.startDate).getTime();
                    const end = new Date(filters.endDate).getTime();
                    filtered = filtered.filter(e => {
                        const eDate = new Date(e.date).getTime();
                        return eDate >= start && eDate <= end;
                    });
                }

                // Sort by date desc
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

                resolve({ data: filtered, total: filtered.length });
            }, 500);
        });
    },

    uploadEpaper: async (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newEpaper = {
                    id: Date.now(),
                    date: data.date,
                    fileName: data.file.name,
                    pdfUrl: URL.createObjectURL(data.file), // Mock URL
                    coverUrl: data.coverImage ? URL.createObjectURL(data.coverImage) : 'https://via.placeholder.com/150x200?text=No+Cover',
                    views: 0
                };
                epapers = [newEpaper, ...epapers];
                resolve({ success: true, data: newEpaper });
            }, 1000);
        });
    },

    deleteEpaper: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                epapers = epapers.filter(e => e.id !== id);
                resolve({ success: true });
            }, 300);
        });
    }
};


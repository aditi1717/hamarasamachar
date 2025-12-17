const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get admin auth token
const getAdminAuthToken = () => {
  return localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
};

/**
 * Get all franchise leads (Admin only)
 * @param {Object} filters - Filter options (status, search, page, limit)
 * @returns {Promise<Object>} Response object with leads data
 */
export const getLeads = async (filters = {}) => {
  try {
    const token = getAdminAuthToken();
    if (!token) {
      throw new Error('Admin authentication required');
    }

    const { status, search, page = 1, limit = 25 } = filters;
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);

    const response = await fetch(`${API_BASE_URL}/admin/franchise-leads?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch franchise leads');
    }

    // Transform API response to match frontend format
    return data.data.map(lead => ({
      id: lead._id,
      name: lead.name,
      phone: lead.phone,
      address: lead.address,
      status: lead.status,
      createdAt: lead.createdAt,
      source: lead.source,
      notes: lead.notes
    }));
  } catch (error) {
    console.error('Get leads error:', error);
    throw error;
  }
};

/**
 * Get lead statistics (Admin only)
 * @returns {Promise<Object>} Statistics object
 */
export const getLeadStats = async () => {
  try {
    const token = getAdminAuthToken();
    if (!token) {
      throw new Error('Admin authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/admin/franchise-leads/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch lead statistics');
    }

    return data.data;
  } catch (error) {
    console.error('Get lead stats error:', error);
    throw error;
  }
};

/**
 * Add a new franchise lead (Public)
 * @param {Object} leadInput - Lead data (name, phone, address, source)
 * @returns {Promise<Object>} Created lead object
 */
export const addLead = async (leadInput) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/franchise-leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadInput)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create franchise lead');
    }

    // Transform API response to match frontend format
    return {
      id: data.data._id,
      name: data.data.name,
      phone: data.data.phone,
      address: data.data.address,
      status: data.data.status,
      createdAt: data.data.createdAt,
      source: data.data.source
    };
  } catch (error) {
    console.error('Add lead error:', error);
    throw error;
  }
};

/**
 * Update franchise lead status (Admin only)
 * @param {string} leadId - Lead ID
 * @param {string} status - New status (new, contacted, closed)
 * @returns {Promise<Object>} Updated lead object
 */
export const updateLeadStatus = async (leadId, status) => {
  try {
    const token = getAdminAuthToken();
    if (!token) {
      throw new Error('Admin authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/admin/franchise-leads/${leadId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update lead status');
    }

    // Transform API response
    return {
      id: data.data._id,
      name: data.data.name,
      phone: data.data.phone,
      address: data.data.address,
      status: data.data.status,
      createdAt: data.data.createdAt,
      source: data.data.source,
      notes: data.data.notes
    };
  } catch (error) {
    console.error('Update lead status error:', error);
    throw error;
  }
};



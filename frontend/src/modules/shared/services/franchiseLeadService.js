const STORAGE_KEY = 'franchise_leads';

// Helper to get all leads from localStorage
const getAllLeadsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading leads from storage:', error);
    return [];
  }
};

// Helper to save leads to localStorage
const saveLeadsToStorage = (leads) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (error) {
    console.error('Error saving leads to storage:', error);
  }
};

/**
 * Get all franchise leads (Admin only) - Using localStorage
 * @param {Object} filters - Filter options (status, search, page, limit)
 * @returns {Promise<Array>} Array of leads
 */
export const getLeads = async (filters = {}) => {
  try {
    const allLeads = getAllLeadsFromStorage();
    
    // Apply filters
    let filtered = [...allLeads];
    
    if (filters.status) {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name?.toLowerCase().includes(searchLower) ||
        lead.phone?.includes(searchLower) ||
        lead.address?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by createdAt (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 25;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return filtered.slice(start, end);
  } catch (error) {
    console.error('Get leads error:', error);
    return [];
  }
};

/**
 * Get lead statistics (Admin only) - Using localStorage
 * @returns {Promise<Object>} Statistics object
 */
export const getLeadStats = async () => {
  try {
    const allLeads = getAllLeadsFromStorage();
    
    return {
      total: allLeads.length,
      new: allLeads.filter(l => l.status === 'new' || !l.status).length,
      contacted: allLeads.filter(l => l.status === 'contacted').length,
      closed: allLeads.filter(l => l.status === 'closed').length
    };
  } catch (error) {
    console.error('Get lead stats error:', error);
    return { total: 0, new: 0, contacted: 0, closed: 0 };
  }
};

/**
 * Add a new franchise lead (Public) - Using localStorage
 * @param {Object} leadInput - Lead data (name, phone, address, source)
 * @returns {Promise<Object>} Created lead object
 */
export const addLead = async (leadInput) => {
  try {
    const allLeads = getAllLeadsFromStorage();
    
    const newLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: leadInput.name || '',
      phone: leadInput.phone || '',
      address: leadInput.address || '',
      status: 'new',
      createdAt: new Date().toISOString(),
      source: leadInput.source || 'website',
      additionalInfo: leadInput.additionalInfo || '',
      qualification: leadInput.qualification || '',
      age: leadInput.age || ''
    };
    
    allLeads.push(newLead);
    saveLeadsToStorage(allLeads);
    
    return newLead;
  } catch (error) {
    console.error('Add lead error:', error);
    throw error;
  }
};

/**
 * Update franchise lead status (Admin only) - Using localStorage
 * @param {string} leadId - Lead ID
 * @param {string} status - New status (new, contacted, closed)
 * @returns {Promise<Object>} Updated lead object
 */
export const updateLeadStatus = async (leadId, status) => {
  try {
    const allLeads = getAllLeadsFromStorage();
    const leadIndex = allLeads.findIndex(l => l.id === leadId);
    
    if (leadIndex === -1) {
      throw new Error('Lead not found');
    }
    
    allLeads[leadIndex] = {
      ...allLeads[leadIndex],
      status: status
    };
    
    saveLeadsToStorage(allLeads);
    
    return allLeads[leadIndex];
  } catch (error) {
    console.error('Update lead status error:', error);
    throw error;
  }
};





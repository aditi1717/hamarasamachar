const STORAGE_KEY = 'hs_franchise_leads';

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
};

const ensureStorage = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

export const getLeads = () => {
  ensureStorage();
  const stored = localStorage.getItem(STORAGE_KEY);
  return safeParse(stored, []);
};

export const addLead = (leadInput) => {
  ensureStorage();
  const leads = getLeads();
  const newLead = {
    id: `lead-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString(),
    ...leadInput,
  };
  const updated = [newLead, ...leads];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newLead;
};

export const updateLeadStatus = (leadId, status) => {
  ensureStorage();
  const leads = getLeads().map((lead) =>
    lead.id === leadId ? { ...lead, status } : lead
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  return leads;
};





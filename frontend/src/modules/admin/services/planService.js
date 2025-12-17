const PLAN_STORAGE_KEY = 'hs_admin_plans';
const SUBSCRIBER_STORAGE_KEY = 'hs_admin_subscribers';

const seedPlans = [
  {
    id: 'plan-monthly-basic',
    name: 'मासिक प्लान',
    billingCycle: 'monthly',
    price: 149,
    description: '30 दिन की पहुँच',
  },
  {
    id: 'plan-yearly-standard',
    name: 'वार्षिक प्लान',
    billingCycle: 'yearly',
    price: 999,
    description: '365 दिन की पहुँच',
  },
];

const seedSubscribers = [
  {
    id: 'sub-001',
    name: 'Ravi Sharma',
    email: 'ravi@example.com',
    phone: '+91 98765 43210',
    planId: 'plan-monthly-basic',
    planName: 'मासिक प्लान',
    billingCycle: 'monthly',
    amount: 149,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    status: 'Active',
  },
  {
    id: 'sub-002',
    name: 'Anita Verma',
    email: 'anita@example.com',
    phone: '+91 99887 76655',
    planId: 'plan-yearly-standard',
    planName: 'वार्षिक प्लान',
    billingCycle: 'yearly',
    amount: 999,
    startDate: '2024-11-10',
    endDate: '2025-11-09',
    status: 'Active',
  },
  {
    id: 'sub-003',
    name: 'Mohit Singh',
    email: 'mohit@example.com',
    phone: '+91 91234 56789',
    planId: 'plan-monthly-basic',
    planName: 'मासिक प्लान',
    billingCycle: 'monthly',
    amount: 149,
    startDate: '2024-11-20',
    endDate: '2024-12-19',
    status: 'Expired',
  },
];

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
};

const ensureSeeds = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(PLAN_STORAGE_KEY)) {
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(seedPlans));
  }

  if (!localStorage.getItem(SUBSCRIBER_STORAGE_KEY)) {
    localStorage.setItem(SUBSCRIBER_STORAGE_KEY, JSON.stringify(seedSubscribers));
  }
};

export const getPlans = () => {
  ensureSeeds();
  const stored = localStorage.getItem(PLAN_STORAGE_KEY);
  return safeParse(stored, seedPlans);
};

export const createPlan = (planInput) => {
  ensureSeeds();
  const plans = getPlans();
  const newPlan = {
    id: `plan-${Date.now()}`,
    ...planInput,
  };
  const updated = [newPlan, ...plans];
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(updated));
  return newPlan;
};

export const deletePlan = (planId) => {
  ensureSeeds();
  const plans = getPlans().filter((plan) => plan.id !== planId);
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plans));
  return plans;
};

export const getSubscribers = () => {
  ensureSeeds();
  const stored = localStorage.getItem(SUBSCRIBER_STORAGE_KEY);
  return safeParse(stored, seedSubscribers);
};

export const addMockSubscriber = (subscriberInput) => {
  // Helper to allow front-end only additions if ever needed
  ensureSeeds();
  const subscribers = getSubscribers();
  const newSubscriber = {
    id: `sub-${Date.now()}`,
    ...subscriberInput,
  };
  const updated = [newSubscriber, ...subscribers];
  localStorage.setItem(SUBSCRIBER_STORAGE_KEY, JSON.stringify(updated));
  return newSubscriber;
};


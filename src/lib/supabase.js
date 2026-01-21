import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
});

// Database table names
export const TABLES = {
  BLOOD_REQUESTS: 'blood_requests',
  INVENTORY: 'inventory',
  AMBULANCES: 'ambulances',
  DONORS: 'donors',
  ADMIN_METRICS: 'admin_metrics',
  USER_PROFILES: 'user_profiles'
};

// Helper functions for common operations
export const dbHelpers = {
  // Blood Requests
  async getBloodRequests(filters = {}) {
    let query = supabase.from(TABLES.BLOOD_REQUESTS).select('*');

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.bloodGroup) query = query.eq('blood_group', filters.bloodGroup);
    if (filters.urgency) query = query.eq('urgency_level', filters.urgency);
    if (filters.city) query = query.ilike('location->>city', filters.city);

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  async createBloodRequest(requestData) {
    const { data, error } = await supabase
      .from(TABLES.BLOOD_REQUESTS)
      .insert([requestData])
      .select()
      .single();
    return { data, error };
  },

  async updateBloodRequest(id, updates) {
    const { data, error } = await supabase
      .from(TABLES.BLOOD_REQUESTS)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Inventory
  async getInventory(filters = {}) {
    let query = supabase.from(TABLES.INVENTORY).select('*');

    if (filters.bloodGroup) query = query.eq('blood_group', filters.bloodGroup);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.bloodBankId) query = query.eq('blood_bank_id', filters.bloodBankId);

    const { data, error } = await query.order('expiry_date', { ascending: true });
    return { data, error };
  },

  async updateInventory(id, updates) {
    const { data, error } = await supabase
      .from(TABLES.INVENTORY)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Ambulances
  async getAmbulances(filters = {}) {
    let query = supabase.from(TABLES.AMBULANCES).select('*');

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.city) query = query.ilike('base_location->>city', filters.city);

    const { data, error } = await query;
    return { data, error };
  },

  async updateAmbulance(id, updates) {
    const { data, error } = await supabase
      .from(TABLES.AMBULANCES)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Donors
  async getDonors(filters = {}) {
    let query = supabase.from(TABLES.DONORS).select('*');

    if (filters.bloodGroup) query = query.eq('blood_group', filters.bloodGroup);
    if (filters.city) query = query.ilike('address->>city', filters.city);
    if (filters.status) query = query.eq('status', filters.status);

    const { data, error } = await query;
    return { data, error };
  },

  // Admin Metrics
  async getAdminMetrics(date, period = 'daily') {
    const { data, error } = await supabase
      .from(TABLES.ADMIN_METRICS)
      .select('*')
      .eq('date', date)
      .eq('period', period)
      .single();
    return { data, error };
  },

  async updateAdminMetrics(date, period, metrics) {
    const { data, error } = await supabase
      .from(TABLES.ADMIN_METRICS)
      .upsert({
        date,
        period,
        ...metrics,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    return { data, error };
  }
};

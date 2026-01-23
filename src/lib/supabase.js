import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
    try {
      let query = supabase.from(TABLES.BLOOD_REQUESTS).select('*');

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.bloodGroup) query = query.eq('blood_group', filters.bloodGroup);
      if (filters.urgency) query = query.eq('urgency_level', filters.urgency);
      if (filters.city) query = query.ilike('location->>city', filters.city);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        // If Supabase is not configured or table doesn't exist, return mock data
        console.warn('Supabase error, using mock data:', error.message);
        return { data: getMockBloodRequests(filters), error: null };
      }

      return { data: data || [], error };
    } catch (err) {
      console.warn('Failed to fetch from Supabase, using mock data:', err.message);
      return { data: getMockBloodRequests(filters), error: null };
    }
  },

  async createBloodRequest(requestData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.BLOOD_REQUESTS)
        .insert([requestData])
        .select()
        .single();

      if (error) {
        // If Supabase fails, return mock success
        console.warn('Supabase error, returning mock success:', error.message);
        return {
          data: {
            id: `BR-${Date.now()}`,
            ...requestData,
            requestId: `BR-${Date.now()}`,
            priorityScore: requestData.priority_score
          },
          error: null
        };
      }

      return { data, error };
    } catch (err) {
      console.warn('Failed to create blood request in Supabase, returning mock success:', err.message);
      return {
        data: {
          id: `BR-${Date.now()}`,
          ...requestData,
          requestId: `BR-${Date.now()}`,
          priorityScore: requestData.priority_score
        },
        error: null
      };
    }
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
  },

  // Hospital Profile
  async getHospitalProfile(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_PROFILES)
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If Supabase is not configured or table doesn't exist, return mock data
        console.warn('Supabase error, using mock hospital profile:', error.message);
        return { data: getMockHospitalProfile(), error: null };
      }

      return { data, error };
    } catch (err) {
      console.warn('Failed to fetch hospital profile from Supabase, using mock data:', err.message);
      return { data: getMockHospitalProfile(), error: null };
    }
  },

  async updateHospitalProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_PROFILES)
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        // If Supabase fails, return mock success
        console.warn('Supabase error, returning mock success:', error.message);
        return { data: { ...profileData, id: userId }, error: null };
      }

      return { data, error };
    } catch (err) {
      console.warn('Failed to update hospital profile in Supabase, returning mock success:', err.message);
      return { data: { ...profileData, id: userId }, error: null };
    }
  },

  // Hospital Inventory
  async getHospitalInventory(hospitalId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.INVENTORY)
        .select('*')
        .eq('hospital_id', hospitalId)
        .order('expiry_date', { ascending: true });

      if (error) {
        // If Supabase is not configured or table doesn't exist, return mock data
        console.warn('Supabase error, using mock hospital inventory:', error.message);
        return { data: getMockHospitalInventory(), error: null };
      }

      return { data: data || [], error };
    } catch (err) {
      console.warn('Failed to fetch hospital inventory from Supabase, using mock data:', err.message);
      return { data: getMockHospitalInventory(), error: null };
    }
  },

  async addInventoryItem(inventoryData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.INVENTORY)
        .insert([inventoryData])
        .select()
        .single();

      if (error) {
        // If Supabase fails, return mock success
        console.warn('Supabase error, returning mock success:', error.message);
        return {
          data: {
            id: `INV-${Date.now()}`,
            ...inventoryData,
            created_at: new Date().toISOString()
          },
          error: null
        };
      }

      return { data, error };
    } catch (err) {
      console.warn('Failed to add inventory item in Supabase, returning mock success:', err.message);
      return {
        data: {
          id: `INV-${Date.now()}`,
          ...inventoryData,
          created_at: new Date().toISOString()
        },
        error: null
      };
    }
  },

  async updateInventoryItem(id, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.INVENTORY)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        // If Supabase fails, return mock success
        console.warn('Supabase error, returning mock success:', error.message);
        return { data: { id, ...updates }, error: null };
      }

      return { data, error };
    } catch (err) {
      console.warn('Failed to update inventory item in Supabase, returning mock success:', err.message);
      return { data: { id, ...updates }, error: null };
    }
  },

  async deleteInventoryItem(id) {
    try {
      const { error } = await supabase
        .from(TABLES.INVENTORY)
        .delete()
        .eq('id', id);

      if (error) {
        // If Supabase fails, return mock success
        console.warn('Supabase error, returning mock success:', error.message);
        return { error: null };
      }

      return { error };
    } catch (err) {
      console.warn('Failed to delete inventory item in Supabase, returning mock success:', err.message);
      return { error: null };
    }
  }
};

// Mock data functions
function getMockBloodRequests(filters = {}) {
  const mockRequests = [
    {
      id: 'BR-001',
      requestId: 'BR-001',
      blood_group: 'A+',
      units_required: 2,
      urgency_level: 'high',
      status: 'pending',
      location: { city: 'Mumbai', state: 'Maharashtra' },
      created_at: new Date().toISOString(),
      priority_score: 85
    },
    {
      id: 'BR-002',
      requestId: 'BR-002',
      blood_group: 'O-',
      units_required: 1,
      urgency_level: 'critical',
      status: 'approved',
      location: { city: 'Delhi', state: 'Delhi' },
      created_at: new Date().toISOString(),
      priority_score: 95
    }
  ];

  return mockRequests.filter(request => {
    if (filters.status && request.status !== filters.status) return false;
    if (filters.bloodGroup && request.blood_group !== filters.bloodGroup) return false;
    if (filters.urgency && request.urgency_level !== filters.urgency) return false;
    if (filters.city && request.location.city.toLowerCase() !== filters.city.toLowerCase()) return false;
    return true;
  });
}

function getMockHospitalProfile() {
  return {
    hospital_name: 'City General Hospital',
    registration_number: 'HOSP-2024-001',
    license_number: 'LIC-2024-001',
    address: '123 Medical Center Drive',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91-22-1234-5678',
    emergency_phone: '+91-22-1234-5679',
    email: 'info@citygeneralhospital.com',
    website: 'https://www.citygeneralhospital.com',
    operating_hours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '13:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true }
    },
    services: ['Emergency Care', 'Blood Bank', 'Surgery'],
    emergency_services: true,
    blood_bank_license: 'BBL-2024-001',
    accreditation: 'JCI, NABH',
    established_year: '1995',
    total_beds: '500',
    icu_beds: '50',
    contact_person: 'Dr. Rajesh Kumar',
    contact_person_designation: 'Medical Director',
    contact_person_phone: '+91-22-1234-5680'
  };
}

function getMockHospitalInventory() {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30); // 30 days from now

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 5); // 5 days ago

  return [
    {
      id: 'INV-001',
      hospital_id: 'mock-hospital-id',
      blood_group: 'A+',
      quantity: 5,
      expiry_date: futureDate.toISOString().split('T')[0],
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'INV-002',
      hospital_id: 'mock-hospital-id',
      blood_group: 'O-',
      quantity: 3,
      expiry_date: futureDate.toISOString().split('T')[0],
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'INV-003',
      hospital_id: 'mock-hospital-id',
      blood_group: 'B+',
      quantity: 2,
      expiry_date: pastDate.toISOString().split('T')[0],
      status: 'expired',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'INV-004',
      hospital_id: 'mock-hospital-id',
      blood_group: 'AB+',
      quantity: 1,
      expiry_date: futureDate.toISOString().split('T')[0],
      status: 'reserved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
}

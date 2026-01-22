const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        data = { message: text || 'Server returned non-JSON response' };
      }

      if (!response.ok) {
        const errorMessage = data.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      // Distinguish between network errors and server errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('Network error - Failed to fetch:', error);
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        console.error('API request failed:', error);
        throw error;
      }
    }
  }

  // Auth methods
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email, password, full_name, role = 'user') {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name, role }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Blood Requests
  async getBloodRequests(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/blood-requests?${queryParams}`);
  }

  async createBloodRequest(requestData) {
    return this.request('/blood-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async updateBloodRequest(id, updates) {
    return this.request(`/blood-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Inventory
  async getInventory(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/inventory?${queryParams}`);
  }

  async updateInventory(id, updates) {
    return this.request(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Ambulances
  async getAmbulances(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/ambulances?${queryParams}`);
  }

  async updateAmbulance(id, updates) {
    return this.request(`/ambulances/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Donors
  async getDonors(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/donors?${queryParams}`);
  }

  // Admin
  async getAdminMetrics(date, period = 'daily') {
    return this.request(`/admin/metrics?date=${date}&period=${period}`);
  }

  async updateAdminMetrics(date, period, metrics) {
    return this.request('/admin/metrics', {
      method: 'POST',
      body: JSON.stringify({ date, period, metrics }),
    });
  }

  // ===== ROLE-BASED API METHODS =====

  // USER DASHBOARD METHODS
  async getUserBloodRequests() {
    return this.request('/user/blood-requests');
  }

  async createUserBloodRequest(requestData) {
    return this.request('/user/blood-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async getUserDonorProfile() {
    return this.request('/user/donor-profile');
  }

  async updateUserDonorProfile(profileData) {
    return this.request('/user/donor-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getNearbyBloodBanks(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`/user/nearby-blood-banks?${queryParams}`);
  }

  async getUserActivity() {
    return this.request('/user/activity');
  }

  // HOSPITAL DASHBOARD METHODS
  async getHospitalBloodRequests(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/hospital/blood-requests?${queryParams}`);
  }

  async updateHospitalBloodRequestStatus(id, status, notes = '') {
    return this.request(`/hospital/blood-requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  async getHospitalEmergencyQueue() {
    return this.request('/hospital/emergency-queue');
  }

  async assignAmbulanceToEmergency(queueId, ambulanceId) {
    return this.request(`/hospital/emergency-queue/${queueId}/assign-ambulance`, {
      method: 'POST',
      body: JSON.stringify({ ambulance_id: ambulanceId }),
    });
  }

  async getHospitalInventory(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/hospital/inventory?${queryParams}`);
  }

  async updateHospitalInventory(id, updates) {
    return this.request(`/hospital/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getHospitalAmbulances(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/hospital/ambulances?${queryParams}`);
  }

  async updateHospitalAmbulanceStatus(id, status, currentLocation = null) {
    return this.request(`/hospital/ambulances/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, current_location: currentLocation }),
    });
  }

  async getHospitalMetrics() {
    return this.request('/hospital/metrics');
  }

  // ADMIN DASHBOARD METHODS
  async getAllBloodRequests(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/admin/blood-requests?${queryParams}`);
  }

  async getAllInventory(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/admin/inventory?${queryParams}`);
  }

  async getAllAmbulances(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/admin/ambulances?${queryParams}`);
  }

  async getAllDonors(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/admin/donors?${queryParams}`);
  }

  async getAdminEmergencyQueue() {
    return this.request('/admin/emergency-queue');
  }

  async getAdminMetrics() {
    return this.request('/admin/metrics');
  }

  async getActivityLogs(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/admin/activity-logs?${queryParams}`);
  }

  async getUserProfiles(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/admin/user-profiles?${queryParams}`);
  }
}

export const apiClient = new ApiClient();

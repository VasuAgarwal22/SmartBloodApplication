const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
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
}

export const apiClient = new ApiClient();

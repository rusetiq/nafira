const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  const hostname = window.location.hostname;
  return `http://${hostname}:5000/api`;
};

const API_BASE_URL = getApiBaseUrl();


class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async register(email, password, name, allergies = '', goals = '') {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, name, allergies, goals }),
    });
    const data = await this.handleResponse(response);
    this.setToken(data.token);
    return data;
  }

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await this.handleResponse(response);
    this.setToken(data.token);
    return data;
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem('user');
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async updateProfile(name, allergies, goals) {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ name, allergies, goals }),
    });
    return this.handleResponse(response);
  }

  async updateSettings({ notifications, processingPreference } = {}) {
    const body = {};
    if (notifications !== undefined) body.notifications = notifications;
    if (processingPreference !== undefined) body.processing_preference = processingPreference;
    if (!Object.keys(body).length) return;
    const response = await fetch(`${API_BASE_URL}/user/settings`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  }

  async getQuickStats() {
    const response = await fetch(`${API_BASE_URL}/user/quick-stats`, {
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async getBadges() {
    const response = await fetch(`${API_BASE_URL}/user/badges`, {
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch badges');
    return response.json();
  }

  async getAIFocus() {
    const response = await fetch(`${API_BASE_URL}/user/ai-focus`, {
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch AI focus');
    return response.json();
  }

  async analyzeMeal(file, name) {
    const formData = new FormData();
    formData.append('image', file);
    if (name) formData.append('name', name);
    const headers = {};
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const response = await fetch(`${API_BASE_URL}/meals`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    });
    return this.handleResponse(response);
  }

  async getRecentMeals() {
    const response = await fetch(`${API_BASE_URL}/meals/recent`, {
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async getMealHistory(limit = 50) {
    const response = await fetch(`${API_BASE_URL}/meals/history?limit=${limit}`, {
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async getWeeklyStats() {
    const response = await fetch(`${API_BASE_URL}/meals/weekly-stats`, {
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  // Generic HTTP methods for new features
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async put(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async delete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  isAuthenticated() {
    return !!this.token;
  }
}

const apiService = new ApiService();
export default apiService;

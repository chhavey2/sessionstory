const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const json = await response.json().catch(() => ({}));

    // SessionStory API: success responses have { statusCode, data, message, success: true }
    // Error responses have { statusCode, message } (from ApiError)
    if (!response.ok) {
      throw new Error(json.message || 'Something went wrong');
    }

    if (json.success === false || (json.statusCode && json.statusCode >= 400)) {
      throw new Error(json.message || 'Something went wrong');
    }

    // Return data for success responses (login/signup return user + token in data)
    return json.data != null ? json.data : json;
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signin(email, password) {
    return this.login(email, password);
  }

  async signup(name, email, password) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getSession(sessionId) {
    return this.request(`/session/${sessionId}`);
  }

  async getUserSessions(userId) {
    return this.request(`/session/user/${userId}`);
  }
}

const api = new ApiService();
export default api;

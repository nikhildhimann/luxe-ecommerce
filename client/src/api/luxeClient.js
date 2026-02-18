import axios from 'axios';

// Create axios instance
const api = axios.create({
  // @ts-ignore
  baseURL: import.meta.env.VITE_API_URL || '/api', // Use environment variable or default proxy
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Don't retry auth requests or 429 errors (rate limiting)
    if (error.response && (error.response.status === 429 || originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/register'))) {
      return Promise.reject(error);
    }
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const { data } = await api.post('/auth/refresh');
        
        // Update local storage with new access token
        localStorage.setItem('token', data.token);
        
        // Update header for original request
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        
        // Retry original request
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('token');
        // window.location.href = '/login'; // Optional: Redirect
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


// MOCK SDK INTERFACE
export const luxe = {
  auth: {
    login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        return data; 
    },
    register: async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('token', data.token);
        return data;
    },
    logout: async (redirectUrl) => {
    	try {
        	await api.post('/auth/logout');
    	} catch (e) {
    		console.error("Logout error", e);
    	}
        localStorage.removeItem('token');
        if (redirectUrl) window.location.href = redirectUrl;
    },
    me: async () => {
        const { data } = await api.get('/auth/me');
        return data;
    },
    isAuthenticated: async () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
            await api.get('/auth/me');
            return true;
        } catch (e) {
            return false;
        }
    },
    redirectToLogin: (redirectUrl) => {
        window.location.href = `/login?redirect=${encodeURIComponent(redirectUrl || window.location.href)}`;
    }
  },
  entities: {
    Product: {
      list: async (sort, limit) => {
          const params = new URLSearchParams();
          if (sort) params.append('sort', sort);
          if (limit) params.append('limit', String(limit));
          
          const { data } = await api.get(`/products?${params.toString()}`);
          return data.data || data;
      },
      
      // New pagination endpoint
      listPaginated: async (options = {}) => {
          const {
            page = 1,
            limit = 20,
            search = '',
            category = [],
            gender = [],
            minPrice = 0,
            maxPrice = 10000,
            minRating = 0,
            sort = '-created_date',
            newArrivals = false,
            featured = false
          } = options;

          let params = new URLSearchParams();
          params.append('page', String(page));
          params.append('limit', String(limit));
          params.append('sort', sort);
          
          if (search) params.append('search', search);
          if (minPrice > 0) params.append('minPrice', minPrice);
          if (maxPrice < 10000) params.append('maxPrice', maxPrice);
          if (minRating > 0) params.append('minRating', minRating);
          if (newArrivals) params.append('newArrivals', 'true');
          if (featured) params.append('featured', 'true');
          
          // Add categories
          if (Array.isArray(category) && category.length > 0) {
            category.forEach(cat => params.append('category', cat));
          } else if (category) {
            params.append('category', category);
          }
          
          // Add genders
          if (Array.isArray(gender) && gender.length > 0) {
            gender.forEach(g => params.append('gender', g));
          } else if (gender) {
            params.append('gender', gender);
          }

          const { data } = await api.get(`/products?${params.toString()}`);
          return data;
      },
      
      filter: async (query, sort = '-created_date', limit = 8) => {
          if (query.id) {
              try {
                const { data } = await api.get(`/products/${query.id}`);
                return [data]; 
              } catch (e) {
                  return [];
              }
          }
          
          let params = new URLSearchParams();
          if (sort) params.append('sort', sort);
          if (limit) params.append('limit', String(limit));
          
          if (query.category) {
              params.append('category', query.category);
          }
          if (query.keyword) {
              params.append('keyword', query.keyword);
          }
          if (query.featured) {
              params.append('featured', 'true');
          }
          if (query.new_arrival) {
              params.append('newArrivals', 'true');
          }
          if (query.minPrice) {
              params.append('minPrice', query.minPrice);
          }
          if (query.maxPrice) {
              params.append('maxPrice', query.maxPrice);
          }

          const { data } = await api.get(`/products?${params.toString()}`);
          // Extract data array from paginated response
          return data.data || data;
      }
    },
    CartItem: {
      list: async () => {
          const { data } = await api.get('/cart');
          return data;
      },
      create: async (data) => {
          const res = await api.post('/cart', data);
          return res.data;
      },
      update: async (id, data) => {
          const res = await api.put(`/cart/${id}`, data);
          return res.data;
      },
      delete: async (id) => {
          const res = await api.delete(`/cart/${id}`);
          return res.data;
      }
    },
    Wishlist: {
        create: async (data) => {
            const res = await api.post('/wishlist', data);
            return res.data;
        },
        list: async () => {
            const { data } = await api.get('/wishlist');
            return data;
        },
        delete: async (id) => {
            const res = await api.delete(`/wishlist/${id}`);
            return res.data;
        }
    },
    Order: {
        create: async (data) => {
            const { data: order } = await api.post('/orders', data);
            return order;
        },
        list: async (sort, limit) => {
            const { data } = await api.get('/orders/myorders');
            return data;
        },
        get: async (id) => {
             const { data } = await api.get(`/orders/${id}`);
             return data;
        }
    }
  },
  appLogs: {
      logUserInApp: async (pageName) => {
          // No-op for now, or could log to backend if we had an endpoint
          console.debug(`[Mock Log] User navigated to ${pageName}`);
          return true;
      }
  }
};

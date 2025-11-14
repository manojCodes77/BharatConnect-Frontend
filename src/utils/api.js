import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors (token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is 401 (Unauthorized) - token expired or invalid
    if (error.response && error.response.status === 401) {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Dispatch logout action if store is available
      // We'll handle this in App.jsx to avoid circular dependencies
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const signUp = async (userData) => {
  const response = await api.post('/users/sign-up', userData);
  return response.data;
};

export const signIn = async (userData) => {
  const response = await api.post('/users/sign-in', userData);
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Post APIs
export const createPost = async (postData) => {
  // Check if postData is FormData (for image uploads)
  const isFormData = postData instanceof FormData;
  
  const response = await api.post('/posts', postData, {
    headers: isFormData ? {
      'Content-Type': 'multipart/form-data',
    } : undefined,
  });
  return response.data;
};

export const getAllPosts = async (limit = 10, cursor = null) => {
  const params = { limit };
  if (cursor) {
    params.cursor = cursor;
  }
  const response = await api.get('/posts', { params });
  return response.data;
};

export const getMyPosts = async () => {
  const response = await api.get('/posts/my-posts');
  return response.data;
};

export const getPostById = async (postId) => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};

export const updatePost = async (postId, postData) => {
  const response = await api.put(`/posts/${postId}`, postData);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
};

// Interaction APIs
export const likePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`);
  return response.data;
};

export const commentPost = async (postId, text) => {
  const response = await api.post(`/posts/${postId}/comment`, { text });
  return response.data;
};

export const savePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/save`);
  return response.data;
};

export const sharePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/share`);
  return response.data;
};

export default api;

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/axiosInterceptor';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {

    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;

      return {
        ...state,
        isAuthenticated: true,
        user: { ...action.payload.user },   // ensure new reference
        token: action.payload.token,
        loading: false,
        error: null
      };

    case 'LOGOUT':
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];

      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...action.payload },  // force new object reference
        loading: false
      };

    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 🔥 Initialize Auth on App Load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          const response = await api.get('/auth/me');

          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              token,
              user: response.data.user
            }
          });

        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  // 🔥 LOGIN
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await api.post('/auth/login', { email, password });

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data
      });

      toast.success('Login successful!');
      return response.data;

    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  // 🔥 REGISTER
  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await api.post('/auth/register', userData);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data
      });

      toast.success('Registration successful!');
      return response.data;

    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  // 🔥 LOGOUT
  const logout = async () => {
    try {
      await api.get('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    }
  };

  // 🔥 FIXED PROFILE UPDATE (IMPORTANT PART)
  const updateProfile = useCallback(async (userData) => {
    try {
      await api.put('/auth/profile', userData);
      const freshUser = await api.get('/auth/me');

      dispatch({
        type: 'UPDATE_USER',
        payload: freshUser.data.user
      });

      toast.success('Profile updated successfully!');
      return freshUser.data;

    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

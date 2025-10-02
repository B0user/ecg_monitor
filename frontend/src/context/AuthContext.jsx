import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config.js';
import { API } from '../api/index.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('ecg_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ecg_token'));

  useEffect(() => {
    // Ensure axios targets our API base
    axios.defaults.baseURL = API_BASE;
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await API.login(email, password);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('ecg_user', JSON.stringify(res.user));
    localStorage.setItem('ecg_token', res.token);
    return res.user;
  };

  const register = async (payload) => {
    const res = await API.register(payload);
    return res.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ecg_user');
    localStorage.removeItem('ecg_token');
  };

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

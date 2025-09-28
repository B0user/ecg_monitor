import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('ecg_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ecg_token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem('ecg_user', JSON.stringify(res.data.user));
    localStorage.setItem('ecg_token', res.data.token);
    return res.data.user;
  };

  const register = async (payload) => {
    const res = await axios.post('/api/auth/register', payload);
    return res.data.user;
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

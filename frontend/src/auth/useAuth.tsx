import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

export type User = { id: string; email: string; name?: string | null; pictureUrl?: string | null };
type AuthCtx = {
  user: User | null;
  token: string | null;
  loginWithGoogleIdToken: (idToken: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const loginWithGoogleIdToken = async (idToken: string) => {
    const { data } = await api.post('/auth/google', { idToken });
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  useEffect(() => {}, []);

  return (
    <AuthContext.Provider value={{ user, token, loginWithGoogleIdToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

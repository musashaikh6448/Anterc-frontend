import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCustomerProfile } from './api/customerApi';
import { getAdminProfile } from './api/adminApi';

interface User {
  _id: string;
  name: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Try to get user profile - first try customer, then admin
          try {
            const { data } = await getCustomerProfile();
            setUser(data);
          } catch (customerError) {
            // If customer profile fails, try admin profile
            try {
              const { data } = await getAdminProfile();
              setUser(data);
            } catch (adminError) {
              throw adminError;
            }
          }
        } catch (error) {
          console.error('Auth check failed', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

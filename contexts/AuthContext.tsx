import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, clearAuth as apiClearAuth } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'PROFESSOR';
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const authString = await getAuth();
        if (authString) {
          const authData = JSON.parse(authString);
          setUser(authData.user);
          setToken(authData.token);
        }
      } catch (e) {
        console.error('Failed to load auth data', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const login = async (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
  };

  const logout = async () => {
    await apiClearAuth();
    setUser(null);
    setToken(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!token, 
        isLoading, 
        login, 
        logout,
        updateUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  async function register(email: string, password: string, displayName: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      displayName
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  }

  async function login(email: string, password: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      displayName: email.split('@')[0]
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  }

  async function logout() {
    localStorage.removeItem('user');
    setCurrentUser(null);
  }

  async function resetPassword(email: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, this would send a password reset email
  }

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
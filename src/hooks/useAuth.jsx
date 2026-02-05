import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { authService } from '@/api/authService';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      setUser(response.user || { email });
      setIsLoggedIn(true);
      toast.success('Logged in successfully');
      return response;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await authService.registerConsultant(data);
      setUser(response.user || { email: data.email, role: 'consultant' });
      setIsLoggedIn(true);
      toast.success('Registration successful');
      return response;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
  }, []);

  const value = {
    user,
    loading,
    isLoggedIn,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
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

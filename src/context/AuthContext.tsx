import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, AuthState } from '../types';
import { initialUser } from '../data/mockData';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    pass: string,
    institution?: string,
    chronotype?: 'early_bird' | 'afternoon_flow' | 'night_owl'
  ) => Promise<void>;
  loginWithGoogle: (email?: string, name?: string, avatar?: string) => Promise<void>;
  loginWithSSO: (institution: string, email: string) => Promise<void>;
  loginDemoUser: () => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('procastinot_user');
    const token = localStorage.getItem('procastinot_token');
    if (saved && token) {
      try {
        return {
          isAuthenticated: true,
          user: JSON.parse(saved),
          token,
          isLoading: false,
        };
      } catch {
        // fallback
      }
    }
    // Default: unauthenticated. Only free Pomodoro Timer is accessible until logged in.
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    };
  });

  useEffect(() => {
    if (authState.user && authState.token) {
      localStorage.setItem('procastinot_user', JSON.stringify(authState.user));
      localStorage.setItem('procastinot_token', authState.token);
    } else {
      localStorage.removeItem('procastinot_user');
      localStorage.removeItem('procastinot_token');
    }
  }, [authState.user, authState.token]);

  const login = async (email: string, _pass: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    await new Promise(r => setTimeout(r, 600)); // simulate auth network request
    const user: UserProfile = {
      ...initialUser,
      email,
      name: email.split('@')[0],
    };
    setAuthState({
      isAuthenticated: true,
      user,
      token: `jwt_sess_${Date.now()}`,
      isLoading: false,
    });
  };

  const register = async (
    name: string,
    email: string,
    _pass: string,
    institution: string = 'Stanford University',
    chronotype: 'early_bird' | 'afternoon_flow' | 'night_owl' = 'afternoon_flow'
  ) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    await new Promise(r => setTimeout(r, 600));

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      role: 'student',
      institution: institution.trim() || 'Stanford University',
      chronotype,
      streak: 1,
      streakFreezes: 2,
      focusPoints: 500, // +500 Welcome Bonus!
      level: 1,
      activeTheme: 'clay_orange',
      unlockedThemes: ['clay_orange'],
      unlockedBadges: ['freshman_stride'],
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setAuthState({
      isAuthenticated: true,
      user: newUser,
      token: `jwt_sess_${Date.now()}`,
      isLoading: false,
    });
  };

  const loginWithGoogle = async (customEmail?: string, customName?: string, customAvatar?: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    await new Promise(r => setTimeout(r, 500));
    const email = customEmail || 'alex.chen.developer@gmail.com';
    const name = customName || (customEmail ? customEmail.split('@')[0].replace('.', ' ') : 'Alex Chen (Google SSO)');
    const avatar = customAvatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;

    setAuthState({
      isAuthenticated: true,
      user: {
        ...initialUser,
        id: `google_usr_${Date.now()}`,
        name,
        email,
        avatar,
        institution: 'Google Scholar Hub',
      },
      token: `google_oauth_${Date.now()}`,
      isLoading: false,
    });
  };

  const loginWithSSO = async (institution: string, email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    await new Promise(r => setTimeout(r, 800));
    setAuthState({
      isAuthenticated: true,
      user: {
        ...initialUser,
        name: email.split('@')[0].replace('.', ' '),
        email,
        institution,
      },
      token: `edu_sso_${Date.now()}`,
      isLoading: false,
    });
  };

  const loginDemoUser = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    await new Promise(r => setTimeout(r, 400));
    setAuthState({
      isAuthenticated: true,
      user: initialUser,
      token: 'jwt_mock_token_stanford_alex_chen',
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('procastinot_user');
    localStorage.removeItem('procastinot_token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    });
  };

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setAuthState(prev => {
      if (!prev.user) return prev;
      return {
        ...prev,
        user: { ...prev.user, ...updates },
      };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        loginWithGoogle,
        loginWithSSO,
        loginDemoUser,
        logout,
        updateUser,
      }}
    >
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

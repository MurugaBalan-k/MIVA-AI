import React, { createContext, useContext, useState } from 'react';

const API_BASE =
  import.meta.env.VITE_API_URL || 'https://miva-ai-api.vercel.app';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Screens:
  // 'welcome', 'signup', 'login', 'admin-login',
  // 'profile-setup', 'app', 'admin-dashboard', 'mobile-showcase'

  const [currentScreen, setCurrentScreen] = useState(() => {
    const savedUser = localStorage.getItem('miva_user');
    const savedAdmin = localStorage.getItem('miva_admin');

    if (savedAdmin) return 'admin-dashboard';

    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return parsed.isProfileComplete ? 'app' : 'profile-setup';
    }

    return 'welcome';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('miva_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('miva_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('miva_token') || null;
  });

  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // USER SIGNUP
  // ==========================================
  const signup = async ({
    fullName,
    email,
    password,
    confirmPassword
  }) => {
    setIsLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Failed to create account.'
        );
      }

      setAuthSuccess('Account created successfully.');

      return {
        success: true
      };
    } catch (err) {
      setAuthError(err.message);

      return {
        success: false,
        error: err.message
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // USER LOGIN
  // ==========================================
  const login = async ({ email, password }) => {
    setIsLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Invalid credentials.'
        );
      }

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem(
        'miva_user',
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        'miva_token',
        data.token
      );

      if (data.user.isProfileComplete) {
        setCurrentScreen('app');
      } else {
        setCurrentScreen('profile-setup');
      }

      return {
        success: true
      };
    } catch (err) {
      setAuthError(err.message);

      return {
        success: false,
        error: err.message
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // ADMIN LOGIN
  // ==========================================
  const adminLogin = async ({ adminId, password }) => {
    setIsLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const res = await fetch(
        `${API_BASE}/api/auth/admin-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            adminId,
            password
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Admin verification failed.'
        );
      }

      setAdmin(data.admin);
      setToken(data.token);

      localStorage.setItem(
        'miva_admin',
        JSON.stringify(data.admin)
      );

      localStorage.setItem(
        'miva_token',
        data.token
      );

      setCurrentScreen('admin-dashboard');

      return {
        success: true
      };
    } catch (err) {
      setAuthError(err.message);

      return {
        success: false,
        error: err.message
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // PROFILE SETUP
  // ==========================================
  const updateProfile = async ({
    fullName,
    employeeId,
    role,
    department,
    profilePhoto
  }) => {
    if (!user) {
      return {
        success: false,
        error: 'No active user session.'
      };
    }

    setIsLoading(true);
    setAuthError('');

    try {
      const res = await fetch(
        `${API_BASE}/api/auth/profile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user.id,
            fullName: fullName || user.fullName,
            employeeId,
            role,
            department,
            profilePhoto
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Failed to update profile.'
        );
      }

      const updatedUser = {
        ...data.user,
        isProfileComplete: true
      };

      setUser(updatedUser);

      localStorage.setItem(
        'miva_user',
        JSON.stringify(updatedUser)
      );

      setCurrentScreen('app');

      return {
        success: true
      };
    } catch (err) {
      setAuthError(err.message);

      return {
        success: false,
        error: err.message
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = () => {
    setUser(null);
    setAdmin(null);
    setToken(null);

    localStorage.removeItem('miva_user');
    localStorage.removeItem('miva_admin');
    localStorage.removeItem('miva_token');

    setAuthError('');
    setAuthSuccess('');

    setCurrentScreen('welcome');
  };

  return (
    <AuthContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,

        user,
        admin,
        token,

        authError,
        setAuthError,

        authSuccess,
        setAuthSuccess,

        isLoading,

        signup,
        login,
        adminLogin,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
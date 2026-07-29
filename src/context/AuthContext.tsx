import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEFAULT_ADMIN_EMAIL, INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  loginWithGoogle: (customEmail?: string, customName?: string, forcedRole?: UserRole) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  updateDcCode: (dcCode: string, dcName?: string) => void;
}

const STORAGE_KEY_USER = 'dc_portal_logged_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved user', e);
    }
    // Default to the Northeast Express Founders Admin account on first launch for rich preview experience
    return INITIAL_USERS[0];
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase();

  const loginWithGoogle = (customEmail?: string, customName?: string, forcedRole?: UserRole) => {
    const emailToUse = (customEmail || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
    const isAdminEmail = emailToUse === DEFAULT_ADMIN_EMAIL.toLowerCase() || emailToUse.includes('admin') || forcedRole === 'ADMIN';

    const role: UserRole = forcedRole || (isAdminEmail ? 'ADMIN' : 'DC_USER');
    const name = customName || (isAdminEmail ? 'DC Admin (Google)' : 'DC Delivery Agent');

    const newUser: User = {
      id: `google-user-${Date.now()}`,
      name: name,
      email: emailToUse,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      role: role,
      dcCode: 'DC-GAU-01',
      dcName: 'Guwahati Central Hub',
    };

    setCurrentUser(newUser);
    setShowAuthModal(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      role: newRole,
    };
    setCurrentUser(updatedUser);
  };

  const updateDcCode = (newDcCode: string, newDcName?: string) => {
    const trimmedCode = newDcCode.trim().toUpperCase();
    if (!trimmedCode) return;

    const nameToUse = newDcName?.trim() || `${trimmedCode} Hub`;

    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        dcCode: trimmedCode,
        dcName: nameToUse,
      });
    } else {
      // If no user logged in, create default session with new DC
      setCurrentUser({
        id: `user-dc-${Date.now()}`,
        name: 'DC Agent',
        email: 'dc.agent@express.in',
        role: 'DC_USER',
        dcCode: trimmedCode,
        dcName: nameToUse,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin,
        showAuthModal,
        setShowAuthModal,
        loginWithGoogle,
        logout,
        switchRole,
        updateDcCode,
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

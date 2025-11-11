import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock user data untuk testing - replace dengan implementasi sebenarnya
  const mockUsers: { [key: string]: User } = useMemo(() => ({
    'ibu.a@example.com': {
      uid: 'user1',
      email: 'ibu.a@example.com',
      nama: 'Ibu A',
      peran: 'Staf Input',
      departemen: 'Umum'
    },
    'ibu.b@example.com': {
      uid: 'user2',
      email: 'ibu.b@example.com',
      nama: 'Ibu B',
      peran: 'Verifikator Awal',
      departemen: 'Verifikasi'
    },
    'admin@example.com': {
      uid: 'admin',
      email: 'admin@example.com',
      nama: 'Admin',
      peran: 'Admin',
      departemen: 'IT'
    }
  }), []);

  useEffect(() => {
    // Skip Firebase Auth untuk demo agar tidak conflict dengan mock login
    setLoading(false);
    return () => {};
  }, [mockUsers]);

  const login = async (email: string, password: string): Promise<void> => {
    // Mock login - dalam implementasi sebenarnya gunakan Firebase Auth
    console.log('Login attempt:', email);

    // Simulasi delay untuk loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulasi login berhasil untuk testing
    if (mockUsers[email]) {
      const userData = mockUsers[email];
      setCurrentUser(userData);
      console.log('Login successful:', userData);
    } else {
      throw new Error('Email tidak terdaftar');
    }
  };

  const logout = async (): Promise<void> => {
    // Dalam implementasi sebenarnya gunakan auth.signOut()
    setCurrentUser(null);
    setFirebaseUser(null);
  };

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!currentUser) return false;
    if (currentUser.peran === 'Admin') return true;
    return requiredRoles.includes(currentUser.peran);
  };

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    loading,
    login,
    logout,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};